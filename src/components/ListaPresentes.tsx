import React, { useState, useEffect } from 'react';
import { Search, Gift as GiftIcon, Heart, Check, CreditCard, Copy, Eye, Send } from 'lucide-react';
import { Gift, Purchase } from '../types';

interface ListaPresentesProps {
  weddingDate: string;
  pixKey: string;
  pixHolder: string;
  onPurchaseSuccess: () => void; // Refresh admin stats if they are open
}

export default function ListaPresentes({
  weddingDate,
  pixKey,
  pixHolder,
  onPurchaseSuccess
}: ListaPresentesProps) {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering & Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('TODOS');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOrder, setSortOrder] = useState<'default' | 'price_asc' | 'price_desc'>('default');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Modal State
  const [activeModal, setActiveModal] = useState<'closed' | 'payment_form' | 'processing' | 'success'>('closed');
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [isHoneymoonFund, setIsHoneymoonFund] = useState(false);
  const [customAmount, setCustomAmount] = useState('200');

  // Form State
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [copied, setCopied] = useState(false);

  // Credit Card Form State
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Simulated live notification feed for the active session
  const [sessionEmails, setSessionEmails] = useState<any[]>([]);

  const fetchGifts = async () => {
    try {
      const res = await fetch('/api/gifts');
      const data = await res.json();
      if (data.gifts) {
        setGifts(data.gifts);
      }
    } catch (e) {
      console.error('Error fetching gifts:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGifts();
  }, []);

  // Filter products
  const filteredGifts = gifts.filter((gift) => {
    const matchesSearch = gift.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'TODOS' || gift.category.toUpperCase() === selectedCategory.toUpperCase();
    
    const minVal = parseFloat(minPrice);
    const matchesMin = isNaN(minVal) || gift.price >= minVal;

    const maxVal = parseFloat(maxPrice);
    const matchesMax = isNaN(maxVal) || gift.price <= maxVal;

    return matchesSearch && matchesCategory && matchesMin && matchesMax;
  });

  const sortedGifts = [...filteredGifts].sort((a, b) => {
    if (sortOrder === 'price_asc') {
      return a.price - b.price;
    }
    if (sortOrder === 'price_desc') {
      return b.price - a.price;
    }
    return 0; // default order
  });

  // Categories list extracted dynamically + hardcoded standard categories
  const categories = ['TODOS', 'COZINHA', 'ELETRODOMÉSTICOS', 'MÓVEIS', 'CAMA E BANHO', 'DIVERSOS'];

  // Calculate paginated gifts
  const totalPages = Math.ceil(sortedGifts.length / itemsPerPage) || 1;
  const paginatedGifts = sortedGifts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // If filter changes, reset page
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Open transaction modal
  const openPurchaseModal = (gift: Gift, isFlexible: boolean = false) => {
    setSelectedGift(gift);
    setIsHoneymoonFund(isFlexible);
    if (isFlexible) {
      setCustomAmount('350');
    }
    setActiveModal('payment_form');
  };

  // Handle Copy PIX key
  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Submit simulated transaction to API
  const handleConfirmPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerEmail) {
      alert('Por favor, preencha seu nome e e-mail.');
      return;
    }

    setActiveModal('processing');

    // Prepare simulated gift purchase
    const giftId = isHoneymoonFund ? 'gift-custom-honeymoon' : selectedGift?.id;
    const finalAmount = isHoneymoonFund ? parseFloat(customAmount) : selectedGift?.price || 0;
    const finalGiftName = isHoneymoonFund ? `Cota de Lua de Mel - Contribuição Flexível` : selectedGift?.name || '';

    // If honeymoon cota, we can either create it or simulate it on a special ID on the server
    // Since we want this to update general stats on the server, if it is a honeymoon fund, 
    // we fetch /api/gifts to check if we can simulate purchasing a specific honeymoon cota.
    // To make it simple, we can make the API call to /api/gifts/:id/buy where :id is the gift ID.
    // Let's find or buy on the fly.
    let targetGiftId = giftId || '';
    if (isHoneymoonFund) {
      // Find the first honeymoon fund cota or use any honeymoon gift
      const honeymoonGift = gifts.find(g => g.name.toLowerCase().includes('cota') || g.id.includes('custom-honeymoon'));
      targetGiftId = honeymoonGift ? honeymoonGift.id : 'gift-36'; // Fallback to item 36 (Cotas de lua de mel!)
    }

    try {
      const res = await fetch(`/api/gifts/${targetGiftId}/buy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          buyerName,
          buyerEmail,
          paymentMethod,
          amount: finalAmount
        })
      });

      const responseData = await res.json();
      
      if (res.ok) {
        // Add emails into local session log list to show the user instantly
        const formattedPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(finalAmount);
        
        const guestEmailSim = {
          id: `sim-g-${Date.now()}`,
          recipient: buyerEmail,
          subject: `[Casamento de Letielly & Wenderson] Obrigado pelo seu presente! 🎁`,
          sender: `Letielly & Wenderson <casamento@noivos.com>`,
          body: `Olá ${buyerName},\n\nAgradecemos imensamente pelo seu gesto de carinho ao nos presentear com:\n🎁 ${finalGiftName} (${formattedPrice})\n\nSua contribuição via ${paymentMethod === 'pix' ? 'PIX' : 'Cartão de Crédito'} foi confirmada e convertida em saldo para nossa Lua de Mel e montagem do nosso novo lar.\n\nSua presença é o nosso maior presente!\n\nCom carinho,\nLetielly & Wenderson`
        };

        const coupleEmailSim = {
          id: `sim-c-${Date.now()}`,
          recipient: `${pixHolder.toLowerCase().replace(/\s+/g, '')}@noivos.com`,
          subject: `[Novo Presente Recebido!] ${buyerName} enviou: ${finalGiftName}`,
          sender: `Gestão de Celebração <sistema@casamento.com>`,
          body: `Olá Letielly & Wenderson,\n\nVocês receberam um novo presente na lista virtual!\nConvidado(a): ${buyerName} (${buyerEmail})\nPresente: ${finalGiftName}\nValor: ${formattedPrice}\n\n*Nota*: O valor correspondente foi arrecadado integralmente em dinheiro na sua carteira virtual.`
        };

        setSessionEmails(prev => [coupleEmailSim, guestEmailSim, ...prev]);

        // Success state
        setActiveModal('success');
        fetchGifts(); // reload gifts status
        onPurchaseSuccess(); // notify parent
      } else {
        alert(responseData.error || 'Ocorreu um erro ao processar o pagamento.');
        setActiveModal('payment_form');
      }
    } catch (err) {
      console.error('Error buying gift:', err);
      alert('Erro de conexão ao simular o pagamento.');
      setActiveModal('payment_form');
    }
  };

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="label-text text-xs text-olive font-semibold tracking-widest block mb-2">PRESENTEIE OS NOIVOS</span>
          <h2 className="font-serif text-charcoal text-4xl sm:text-5xl font-medium tracking-tight">Lista de Presentes</h2>
          <div className="elegant-divider" />
          <p className="font-sans text-charcoal/70 text-base max-w-2xl mx-auto font-light leading-relaxed">
            Sua presença é o nosso maior presente. Mas, caso deseje nos abençoar, selecionamos algumas experiências e utensílios simbólicos para nos ajudar a construir nosso novo lar.
            <br />
            <span className="text-terracotta font-medium italic mt-2 block">
              Nota: Todas as contribuições da lista são recebidas pelos noivos integralmente em dinheiro (saldo virtual).
            </span>
          </p>
        </div>

        {/* 1. HONEYMOON FEATURE CARD */}
        <div className="relative rounded-sm overflow-hidden mb-16 shadow-lg border border-olive/10 group min-h-[320px] flex items-center bg-[#FDFBFAF2]">
          {/* Background image half split on desktop */}
          <div className="absolute inset-y-0 right-0 w-full md:w-1/2 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80')` // Mediterranean coast
            }}
          />
          {/* Dark Overlay for mobile */}
          <div className="absolute inset-0 bg-charcoal/25 md:bg-transparent mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FDFBFAF2] via-[#FDFBFAF2]/95 to-transparent hidden md:block" />
          <div className="absolute inset-0 bg-black/40 md:hidden" />

          {/* Feature text */}
          <div className="relative z-10 w-full md:w-1/2 p-8 md:p-12 flex flex-col items-start justify-center text-white md:text-charcoal space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-terracotta/10 border border-terracotta/20 rounded-full text-xs font-semibold text-terracotta bg-white/95 md:bg-transparent">
              <Heart size={12} className="fill-terracotta text-terracotta" /> DESTAQUE DA LISTA
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight leading-tight">
              Fundo de Lua de Mel! ✈️
            </h3>
            <p className="font-sans text-sm md:text-charcoal/75 text-white/90 font-light leading-relaxed max-w-md">
              Deseja nos ajudar com nossa tão sonhada viagem de Lua de Mel? Contribua com qualquer valor para apoiar nossos passeios, jantares românticos e passagens aéreas!
            </p>
            <button
              onClick={() => openPurchaseModal(gifts[35] || { id: 'gift-36', name: 'Cota de Lua de Mel', price: 350, category: 'Diversos', status: 'disponivel', imageUrl: '' }, true)}
              className="mt-2 bg-terracotta hover:bg-terracotta-hover text-white font-label tracking-widest text-xs uppercase font-bold py-3.5 px-6 rounded-sm shadow-md transition-all hover:scale-105 active:scale-95"
            >
              CONTRIBUIR COM QUALQUER VALOR ♥
            </button>
          </div>
        </div>

        {/* 2. SEARCH AND FILTER CONTROLS */}
        <div className="bg-[#F5EFEB] p-4 sm:p-6 rounded-sm mb-10 border border-olive/10 shadow-sm space-y-3">

          {/* Category Tabs — full-width scrollable row */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const active = selectedCategory.toUpperCase() === cat.toUpperCase();
              return (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`px-4 py-2 text-xs font-label uppercase tracking-wider rounded-sm transition-all shrink-0 border ${
                    active
                      ? 'bg-terracotta text-white border-terracotta font-semibold'
                      : 'bg-white text-charcoal/70 border-olive/15 hover:border-terracotta hover:text-terracotta'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search + Sort — second row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Buscar presente..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full bg-white border border-olive/20 pl-10 pr-4 py-2 rounded-sm text-sm text-charcoal focus:outline-none focus:border-terracotta transition-colors font-sans"
              />
              <Search className="absolute left-3.5 top-2.5 text-charcoal/40" size={16} />
            </div>

            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value as any);
                setCurrentPage(1);
              }}
              className="bg-white border border-olive/20 rounded-sm text-xs py-2 px-3 focus:outline-none focus:border-terracotta text-charcoal"
            >
              <option value="default">ORDENAR POR (PADRÃO)</option>
              <option value="price_asc">MENOR PREÇO</option>
              <option value="price_desc">MAIOR PREÇO</option>
            </select>
          </div>


          {/* Price Range inputs row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-3 border-t border-olive/10">
            <span className="text-[10px] uppercase font-label tracking-wider text-charcoal/50 font-bold">Faixa de preço:</span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-28">
                <span className="absolute left-2.5 top-2 text-[10px] text-charcoal/40 font-mono">R$</span>
                <input
                  type="number"
                  placeholder="Mínimo"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-white border border-olive/20 pl-8 pr-2 py-1.5 rounded-sm text-xs text-charcoal focus:outline-none focus:border-terracotta font-mono"
                />
              </div>
              <span className="text-charcoal/40 text-xs">até</span>
              <div className="relative w-28">
                <span className="absolute left-2.5 top-2 text-[10px] text-charcoal/40 font-mono">R$</span>
                <input
                  type="number"
                  placeholder="Máximo"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-white border border-olive/20 pl-8 pr-2 py-1.5 rounded-sm text-xs text-charcoal focus:outline-none focus:border-terracotta font-mono"
                />
              </div>
              {(minPrice || maxPrice) && (
                <button
                  type="button"
                  onClick={() => {
                    setMinPrice('');
                    setMaxPrice('');
                    setCurrentPage(1);
                  }}
                  className="text-[10px] text-terracotta hover:underline ml-2 uppercase font-label tracking-widest"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 3. GIFTS GRID */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-4 border-terracotta border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-label text-charcoal/60 uppercase tracking-widest">Carregando lista de presentes...</p>
          </div>
        ) : paginatedGifts.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-olive/20 rounded-sm bg-[#FDFBFAF2]">
            <GiftIcon className="mx-auto text-olive/40 mb-3" size={40} />
            <h3 className="font-serif text-2xl text-charcoal/80 mb-1">Nenhum presente encontrado</h3>
            <p className="text-sm text-charcoal/50 max-w-md mx-auto font-light">Tente digitar outro nome ou mudar de categoria nos filtros acima.</p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedGifts.map((gift) => {
                const isBought = gift.status === 'comprado';
                return (
                  <div 
                    key={gift.id}
                    className="bg-white rounded-sm border border-olive/10 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition-shadow relative"
                  >
                    {isBought && (
                      <div className="absolute top-4 left-4 z-10 bg-olive text-white text-[10px] font-label uppercase tracking-widest font-bold px-3 py-1 rounded-sm shadow-sm flex items-center gap-1">
                        <Check size={10} /> Já Presenteado
                      </div>
                    )}
                    
                    {/* Image */}
                    <div className="relative aspect-4/3 overflow-hidden bg-[#F5EFEB]">
                      <img
                        src={gift.imageUrl}
                        alt={gift.name}
                        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isBought ? 'filter grayscale contrast-75 brightness-95' : ''}`}
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col justify-between flex-1">
                      <div className="space-y-1 mb-4">
                        <span className="text-[10px] font-label uppercase tracking-widest text-olive font-semibold">{gift.category}</span>
                        <h4 className="font-serif text-lg text-charcoal group-hover:text-terracotta transition-colors line-clamp-1">{gift.name}</h4>
                        <div className="text-sm font-sans font-semibold text-terracotta pt-1">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(gift.price)}
                        </div>
                      </div>

                      {/* Action */}
                      {isBought ? (
                        <button
                          disabled
                          className="w-full bg-[#eeeeee] text-charcoal/40 font-label tracking-widest text-[11px] uppercase font-bold py-3 px-4 rounded-sm border border-charcoal/10 cursor-not-allowed"
                        >
                          INDISPONÍVEL
                        </button>
                      ) : (
                        <button
                          onClick={() => openPurchaseModal(gift)}
                          className="w-full bg-white hover:bg-terracotta text-terracotta hover:text-white border border-terracotta/40 hover:border-terracotta transition-all duration-300 font-label tracking-widest text-[11px] uppercase font-bold py-3 px-4 rounded-sm"
                        >
                          PRESENTEAR
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-6 mt-16">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`p-2.5 rounded-sm border border-olive/20 transition-all ${
                    currentPage === 1 ? 'opacity-40 cursor-not-allowed' : 'bg-white hover:border-terracotta text-charcoal'
                  }`}
                >
                  &larr; Anterior
                </button>
                <span className="text-xs uppercase font-label tracking-widest text-charcoal/70 font-semibold">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`p-2.5 rounded-sm border border-olive/20 transition-all ${
                    currentPage === totalPages ? 'opacity-40 cursor-not-allowed' : 'bg-white hover:border-terracotta text-charcoal'
                  }`}
                >
                  Próxima &rarr;
                </button>
              </div>
            )}
          </div>
        )}

        {/* 4. REAL-TIME SIMULATED NOTIFICATION DIALOGS AT THE BOTTOM */}
        {sessionEmails.length > 0 && (
          <div className="mt-20 p-6 sm:p-8 rounded-sm bg-[#FDFBFAF2] border border-olive/15 shadow-inner">
            <div className="flex items-center gap-2 mb-4 text-olive">
              <Send size={18} />
              <h3 className="font-serif text-lg font-bold">Simulador de Envio de E-mails (Notificações ao Vivo)</h3>
            </div>
            <p className="text-xs font-sans text-charcoal/60 mb-6 font-light">
              Como requisitado, abaixo estão os registros reais dos e-mails virtuais disparados imediatamente após a compra do presente. O convidado recebe um comprovante e agradecimento, e os noivos recebem a consolidação do valor recebido.
            </p>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 scrollbar-none">
              {sessionEmails.map((email) => (
                <div key={email.id} className="bg-white p-4 rounded-sm border border-olive/10 shadow-sm text-xs text-charcoal font-sans space-y-2">
                  <div className="flex flex-col sm:flex-row sm:justify-between border-b border-olive/5 pb-2 gap-1 text-charcoal/70">
                    <div>
                      <span className="font-semibold text-olive">DE:</span> {email.sender}
                    </div>
                    <div>
                      <span className="font-semibold text-terracotta">PARA:</span> {email.recipient}
                    </div>
                  </div>
                  <div>
                    <span className="font-bold text-charcoal">ASSUNTO:</span> {email.subject}
                  </div>
                  <pre className="whitespace-pre-wrap font-sans text-charcoal/80 bg-[#fbfbfa] p-3 border border-olive/5 rounded-sm mt-1 leading-relaxed text-[11px]">
                    {email.body}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* TRANSACTION MODAL */}
      {activeModal !== 'closed' && (
        <div className="fixed inset-0 z-50 bg-charcoal/70 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white rounded-sm shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-olive/20 text-charcoal">
            
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-olive/10">
              <h3 className="font-serif text-xl font-medium text-terracotta">
                {isHoneymoonFund ? 'Contribuir com Lua de Mel' : 'Presentear Noivos'}
              </h3>
              <button 
                onClick={() => setActiveModal('closed')}
                className="text-charcoal/50 hover:text-charcoal font-semibold text-lg"
              >
                &times;
              </button>
            </div>

            {/* CONTENT VIEWS */}
            
            {/* View 1: Form and Payment Simulator */}
            {activeModal === 'payment_form' && (
              <form onSubmit={handleConfirmPurchase} className="p-6 space-y-6">
                
                {/* Gift Summary */}
                <div className="bg-[#F5EFEB] p-4 rounded-sm border border-olive/10 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-sm overflow-hidden bg-white border border-olive/10 shrink-0">
                    <img 
                      src={isHoneymoonFund ? 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=150&q=80' : selectedGift?.imageUrl} 
                      alt="" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] uppercase font-label tracking-widest text-olive font-semibold">PRESENTE SELECIONADO</p>
                    <h4 className="font-serif text-base text-charcoal">{isHoneymoonFund ? 'Fundo de Apoio à Lua de Mel' : selectedGift?.name}</h4>
                    <div className="text-sm font-sans font-bold text-terracotta mt-0.5">
                      {isHoneymoonFund ? (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-charcoal/60 font-light font-sans">Escolha o valor: R$</span>
                          <input
                            type="number"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            min="1"
                            className="bg-white border border-olive/30 px-2 py-0.5 rounded-sm w-24 text-sm focus:outline-none focus:border-terracotta font-sans text-charcoal font-bold"
                          />
                        </div>
                      ) : (
                        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedGift?.price || 0)
                      )}
                    </div>
                  </div>
                </div>

                {/* User details inputs */}
                <div className="space-y-4">
                  <h4 className="text-xs uppercase font-label tracking-widest text-olive font-bold border-b border-olive/10 pb-1">Seus Dados</h4>
                  
                  <div>
                    <label className="block text-[11px] font-label uppercase tracking-widest text-charcoal/65 mb-1.5 font-bold">Seu Nome Completo</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Maria Souza"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full bg-white border-b border-olive/30 focus:border-terracotta py-2 px-1 text-sm text-charcoal focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-label uppercase tracking-widest text-charcoal/65 mb-1.5 font-bold">Seu E-mail (Para confirmação)</label>
                    <input
                      type="email"
                      required
                      placeholder="Ex: mariasouza@gmail.com"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      className="w-full bg-white border-b border-olive/30 focus:border-terracotta py-2 px-1 text-sm text-charcoal focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="space-y-4">
                  <h4 className="text-xs uppercase font-label tracking-widest text-olive font-bold border-b border-olive/10 pb-1">Método de Pagamento Simulado</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('pix')}
                      className={`p-4 rounded-sm border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                        paymentMethod === 'pix' 
                          ? 'border-terracotta bg-terracotta/5 text-terracotta font-bold' 
                          : 'border-olive/15 bg-white text-charcoal/70 hover:border-terracotta'
                      }`}
                    >
                      <span className="font-serif italic text-base">PIX</span>
                      <span className="text-[9px] font-label uppercase tracking-widest text-charcoal/50">Aprovação Imediata</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 rounded-sm border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                        paymentMethod === 'card' 
                          ? 'border-terracotta bg-terracotta/5 text-terracotta font-bold' 
                          : 'border-olive/15 bg-white text-charcoal/70 hover:border-terracotta'
                      }`}
                    >
                      <CreditCard size={18} />
                      <span className="text-[9px] font-label uppercase tracking-widest text-charcoal/50">Cartão de Crédito</span>
                    </button>
                  </div>
                </div>

                {/* Sub-fields for credit card */}
                {paymentMethod === 'card' && (
                  <div className="space-y-3 bg-[#FDFBFAF2] p-4 rounded-sm border border-olive/10 animate-fade-in text-xs">
                    <p className="text-[10px] uppercase font-label tracking-widest text-terracotta font-bold mb-2">Simulação de Cartão de Crédito</p>
                    
                    <div>
                      <label className="block text-[10px] text-charcoal/70 uppercase font-label mb-1">Nome no Cartão</label>
                      <input
                        type="text"
                        required={paymentMethod === 'card'}
                        placeholder="Ex: MARIA SOUZA"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                        className="w-full bg-white border border-olive/20 rounded-sm p-2 text-xs text-charcoal focus:outline-none focus:border-terracotta"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-charcoal/70 uppercase font-label mb-1">Número do Cartão</label>
                      <input
                        type="text"
                        required={paymentMethod === 'card'}
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                        className="w-full bg-white border border-olive/20 rounded-sm p-2 text-xs text-charcoal focus:outline-none focus:border-terracotta font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-charcoal/70 uppercase font-label mb-1">Validade</label>
                        <input
                          type="text"
                          required={paymentMethod === 'card'}
                          placeholder="MM/AA"
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-white border border-olive/20 rounded-sm p-2 text-xs text-charcoal focus:outline-none focus:border-terracotta"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-charcoal/70 uppercase font-label mb-1">CVV</label>
                        <input
                          type="password"
                          required={paymentMethod === 'card'}
                          placeholder="123"
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                          className="w-full bg-white border border-olive/20 rounded-sm p-2 text-xs text-charcoal focus:outline-none focus:border-terracotta font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit trigger button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-terracotta hover:bg-terracotta-hover text-white font-label tracking-widest text-xs uppercase font-bold py-3.5 px-6 rounded-sm shadow-md transition-all"
                  >
                    AVANÇAR PARA PAGAMENTO &rarr;
                  </button>
                </div>
              </form>
            )}

            {/* View 2: Processing Payment State */}
            {activeModal === 'processing' && (
              <div className="p-8 text-center space-y-6">
                {paymentMethod === 'pix' ? (
                  <div className="space-y-6">
                    <h3 className="font-serif text-lg font-medium text-charcoal">Efetue o pagamento via PIX Simulado</h3>
                    
                    {/* Simulated elegant QR code visual box */}
                    <div className="mx-auto w-48 h-48 bg-white border-2 border-olive/15 p-2 rounded-sm relative flex items-center justify-center">
                      <img 
                        src="https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?auto=format&fit=crop&w=250&q=80" 
                        alt="QR Code Simulado" 
                        className="w-full h-full object-cover opacity-10 filter grayscale select-none"
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-white/90">
                        {/* Custom visual SVG mimicking a luxury QR code */}
                        <div className="w-28 h-28 border-4 border-charcoal p-1.5 bg-white grid grid-cols-3 gap-1">
                          <div className="bg-charcoal w-6 h-6 border" />
                          <div className="bg-transparent" />
                          <div className="bg-charcoal w-6 h-6 border" />
                          <div className="bg-transparent" />
                          <div className="bg-charcoal w-6 h-6 border" />
                          <div className="bg-transparent" />
                          <div className="bg-charcoal w-6 h-6 border" />
                          <div className="bg-transparent" />
                          <div className="bg-charcoal w-6 h-6 border" />
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-charcoal/70 max-w-sm mx-auto font-sans leading-relaxed">
                      Escaneie o QR Code acima usando o app do seu banco ou utilize a chave copia e cola abaixo.
                    </p>

                    {/* Copy paste input action */}
                    <div className="flex items-center gap-2 max-w-sm mx-auto">
                      <input
                        type="text"
                        readOnly
                        value={pixKey}
                        className="bg-[#F5EFEB] border border-olive/10 px-3 py-2 text-xs rounded-sm w-full font-mono text-charcoal select-all"
                      />
                      <button
                        type="button"
                        onClick={handleCopyPix}
                        className="p-2.5 bg-olive hover:bg-olive/90 text-white rounded-sm shrink-0 transition-all"
                        title="Copiar Chave"
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                    {copied && <p className="text-[10px] text-olive font-bold uppercase tracking-wider animate-bounce">Chave Copiada para o clipboard!</p>}

                    <div className="border-t border-olive/10 pt-6 mt-6">
                      <p className="text-[11px] font-label text-charcoal/50 uppercase tracking-widest mb-3">Ambiente de Testes Simulado</p>
                      <button
                        type="button"
                        onClick={async () => {
                          // Bypass the loader
                          // Simulated POST with complete request
                          const giftId = isHoneymoonFund ? 'gift-custom-honeymoon' : selectedGift?.id;
                          const finalAmount = isHoneymoonFund ? parseFloat(customAmount) : selectedGift?.price || 0;
                          const finalGiftName = isHoneymoonFund ? `Cota de Lua de Mel` : selectedGift?.name || '';
                          let targetGiftId = giftId || '';
                          if (isHoneymoonFund) {
                            const honeymoonGift = gifts.find(g => g.name.toLowerCase().includes('cota') || g.id.includes('custom-honeymoon'));
                            targetGiftId = honeymoonGift ? honeymoonGift.id : 'gift-36';
                          }
                          try {
                            const res = await fetch(`/api/gifts/${targetGiftId}/buy`, {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json'
                              },
                              body: JSON.stringify({
                                buyerName,
                                buyerEmail,
                                paymentMethod: 'pix',
                                amount: finalAmount
                              })
                            });
                            if (res.ok) {
                              const formattedPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(finalAmount);
                              const guestEmailSim = {
                                id: `sim-g-${Date.now()}`,
                                recipient: buyerEmail,
                                subject: `[Casamento de Letielly & Wenderson] Obrigado pelo seu presente! 🎁`,
                                sender: `Letielly & Wenderson <casamento@noivos.com>`,
                                body: `Olá ${buyerName},\n\nAgradecemos imensamente pelo seu gesto de carinho ao nos presentear com:\n🎁 ${finalGiftName} (${formattedPrice})\n\nSua contribuição via PIX foi confirmada com sucesso!\n\nCom carinho,\nLetielly & Wenderson`
                              };
                              const coupleEmailSim = {
                                id: `sim-c-${Date.now()}`,
                                recipient: `${pixHolder.toLowerCase().replace(/\s+/g, '')}@noivos.com`,
                                subject: `[Novo Presente Recebido!] ${buyerName} enviou: ${finalGiftName}`,
                                sender: `Gestão de Celebração <sistema@casamento.com>`,
                                body: `Olá Letielly & Wenderson,\n\nVocês receberam um novo presente na lista virtual!\nConvidado(a): ${buyerName}\nPresente: ${finalGiftName}\nValor: ${formattedPrice}\n\nO valor foi arrecadado em dinheiro para vocês!`
                              };
                              setSessionEmails(prev => [coupleEmailSim, guestEmailSim, ...prev]);
                              setActiveModal('success');
                              fetchGifts();
                              onPurchaseSuccess();
                            }
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                        className="w-full bg-olive hover:bg-olive/90 text-white font-label tracking-widest text-xs uppercase font-bold py-3 px-4 rounded-sm"
                      >
                        CONFIRMAR PAGAMENTO SIMULADO (PIX)
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-terracotta border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm font-label uppercase tracking-widest text-charcoal/60">Processando transação com cartão de crédito...</p>
                    <p className="text-xs font-sans text-charcoal/50">Esta é uma simulação segura. Não faremos débitos reais.</p>
                  </div>
                )}
              </div>
            )}

            {/* View 3: Success Screen */}
            {activeModal === 'success' && (
              <div className="p-8 text-center space-y-6 animate-fade-in">
                <div className="w-16 h-16 bg-olive-light/40 border border-olive/30 rounded-full flex items-center justify-center text-olive mx-auto">
                  <Check size={32} />
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif text-3xl font-medium text-olive">Muito Obrigado!</h3>
                  <p className="text-sm font-sans text-charcoal/80 max-w-md mx-auto">
                    Olá <span className="font-bold text-charcoal">{buyerName}</span>, seu presente virtual foi recebido com muito carinho!
                  </p>
                </div>

                <div className="bg-[#F5EFEB] p-5 rounded-sm border border-olive/10 max-w-sm mx-auto text-left space-y-1.5 text-xs text-charcoal font-sans">
                  <p className="font-serif italic text-sm text-terracotta font-semibold text-center pb-1 mb-1 border-b border-olive/10">Confirmado com Sucesso</p>
                  <p>🎁 <span className="font-semibold">Item:</span> {isHoneymoonFund ? 'Contribuição para a Lua de Mel' : selectedGift?.name}</p>
                  <p>💰 <span className="font-semibold">Valor:</span> {isHoneymoonFund ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(customAmount)) : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedGift?.price || 0)}</p>
                  <p>📧 <span className="font-semibold">E-mail de confirmação enviado para:</span> {buyerEmail}</p>
                </div>

                <p className="text-xs font-sans text-charcoal/65 leading-relaxed max-w-sm mx-auto">
                  A confirmação de compra e as notificações correspondentes já foram disparadas e registradas no mural de e-mails abaixo!
                </p>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveModal('closed')}
                    className="w-full bg-charcoal hover:bg-charcoal/90 text-white font-label tracking-widest text-xs uppercase font-bold py-3.5 px-6 rounded-sm transition-all"
                  >
                    FECHAR JANELA
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
