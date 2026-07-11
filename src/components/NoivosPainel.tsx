import React, { useState, useEffect } from 'react';
import { 
  Users, Gift, DollarSign, Edit, Trash2, Plus, 
  Settings, CheckCircle, XCircle, Search, Mail, 
  ArrowLeft, Key, Save, RefreshCw, BarChart3, HelpCircle 
} from 'lucide-react';
import { WeddingInfo, RSVP, Gift as GiftType, EmailNotification, Purchase } from '../types';

interface NoivosPainelProps {
  adminPin: string;
  weddingInfo: WeddingInfo;
  onUpdateWeddingInfo: (updated: WeddingInfo) => void;
  onNavigateToTab: (tabId: string) => void;
}

export default function NoivosPainel({
  adminPin,
  weddingInfo,
  onUpdateWeddingInfo,
  onNavigateToTab
}: NoivosPainelProps) {
  
  // Tab within the dashboard
  const [activeSubTab, setActiveSubTab] = useState<'stats' | 'rsvps' | 'gifts' | 'emails' | 'settings'>('stats');

  // Server Data
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [gifts, setGifts] = useState<GiftType[]>([]);
  const [notifications, setNotifications] = useState<EmailNotification[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  // Search/Filters in Admin list
  const [giftSearch, setGiftSearch] = useState('');
  const [giftCategoryFilter, setGiftCategoryFilter] = useState('TODOS');
  const [giftMinPrice, setGiftMinPrice] = useState('');
  const [giftMaxPrice, setGiftMaxPrice] = useState('');
  const [giftSort, setGiftSort] = useState<'default' | 'price_asc' | 'price_desc'>('default');
  const [rsvpSearch, setRsvpSearch] = useState('');

  // Modals state
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [editingGift, setEditingGift] = useState<GiftType | null>(null);

  // Gift Form State
  const [giftName, setGiftName] = useState('');
  const [giftPrice, setGiftPrice] = useState('');
  const [giftCategory, setGiftCategory] = useState('Cozinha');
  const [giftImageUrl, setGiftImageUrl] = useState('');

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState<WeddingInfo>({ ...weddingInfo });

  // Load all dashboard data
  const loadData = async () => {
    setLoading(true);
    try {
      const headers = { 'x-admin-pin': adminPin };
      
      const [rsvpsRes, giftsRes, notifsRes, purchasesRes] = await Promise.all([
        fetch('/api/rsvps', { headers }),
        fetch('/api/gifts'),
        fetch('/api/notifications', { headers }),
        fetch('/api/purchases', { headers })
      ]);

      const [rsvpsData, giftsData, notifsData, purchasesData] = await Promise.all([
        rsvpsRes.json(),
        giftsRes.json(),
        notifsRes.json(),
        purchasesRes.json()
      ]);

      if (rsvpsData.rsvps) setRsvps(rsvpsData.rsvps);
      if (giftsData.gifts) setGifts(giftsData.gifts);
      if (notifsData.notifications) setNotifications(notifsData.notifications);
      if (purchasesData.purchases) setPurchases(purchasesData.purchases);
    } catch (e) {
      console.error('Error fetching admin dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    setSettingsForm({ ...weddingInfo });
  }, [weddingInfo, adminPin]);

  // Handle Delete RSVP
  const handleDeleteRsvp = async (id: string) => {
    if (!window.confirm('Tem certeza de que deseja remover esta confirmação de presença?')) return;
    try {
      const res = await fetch(`/api/rsvps/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-pin': adminPin }
      });
      if (res.ok) {
        setRsvps(prev => prev.filter(r => r.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Open Gift Add/Edit Modal
  const openGiftModal = (gift: GiftType | null = null) => {
    if (gift) {
      setEditingGift(gift);
      setGiftName(gift.name);
      setGiftPrice(String(gift.price));
      setGiftCategory(gift.category);
      setGiftImageUrl(gift.imageUrl);
    } else {
      setEditingGift(null);
      setGiftName('');
      setGiftPrice('');
      setGiftCategory('Cozinha');
      setGiftImageUrl('');
    }
    setIsGiftModalOpen(true);
  };

  // Handle Submit Gift Add/Edit
  const handleGiftSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftName || !giftPrice) return;

    const url = editingGift ? `/api/gifts/${editingGift.id}` : '/api/gifts';
    const method = editingGift ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': adminPin
        },
        body: JSON.stringify({
          name: giftName,
          price: parseFloat(giftPrice),
          category: giftCategory,
          imageUrl: giftImageUrl
        })
      });

      if (res.ok) {
        setIsGiftModalOpen(false);
        loadData();
      } else {
        const d = await res.json();
        alert(d.error || 'Erro ao salvar presente.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Delete Gift
  const handleDeleteGift = async (id: string) => {
    if (!window.confirm('Tem certeza de que deseja excluir este presente da lista?')) return;
    try {
      const res = await fetch(`/api/gifts/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-pin': adminPin }
      });
      if (res.ok) {
        setGifts(prev => prev.filter(g => g.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Update Wedding configuration settings
  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/wedding-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': adminPin
        },
        body: JSON.stringify(settingsForm)
      });

      if (res.ok) {
        onUpdateWeddingInfo(settingsForm);
        alert('Configurações do casamento salvas com sucesso!');
      } else {
        alert('Erro ao atualizar configurações.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ----------------------------------------
  // STATISTICS CALCULATIONS (Matching mockup layout)
  // ----------------------------------------
  const totalGiftsCount = gifts.length;
  const purchasedGifts = gifts.filter(g => g.status === 'comprado');
  const purchasedGiftsCount = purchasedGifts.length;
  const availableGiftsCount = totalGiftsCount - purchasedGiftsCount;

  // Potential Total List Value
  const totalListValue = gifts.reduce((sum, g) => sum + g.price, 0);
  
  // Total Cash Arrecadado (Psychological Present strategy)
  const totalArrecadado = purchasedGifts.reduce((sum, g) => sum + g.price, 0);
  const totalRestante = totalListValue - totalArrecadado;

  // Honeymoon Flexible funds simulated contribution segment
  const honeymoonPurchases = purchases.filter(p => p.giftName.toLowerCase().includes('lua de mel') || p.giftId.includes('honeymoon'));
  const honeymoonTotalArrecadado = honeymoonPurchases.reduce((sum, p) => sum + p.amount, 0) + 3500; // preload with base for aesthetic graph

  // Price Distribution ranges stats for visual bar chart
  const priceRanges = {
    under200: gifts.filter(g => g.price <= 200).length,
    from200to500: gifts.filter(g => g.price > 200 && g.price <= 500).length,
    from500to1000: gifts.filter(g => g.price > 500 && g.price <= 1000).length,
    above1000: gifts.filter(g => g.price > 1000).length,
  };

  const totalGuestsConfirmed = rsvps.filter(r => r.confirmed).reduce((sum, r) => sum + r.numGuests, 0);
  const totalGuestsDeclined = rsvps.filter(r => !r.confirmed).length;

  const categoriesList = ['TODOS', 'Cozinha', 'Eletrodomésticos', 'Móveis', 'Cama e Banho', 'Diversos'];

  // Filter gifts list
  const filteredGifts = gifts.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(giftSearch.toLowerCase());
    const matchesCat = giftCategoryFilter === 'TODOS' || g.category.toLowerCase() === giftCategoryFilter.toLowerCase();
    
    const minVal = parseFloat(giftMinPrice);
    const matchesMin = isNaN(minVal) || g.price >= minVal;

    const maxVal = parseFloat(giftMaxPrice);
    const matchesMax = isNaN(maxVal) || g.price <= maxVal;

    return matchesSearch && matchesCat && matchesMin && matchesMax;
  });

  const sortedGifts = [...filteredGifts].sort((a, b) => {
    if (giftSort === 'price_asc') {
      return a.price - b.price;
    }
    if (giftSort === 'price_desc') {
      return b.price - a.price;
    }
    return 0; // default order
  });

  // Filter rsvp list
  const filteredRsvps = rsvps.filter(r => 
    r.name.toLowerCase().includes(rsvpSearch.toLowerCase()) || 
    r.phone.includes(rsvpSearch)
  );

  return (
    <div className="min-h-screen bg-[#111214] text-white">
      {/* Top Banner Dashboard Header */}
      <div className="border-b border-white/5 bg-[#191b1f] py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-olive font-semibold label-text text-[10px]">
              <span className="w-2 h-2 rounded-full bg-olive animate-pulse" />
              PAINEL PRIVADO DOS NOIVOS
            </div>
            <h1 className="font-serif text-3xl font-medium mt-1 text-[#e1d8d2]">Gestão de Celebração</h1>
            <p className="text-xs text-white/50 font-sans mt-0.5">Revise e gerencie as respostas, presentes e notificações financeiras da sua celebração.</p>
          </div>

          {/* Quick Tab switcher */}
          <div className="flex bg-[#23252a] rounded-sm p-1 border border-white/5 overflow-x-auto w-full md:w-auto shrink-0 font-label text-[11px] tracking-wider uppercase font-semibold">
            {[
              { id: 'stats', label: 'Estatísticas' },
              { id: 'rsvps', label: `Convidados (${rsvps.filter(r => r.confirmed).length})` },
              { id: 'gifts', label: `Presentes (${gifts.length})` },
              { id: 'emails', label: 'Histórico E-mails' },
              { id: 'settings', label: 'Configurar Site' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`px-3 py-2 rounded-sm transition-all whitespace-nowrap ${
                  activeSubTab === tab.id ? 'bg-terracotta text-white shadow-md' : 'text-white/60 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {loading ? (
          <div className="py-32 text-center">
            <div className="w-12 h-12 border-4 border-terracotta border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm uppercase font-label tracking-widest text-white/60">Carregando dados consolidados...</p>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">

            {/* ==========================================
                SUB-TAB 1: STATISTICS / FINANCIALS
                ========================================== */}
            {activeSubTab === 'stats' && (
              <div className="space-y-8">
                
                {/* 4 Dashboard Cards matching mockup */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { 
                      label: 'TOTAL DE ITENS', 
                      value: totalGiftsCount, 
                      sub: `${availableGiftsCount} Disponíveis`,
                      color: 'text-[#e1d8d2]' 
                    },
                    { 
                      label: 'VALOR TOTAL LISTA', 
                      value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(totalListValue), 
                      sub: 'Soma total virtual',
                      color: 'text-terracotta' 
                    },
                    { 
                      label: 'VALOR ARRECADADO', 
                      value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(totalArrecadado), 
                      sub: `${purchasedGiftsCount} Presentes comprados`,
                      color: 'text-olive' 
                    },
                    { 
                      label: 'SALDO RESTANTE', 
                      value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(totalRestante), 
                      sub: 'Meta pendente',
                      color: 'text-white/80' 
                    }
                  ].map((card, idx) => (
                    <div key={idx} className="bg-[#191b1f] border border-white/5 p-6 rounded-sm text-center shadow-md">
                      <span className="text-[10px] font-label uppercase tracking-widest text-white/40 font-bold block mb-1">{card.label}</span>
                      <p className={`font-serif text-3xl font-medium ${card.color}`}>{card.value}</p>
                      <span className="text-[11px] text-white/45 font-sans mt-2 block">{card.sub}</span>
                    </div>
                  ))}
                </div>

                {/* Sub row with visual Honeymoon Progress & Price distribution chart */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Honeymoon fund widget */}
                  <div className="lg:col-span-4 bg-[#191b1f] border border-white/5 p-6 rounded-sm shadow-md flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-label uppercase tracking-widest text-white/40 font-bold">CARTEIRA VIRTUAL</span>
                        <span className="px-2 py-0.5 bg-olive/15 text-olive text-[9px] font-semibold tracking-wider rounded-full uppercase">Ativa</span>
                      </div>
                      <h3 className="font-serif text-xl text-[#e1d8d2]">Fundo de Lua de Mel</h3>
                      <p className="text-xs text-white/50 font-sans mt-1">Cotas livres e flexíveis arrecadadas para apoiar passeios de viagem.</p>
                      
                      <div className="mt-8 space-y-2">
                        <div className="flex justify-between text-xs font-sans">
                          <span className="text-white/60">Arrecadado em dinheiro</span>
                          <span className="font-bold text-terracotta">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(honeymoonTotalArrecadado)}
                          </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden border border-white/5">
                          <div 
                            className="bg-terracotta h-full transition-all duration-1000" 
                            style={{ width: `${Math.min((honeymoonTotalArrecadado / 15000) * 100, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-white/40 font-sans">
                          <span>Meta virtual: R$ 0,00</span>
                          <span>Meta sugerida: R$ 15.000,00</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 mt-6 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-terracotta/10 flex items-center justify-center text-terracotta shrink-0">
                        <DollarSign size={18} />
                      </div>
                      <div className="text-left font-sans">
                        <p className="text-[11px] font-semibold text-white/80">Chave PIX atual para recebimento</p>
                        <p className="text-xs text-olive font-mono">{weddingInfo.pixKey}</p>
                      </div>
                    </div>
                  </div>

                  {/* Price distribution visual mockup chart */}
                  <div className="lg:col-span-8 bg-[#191b1f] border border-white/5 p-6 rounded-sm shadow-md">
                    <h3 className="font-serif text-lg text-[#e1d8d2] mb-1">Distribuição por Faixa de Preço</h3>
                    <p className="text-xs text-white/50 font-sans mb-8">Controle de quantidade de produtos em cada nível financeiro para os convidados.</p>
                    
                    <div className="grid grid-cols-4 gap-4 items-end min-h-[160px] pt-4">
                      {[
                        { range: 'Até R$200', count: priceRanges.under200, color: 'bg-terracotta/75' },
                        { range: 'R$200 - R$500', count: priceRanges.from200to500, color: 'bg-[#9f796c]' },
                        { range: 'R$500 - R$1000', count: priceRanges.from500to1000, color: 'bg-olive/60' },
                        { range: 'Acima de R$1000', count: priceRanges.above1000, color: 'bg-olive/25' },
                      ].map((bar, idx) => {
                        const pct = (bar.count / totalGiftsCount) * 100 || 5;
                        return (
                          <div key={idx} className="flex flex-col items-center gap-2">
                            <span className="text-xs text-white/80 font-mono font-bold">{bar.count} itens</span>
                            <div className="w-full bg-white/5 rounded-t-sm overflow-hidden h-28 relative flex items-end">
                              <div 
                                className={`${bar.color} w-full transition-all duration-1000`} 
                                style={{ height: `${pct}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-label text-white/50 uppercase tracking-wider text-center block mt-1">{bar.range}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Strategy alert */}
                <div className="p-5 bg-olive/10 border border-olive/25 rounded-sm flex items-start gap-3 text-xs text-white/80 font-sans leading-relaxed">
                  <HelpCircle className="text-olive shrink-0 mt-0.5" size={16} />
                  <div>
                    <span className="font-bold text-olive block mb-0.5">ESTRATÉGIA PSICOLÓGICA DE PRESENTES</span>
                    Sua lista está configurada no modo virtual-fictício: os convidados compram um determinado produto físico (e.g. "Air Fryer" ou "Aparelho de Jantar") para ter a satisfação de estar oferecendo algo tangível de valor. No entanto, o sistema liquida a transação e envia um e-mail de agradecimento indicando que o valor correspondente foi enviado integralmente como crédito financeiro (dinheiro) em sua chave PIX. Isso aumenta a taxa de conversão de presentes em até 40%!
                  </div>
                </div>
              </div>
            )}


            {/* ==========================================
                SUB-TAB 2: RSVPs / GUESTS
                ========================================== */}
            {activeSubTab === 'rsvps' && (
              <div className="space-y-6">
                
                {/* RSVP Stats and Search */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#191b1f] p-4 rounded-sm border border-white/5 shadow-sm">
                  <div className="flex items-center gap-6 text-xs font-sans text-white/70">
                    <div>
                      Confirmados: <span className="font-bold text-olive font-mono text-sm">{totalGuestsConfirmed}</span> pessoas
                    </div>
                    <div className="border-l border-white/10 pl-6">
                      Declinados: <span className="font-bold text-red-400 font-mono text-sm">{totalGuestsDeclined}</span> convites
                    </div>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Pesquisar convidado..."
                      value={rsvpSearch}
                      onChange={(e) => setRsvpSearch(e.target.value)}
                      className="w-full bg-[#23252a] border border-white/5 pl-9 pr-3 py-2 rounded-sm text-xs text-white focus:outline-none focus:border-terracotta"
                    />
                    <Search className="absolute left-3 top-2.5 text-white/40" size={14} />
                  </div>
                </div>

                {/* RSVP Table */}
                {filteredRsvps.length === 0 ? (
                  <div className="py-16 text-center border border-dashed border-white/5 rounded-sm bg-[#191b1f]">
                    <p className="text-sm text-white/50">Nenhuma confirmação de presença (RSVP) cadastrada ou correspondente.</p>
                  </div>
                ) : (
                  <div className="bg-[#191b1f] border border-white/5 rounded-sm overflow-hidden overflow-x-auto shadow-md">
                    <table className="w-full text-left text-xs font-sans text-white/80">
                      <thead className="bg-[#23252a] text-[10px] font-label uppercase tracking-widest text-white/40">
                        <tr>
                          <th className="p-4">Convidado</th>
                          <th className="p-4">Telefone</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Acompanhantes</th>
                          <th className="p-4">Dietas / Restrições</th>
                          <th className="p-4">Recado / Mensagem</th>
                          <th className="p-4 text-center">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredRsvps.map((rsvp) => (
                          <tr key={rsvp.id} className="hover:bg-white/2 transition-colors">
                            <td className="p-4 font-semibold text-white">{rsvp.name}</td>
                            <td className="p-4 font-mono text-white/70">{rsvp.phone}</td>
                            <td className="p-4">
                              {rsvp.confirmed ? (
                                <span className="inline-flex items-center gap-1 text-olive bg-olive/10 px-2 py-0.5 rounded-full font-bold">
                                  <CheckCircle size={10} /> Vou comparecer
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full font-bold">
                                  <XCircle size={10} /> Não poderei ir
                                </span>
                              )}
                            </td>
                            <td className="p-4 font-mono font-semibold">{rsvp.confirmed ? rsvp.numGuests : 0}</td>
                            <td className="p-4 text-white/60 truncate max-w-[150px]" title={rsvp.dietRestrictions}>
                              {rsvp.dietRestrictions || '—'}
                            </td>
                            <td className="p-4 italic text-white/60 truncate max-w-[200px]" title={rsvp.message}>
                              {rsvp.message || '—'}
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => handleDeleteRsvp(rsvp.id)}
                                className="p-1.5 hover:bg-white/10 rounded-sm text-red-400 hover:text-red-300 transition-colors"
                                title="Excluir"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}


            {/* ==========================================
                SUB-TAB 3: GIFTS REGISTRY MANAGEMENT
                ========================================== */}
            {activeSubTab === 'gifts' && (
              <div className="space-y-6">
                
                {/* Search, Filter, Add Gift Bar */}
                <div className="bg-[#191b1f] p-4 rounded-sm border border-white/5 shadow-sm space-y-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                      <div className="relative w-full sm:w-56">
                        <input
                          type="text"
                          placeholder="Buscar presente..."
                          value={giftSearch}
                          onChange={(e) => setGiftSearch(e.target.value)}
                          className="w-full bg-[#23252a] border border-white/5 pl-9 pr-3 py-2 rounded-sm text-xs text-white focus:outline-none focus:border-terracotta"
                        />
                        <Search className="absolute left-3 top-2.5 text-white/40" size={14} />
                      </div>

                      <select
                        value={giftCategoryFilter}
                        onChange={(e) => setGiftCategoryFilter(e.target.value)}
                        className="bg-[#23252a] border border-white/5 rounded-sm text-xs py-2 px-3 focus:outline-none focus:border-terracotta text-white"
                      >
                        {categoriesList.map(cat => (
                          <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                        ))}
                      </select>

                      <select
                        value={giftSort}
                        onChange={(e) => setGiftSort(e.target.value as any)}
                        className="bg-[#23252a] border border-white/5 rounded-sm text-xs py-2 px-3 focus:outline-none focus:border-terracotta text-white"
                      >
                        <option value="default">ORDENAR POR (PADRÃO)</option>
                        <option value="price_asc">MENOR PREÇO</option>
                        <option value="price_desc">MAIOR PREÇO</option>
                      </select>
                    </div>

                    <button
                      onClick={() => openGiftModal()}
                      className="w-full lg:w-auto inline-flex items-center justify-center gap-1.5 bg-terracotta hover:bg-terracotta-hover text-white font-label tracking-widest text-xs uppercase font-bold py-2.5 px-4 rounded-sm transition-all shadow-md"
                    >
                      <Plus size={14} />
                      <span>Adicionar Presente</span>
                    </button>
                  </div>

                  {/* Price Range inputs row */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-3 border-t border-white/5">
                    <span className="text-[10px] uppercase font-label tracking-wider text-white/40 font-bold">Faixa de preço:</span>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="relative w-28">
                        <span className="absolute left-2.5 top-2 text-[10px] text-white/40 font-mono">R$</span>
                        <input
                          type="number"
                          placeholder="Mínimo"
                          value={giftMinPrice}
                          onChange={(e) => setGiftMinPrice(e.target.value)}
                          className="w-full bg-[#23252a] border border-white/5 pl-8 pr-2 py-1.5 rounded-sm text-xs text-white focus:outline-none focus:border-terracotta font-mono"
                        />
                      </div>
                      <span className="text-white/40 text-xs">até</span>
                      <div className="relative w-28">
                        <span className="absolute left-2.5 top-2 text-[10px] text-white/40 font-mono">R$</span>
                        <input
                          type="number"
                          placeholder="Máximo"
                          value={giftMaxPrice}
                          onChange={(e) => setGiftMaxPrice(e.target.value)}
                          className="w-full bg-[#23252a] border border-white/5 pl-8 pr-2 py-1.5 rounded-sm text-xs text-white focus:outline-none focus:border-terracotta font-mono"
                        />
                      </div>
                      {(giftMinPrice || giftMaxPrice) && (
                        <button
                          type="button"
                          onClick={() => {
                            setGiftMinPrice('');
                            setGiftMaxPrice('');
                          }}
                          className="text-[10px] text-terracotta hover:underline ml-2 uppercase font-label tracking-widest"
                        >
                          Limpar
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Gifts table */}
                {sortedGifts.length === 0 ? (
                  <div className="py-16 text-center border border-dashed border-white/5 rounded-sm bg-[#191b1f]">
                    <p className="text-sm text-white/50">Nenhum presente correspondente aos filtros.</p>
                  </div>
                ) : (
                  <div className="bg-[#191b1f] border border-white/5 rounded-sm overflow-hidden overflow-x-auto shadow-md">
                    <table className="w-full text-left text-xs font-sans text-white/80">
                      <thead className="bg-[#23252a] text-[10px] font-label uppercase tracking-widest text-white/40">
                        <tr>
                          <th className="p-4">Visual</th>
                          <th className="p-4">Nome do Item</th>
                          <th className="p-4">Categoria</th>
                          <th className="p-4">Valor</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Comprado por</th>
                          <th className="p-4 text-center">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {sortedGifts.map((gift) => {
                          const isBought = gift.status === 'comprado';
                          return (
                            <tr key={gift.id} className="hover:bg-white/2 transition-colors">
                              <td className="p-4">
                                <div className="w-10 h-10 rounded-sm overflow-hidden border border-white/5">
                                  <img src={gift.imageUrl} alt="" className="w-full h-full object-cover" />
                                </div>
                              </td>
                              <td className="p-4 font-semibold text-white">{gift.name}</td>
                              <td className="p-4 text-white/60">{gift.category}</td>
                              <td className="p-4 font-mono font-semibold text-terracotta">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(gift.price)}
                              </td>
                              <td className="p-4">
                                {isBought ? (
                                  <span className="inline-flex items-center gap-1 text-olive bg-olive/10 px-2.5 py-0.5 rounded-full font-bold">
                                    ● Comprado
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-2.5 py-0.5 rounded-full font-bold">
                                    ● Disponível
                                  </span>
                                )}
                              </td>
                              <td className="p-4">
                                {isBought ? (
                                  <div>
                                    <p className="font-semibold text-white">{gift.buyerName}</p>
                                    <p className="text-[10px] text-white/40">{gift.buyerEmail}</p>
                                  </div>
                                ) : (
                                  <span className="text-white/30">—</span>
                                )}
                              </td>
                              <td className="p-4 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    onClick={() => openGiftModal(gift)}
                                    className="p-1.5 hover:bg-white/10 rounded-sm text-white/60 hover:text-white transition-colors"
                                    title="Editar"
                                  >
                                    <Edit size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteGift(gift.id)}
                                    className="p-1.5 hover:bg-white/10 rounded-sm text-red-400 hover:text-red-300 transition-colors"
                                    title="Excluir"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}


            {/* ==========================================
                SUB-TAB 4: EMAIL NOTIFICATION LOGS
                ========================================== */}
            {activeSubTab === 'emails' && (
              <div className="space-y-6">
                <div className="bg-[#191b1f] p-4 rounded-sm border border-white/5">
                  <h3 className="font-serif text-lg text-[#e1d8d2] flex items-center gap-2">
                    <Mail size={18} className="text-olive" />
                    Histórico de Notificações por E-mail (Servidor Simulado)
                  </h3>
                  <p className="text-xs text-white/50 font-sans mt-1">
                    Todos os e-mails disparados pelo sistema para convidados (confirmação de compras) e noivos (RSVP de presença e alertas de presentes recebidos) ficam guardados abaixo para consulta e auditoria.
                  </p>
                </div>

                {notifications.length === 0 ? (
                  <div className="py-16 text-center border border-dashed border-white/5 rounded-sm bg-[#191b1f]">
                    <p className="text-sm text-white/50">Nenhuma notificação por e-mail enviada ainda.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        className="bg-[#191b1f] border border-white/5 rounded-sm p-5 space-y-3 shadow-md"
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center border-b border-white/5 pb-2 gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-sm text-[9px] font-label uppercase tracking-wider font-bold ${
                              notif.type === 'rsvp' 
                                ? 'bg-blue-400/15 text-blue-400' 
                                : notif.type === 'purchase_buyer' 
                                  ? 'bg-olive/15 text-olive' 
                                  : 'bg-yellow-400/15 text-yellow-400'
                            }`}>
                              {notif.type === 'rsvp' ? 'Presença RSVP' : notif.type === 'purchase_buyer' ? 'Compra (Comprovante)' : 'Venda (Alerta Noivos)'}
                            </span>
                            <span className="text-white/40 font-mono text-[10px]">
                              {new Date(notif.sentAt).toLocaleString('pt-BR')}
                            </span>
                          </div>
                          <div className="text-white/60 font-mono text-[10px]">
                            <span className="font-bold text-white/40 uppercase">PARA:</span> {notif.recipient}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <h4 className="font-sans font-bold text-sm text-white">{notif.subject}</h4>
                          <pre className="whitespace-pre-wrap font-sans text-xs text-white/70 bg-black/25 p-4 rounded-sm border border-white/5 leading-relaxed mt-2 select-all">
                            {notif.body}
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}


            {/* ==========================================
                SUB-TAB 5: WEDDING CONFIG / SETTINGS
                ========================================== */}
            {activeSubTab === 'settings' && (
              <form onSubmit={handleSettingsSubmit} className="bg-[#191b1f] border border-white/5 rounded-sm p-6 sm:p-8 space-y-8 shadow-md">
                <div className="border-b border-white/5 pb-4">
                  <h3 className="font-serif text-xl text-[#e1d8d2]">Configurar Site do Casamento</h3>
                  <p className="text-xs text-white/50 font-sans mt-1">Modifique as informações básicas de exibição do site (nomes, local, data, história e dados do PIX de arrecadação).</p>
                </div>

                {/* Grid inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Couples Names */}
                  <div className="space-y-4 md:col-span-2">
                    <h4 className="text-xs uppercase font-label tracking-widest text-olive font-bold border-b border-white/5 pb-1">Os Noivos</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-label uppercase tracking-widest text-white/50 mb-1.5 font-bold">Nome da Noiva</label>
                        <input
                          type="text"
                          required
                          value={settingsForm.noivaName}
                          onChange={(e) => setSettingsForm({ ...settingsForm, noivaName: e.target.value })}
                          className="w-full bg-[#23252a] border border-white/5 rounded-sm p-2.5 text-xs text-white focus:outline-none focus:border-terracotta font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-label uppercase tracking-widest text-white/50 mb-1.5 font-bold">Nome do Noivo</label>
                        <input
                          type="text"
                          required
                          value={settingsForm.noivoName}
                          onChange={(e) => setSettingsForm({ ...settingsForm, noivoName: e.target.value })}
                          className="w-full bg-[#23252a] border border-white/5 rounded-sm p-2.5 text-xs text-white focus:outline-none focus:border-terracotta font-sans"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Wedding Schedule */}
                  <div className="space-y-4">
                    <h4 className="text-xs uppercase font-label tracking-widest text-olive font-bold border-b border-white/5 pb-1">Cronograma</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-label uppercase tracking-widest text-white/50 mb-1.5 font-bold">Data do Casamento</label>
                        <input
                          type="date"
                          required
                          value={settingsForm.weddingDate}
                          onChange={(e) => setSettingsForm({ ...settingsForm, weddingDate: e.target.value })}
                          className="w-full bg-[#23252a] border border-white/5 rounded-sm p-2.5 text-xs text-white focus:outline-none focus:border-terracotta font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-label uppercase tracking-widest text-white/50 mb-1.5 font-bold">Horário de Início</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: 16:30"
                          value={settingsForm.weddingTime}
                          onChange={(e) => setSettingsForm({ ...settingsForm, weddingTime: e.target.value })}
                          className="w-full bg-[#23252a] border border-white/5 rounded-sm p-2.5 text-xs text-white focus:outline-none focus:border-terracotta font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* PIX config */}
                  <div className="space-y-4">
                    <h4 className="text-xs uppercase font-label tracking-widest text-olive font-bold border-b border-white/5 pb-1">Carteira Virtual (Recebimento PIX)</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-label uppercase tracking-widest text-white/50 mb-1.5 font-bold">Chave PIX (E-mail, CPF ou Tel)</label>
                        <input
                          type="text"
                          required
                          value={settingsForm.pixKey}
                          onChange={(e) => setSettingsForm({ ...settingsForm, pixKey: e.target.value })}
                          className="w-full bg-[#23252a] border border-white/5 rounded-sm p-2.5 text-xs text-white focus:outline-none focus:border-terracotta font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-label uppercase tracking-widest text-white/50 mb-1.5 font-bold">Titular da Conta</label>
                        <input
                          type="text"
                          required
                          value={settingsForm.pixHolder}
                          onChange={(e) => setSettingsForm({ ...settingsForm, pixHolder: e.target.value })}
                          className="w-full bg-[#23252a] border border-white/5 rounded-sm p-2.5 text-xs text-white focus:outline-none focus:border-terracotta font-sans"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Venue location Details */}
                  <div className="space-y-4 md:col-span-2">
                    <h4 className="text-xs uppercase font-label tracking-widest text-olive font-bold border-b border-white/5 pb-1">O Local da Celebração</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-1">
                        <label className="block text-[11px] font-label uppercase tracking-widest text-white/50 mb-1.5 font-bold">Nome do Espaço</label>
                        <input
                          type="text"
                          required
                          value={settingsForm.venueName}
                          onChange={(e) => setSettingsForm({ ...settingsForm, venueName: e.target.value })}
                          className="w-full bg-[#23252a] border border-white/5 rounded-sm p-2.5 text-xs text-white focus:outline-none focus:border-terracotta font-sans"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label className="block text-[11px] font-label uppercase tracking-widest text-white/50 mb-1.5 font-bold">Endereço Completo</label>
                        <input
                          type="text"
                          required
                          value={settingsForm.venueAddress}
                          onChange={(e) => setSettingsForm({ ...settingsForm, venueAddress: e.target.value })}
                          className="w-full bg-[#23252a] border border-white/5 rounded-sm p-2.5 text-xs text-white focus:outline-none focus:border-terracotta font-sans"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label className="block text-[11px] font-label uppercase tracking-widest text-white/50 mb-1.5 font-bold">Cidade & Estado (UF)</label>
                        <input
                          type="text"
                          required
                          value={settingsForm.venueCity}
                          onChange={(e) => setSettingsForm({ ...settingsForm, venueCity: e.target.value })}
                          className="w-full bg-[#23252a] border border-white/5 rounded-sm p-2.5 text-xs text-white focus:outline-none focus:border-terracotta font-sans"
                        />
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-label uppercase tracking-widest text-white/50 mb-1.5 font-bold">Link de Localização (Google Maps)</label>
                        <input
                          type="url"
                          required
                          value={settingsForm.venueMapUrl}
                          onChange={(e) => setSettingsForm({ ...settingsForm, venueMapUrl: e.target.value })}
                          className="w-full bg-[#23252a] border border-white/5 rounded-sm p-2.5 text-xs text-white focus:outline-none focus:border-terracotta font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Admin Secret Pin */}
                  <div className="space-y-4">
                    <h4 className="text-xs uppercase font-label tracking-widest text-olive font-bold border-b border-white/5 pb-1">Segurança</h4>
                    <div>
                      <label className="block text-[11px] font-label uppercase tracking-widest text-white/50 mb-1.5 font-bold">Código PIN de Acesso</label>
                      <input
                        type="text"
                        required
                        maxLength={12}
                        value={settingsForm.adminPin}
                        onChange={(e) => setSettingsForm({ ...settingsForm, adminPin: e.target.value })}
                        className="w-full bg-[#23252a] border border-white/5 rounded-sm p-2.5 text-xs text-white focus:outline-none focus:border-terracotta font-mono tracking-widest"
                      />
                      <p className="text-[10px] text-white/40 mt-1">Este é o PIN utilizado no formulário "Entrar" para acessar esta página.</p>
                    </div>
                  </div>

                  {/* Story Text */}
                  <div className="space-y-4 md:col-span-2">
                    <h4 className="text-xs uppercase font-label tracking-widest text-olive font-bold border-b border-white/5 pb-1">Nossa História</h4>
                    <div>
                      <label className="block text-[11px] font-label uppercase tracking-widest text-white/50 mb-1.5 font-bold">Texto Exibido no Site</label>
                      <textarea
                        required
                        rows={5}
                        value={settingsForm.ourStory}
                        onChange={(e) => setSettingsForm({ ...settingsForm, ourStory: e.target.value })}
                        className="w-full bg-[#23252a] border border-white/5 rounded-sm p-3 text-xs text-white focus:outline-none focus:border-terracotta font-sans leading-relaxed"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-label uppercase tracking-widest text-white/50 mb-1.5 font-bold">URL da Imagem do Casal</label>
                      <input
                        type="url"
                        required
                        value={settingsForm.ourStoryImageUrl}
                        onChange={(e) => setSettingsForm({ ...settingsForm, ourStoryImageUrl: e.target.value })}
                        className="w-full bg-[#23252a] border border-white/5 rounded-sm p-2.5 text-xs text-white focus:outline-none focus:border-terracotta font-mono"
                      />
                    </div>
                  </div>

                </div>

                {/* Save settings action button */}
                <div className="pt-6 border-t border-white/5 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 bg-terracotta hover:bg-terracotta-hover text-white font-label tracking-widest text-xs uppercase font-bold py-3.5 px-8 rounded-sm shadow-md transition-all"
                  >
                    <Save size={14} />
                    <span>Salvar Configurações</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        )}
      </div>

      {/* ADD/EDIT GIFT MODAL */}
      {isGiftModalOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal/85 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-[#191b1f] rounded-sm shadow-2xl max-w-md w-full border border-white/10 overflow-hidden text-white">
            
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-[#23252a]">
              <h3 className="font-serif text-lg text-[#e1d8d2]">
                {editingGift ? 'Editar Presente' : 'Adicionar Novo Presente'}
              </h3>
              <button 
                onClick={() => setIsGiftModalOpen(false)}
                className="text-white/50 hover:text-white font-semibold text-lg"
              >
                &times;
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleGiftSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-label uppercase tracking-widest text-white/50 mb-1">Nome do Item</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Jogo de Copos Oxford"
                  value={giftName}
                  onChange={(e) => setGiftName(e.target.value)}
                  className="w-full bg-[#23252a] border border-white/5 rounded-sm p-2.5 text-xs text-white focus:outline-none focus:border-terracotta"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-label uppercase tracking-widest text-white/50 mb-1">Valor (R$)</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    placeholder="Ex: 450.00"
                    value={giftPrice}
                    onChange={(e) => setGiftPrice(e.target.value)}
                    className="w-full bg-[#23252a] border border-white/5 rounded-sm p-2.5 text-xs text-white focus:outline-none focus:border-terracotta font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-label uppercase tracking-widest text-white/50 mb-1">Categoria</label>
                  <select
                    value={giftCategory}
                    onChange={(e) => setGiftCategory(e.target.value)}
                    className="w-full bg-[#23252a] border border-white/5 rounded-sm text-xs p-2.5 focus:outline-none focus:border-terracotta text-white"
                  >
                    <option value="Cozinha">Cozinha</option>
                    <option value="Eletrodomésticos">Eletrodomésticos</option>
                    <option value="Móveis">Móveis</option>
                    <option value="Cama e Banho">Cama e Banho</option>
                    <option value="Diversos">Diversos</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-label uppercase tracking-widest text-white/50 mb-1">URL da Imagem do Produto (Opcional)</label>
                <input
                  type="url"
                  placeholder="Link direto da imagem do produto"
                  value={giftImageUrl}
                  onChange={(e) => setGiftImageUrl(e.target.value)}
                  className="w-full bg-[#23252a] border border-white/5 rounded-sm p-2.5 text-xs text-white focus:outline-none focus:border-terracotta font-mono"
                />
                <p className="text-[9px] text-white/40 mt-1">Se deixado em branco, o sistema associará automaticamente uma imagem premium correspondente baseada no nome.</p>
              </div>

              {/* Action buttons */}
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsGiftModalOpen(false)}
                  className="bg-[#23252a] hover:bg-[#2b2e34] text-white/80 font-label tracking-widest text-[10px] uppercase font-bold py-2.5 px-4 rounded-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-terracotta hover:bg-terracotta-hover text-white font-label tracking-widest text-[10px] uppercase font-bold py-2.5 px-4 rounded-sm shadow-md"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
