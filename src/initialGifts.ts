import { Gift } from './types';

// A helper to assign beautiful, category-appropriate Unsplash images based on item keyword
export function getProductImage(name: string, category: string): string {
  const n = name.toLowerCase();
  
  if (n.includes('lua de mel') || n.includes('cota')) {
    return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'; // Beach honeymoon
  }
  if (n.includes('jantar') || n.includes('prato') || n.includes('sopa') || n.includes('porcelana') || n.includes('travessa') || n.includes('ramequin') || n.includes('baixela')) {
    return 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=600&q=80'; // Fine dinnerware
  }
  if (n.includes('air fryer') || n.includes('fritadeira')) {
    return 'https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?auto=format&fit=crop&w=600&q=80'; // Air fryer
  }
  if (n.includes('cafeteira') || n.includes('café') || n.includes('xícara')) {
    return 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80'; // Espresso/coffee
  }
  if (n.includes('batedeira') || n.includes('mixer') || n.includes('liquidificador') || n.includes('processador') || n.includes('pão')) {
    return 'https://images.unsplash.com/photo-1578643463396-0997cb5328c1?auto=format&fit=crop&w=600&q=80'; // Blender/appliances
  }
  if (n.includes('churrasqueira') || n.includes('churrasco') || n.includes('grill') || n.includes('espeto') || n.includes('pizza')) {
    return 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80'; // Grill/pizza/bbq
  }
  if (n.includes('panela') || n.includes('panelas') || n.includes('assadeira') || n.includes('utensílio') || n.includes('açucareiro') || n.includes('garfo') || n.includes('colher')) {
    return 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=600&q=80'; // Pots and utensils
  }
  if (n.includes('sofá') || n.includes('poltrona') || n.includes('cadeira') || n.includes('mesa de jantar') || n.includes('comoda') || n.includes('cabeceira') || n.includes('recamier')) {
    return 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80'; // Luxury furniture
  }
  if (n.includes('cama') || n.includes('lençol') || n.includes('toalha') || n.includes('branco')) {
    return 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=600&q=80'; // Bedsheets/linens
  }
  if (n.includes('taça') || n.includes('copo') || n.includes('gelo') || n.includes('sorvete') || n.includes('balde')) {
    return 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80'; // Crystal glasses
  }
  if (n.includes('faqueiro') || n.includes('faca') || n.includes('talher') || n.includes('prochef')) {
    return 'https://images.unsplash.com/photo-1543510473-ac2c35329a28?auto=format&fit=crop&w=600&q=80'; // Cutlery set
  }
  if (n.includes('fondue')) {
    return 'https://images.unsplash.com/photo-1574085733277-851d9d856a3a?auto=format&fit=crop&w=600&q=80'; // Fondue set
  }
  if (n.includes('aspirador') || n.includes('lavadora') || n.includes('parafusadeira') || n.includes('furadeira') || n.includes('passar') || n.includes('purificador')) {
    return 'https://images.unsplash.com/photo-1518133680790-3985ecea0ec8?auto=format&fit=crop&w=600&q=80'; // Smart cleaner / appliance
  }
  if (n.includes('bomboniere') || n.includes('fruteira') || n.includes('home') || n.includes('difusor')) {
    return 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80'; // Modern decor
  }
  if (n.includes('vale') || n.includes('presente')) {
    return 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80'; // Gift card
  }
  
  // Category defaults
  if (category === 'Cozinha') {
    return 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80';
  }
  if (category === 'Eletrodomésticos') {
    return 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80';
  }
  if (category === 'Móveis') {
    return 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80';
  }
  if (category === 'Decoração') {
    return 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80';
  }
  
  return 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80'; // Generic wedding romance
}

export function inferCategory(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('sofá') || n.includes('poltrona') || n.includes('cadeira') || n.includes('mesa de jantar') || n.includes('comoda') || n.includes('cabeceira') || n.includes('recamier')) {
    return 'Móveis';
  }
  if (n.includes('cama') || n.includes('lençol') || n.includes('toalha') || n.includes('colchão')) {
    return 'Cama e Banho';
  }
  if (n.includes('fritadeira') || n.includes('air fryer') || n.includes('batedeira') || n.includes('mixer') || n.includes('liquidificador') || n.includes('processador') || n.includes('máquina de fazer pão') || n.includes('purificador') || n.includes('lava e seca') || n.includes('lavadora') || n.includes('lava-louça') || n.includes('panela elétrica') || n.includes('churrasqueira elétrica') || n.includes('pipoqueira')) {
    return 'Eletrodomésticos';
  }
  if (n.includes('bomboniere') || n.includes('fruteira') || n.includes('home') || n.includes('difusor') || n.includes('vaso') || n.includes('quadro')) {
    return 'Decoração';
  }
  if (n.includes('cota') || n.includes('vale-presente') || n.includes('viagem') || n.includes('parafusadeira') || n.includes('furadeira') || n.includes('saquetes') || n.includes('alta pressão')) {
    return 'Diversos';
  }
  return 'Cozinha';
}

const rawGifts = [
  { "item": "4 cadeiras", "valor": "R$ 494,89" },
  { "item": "Açucareiro inox com colher", "valor": "R$ 90,57" },
  { "item": "Air fryer Oster 4L", "valor": "R$ 446,92" },
  { "item": "Air fryer Digital Philco", "valor": "R$ 706,19" },
  { "item": "Aparelho de fondue", "valor": "R$ 461,77" },
  { "item": "Aparelho de jantar Cerâmica 20 peças", "valor": "R$ 1.024,85" },
  { "item": "Aparelho de jantar Oxford 16 peças", "valor": "R$ 306,32" },
  { "item": "Aparelho de jantar Porcelana 20 peças", "valor": "R$ 546,29" },
  { "item": "Aparelho de jantar Elegance 30 peças", "valor": "R$ 477,76" },
  { "item": "Aparelho de sopa - 5 peças", "valor": "R$ 173,95" },
  { "item": "Aparelho Jantar e Chá Porcelana 30 peças", "valor": "R$ 934,62" },
  { "item": "Adega de Vinhos com Rodas Soft - Brastemp", "valor": "R$ 283,59" },
  { "item": "Baixela em porcelana", "valor": "R$ 279,02" },
  { "item": "Balde para gelo com pinça", "valor": "R$ 112,27" },
  { "item": "Bandeja de café da manhã", "valor": "R$ 105,42" },
  { "item": "Bandeja inox espelhada", "valor": "R$ 401,23" },
  { "item": "Batedeira de Bolo Arno", "valor": "R$ 820,40" },
  { "item": "Batedeira Planetária Mondial 700w", "valor": "R$ 404,97" },
  { "item": "Bomboniere de Cristal com Tampa", "valor": "R$ 84,23" },
  { "item": "Cafeteira Nespresso Vertuo", "valor": "R$ 420,65" },
  { "item": "Churrasqueira elétrica Mondial", "valor": "R$ 826,11" },
  { "item": "Espetos Coletor de Gordura Automatic Grill", "valor": "R$ 409,23" },
  { "item": "Comoda para quarto de casal", "valor": "R$ 614,82" },
  { "item": "Jogo de Toalhas de Banho Brancas Premium", "valor": "R$ 123,68" },
  { "item": "Conjunto de assadeiras de vidro Marinex 4 unidades", "valor": "R$ 146,42" },
  { "item": "Conjunto de baixelas 9 peças inox", "valor": "R$ 219,63" },
  { "item": "Conjunto de Panelas em Aço Inox, 10 peças - All-Clad", "valor": "R$ 956,32" },
  { "item": "Conjunto de ramequins - 6 peças", "valor": "R$ 135,11" },
  { "item": "Conjunto de Facas Tramontina Premium", "valor": "R$ 192,22" },
  { "item": "Conjunto de Panelas 5 Peças - Tramontina", "valor": "R$ 226,49" },
  { "item": "Conjunto para sorvete inox - 13 peças", "valor": "R$ 249,33" },
  { "item": "Conjunto sushi - 12 peças", "valor": "R$ 155,67" },
  { "item": "Faqueiro Prochef Tramontina 7 Peças", "valor": "R$ 1.047,69" },
  { "item": "Difusor de Ambientes Home Scent", "valor": "R$ 123,69" },
  { "item": "Jogo de Copos 340ml – 6 Peças Oxford", "valor": "R$ 203,64" },
  { "item": "Cotas de lua de mel - Jantar Romântico", "valor": "R$ 363,54" },
  { "item": "Cotas de lua de mel - Passeio de Barco", "valor": "R$ 591,97" },
  { "item": "Faqueiro inox 24 peças", "valor": "R$ 204,79" },
  { "item": "Faqueiro inox 42 peças Tramontina", "valor": "R$ 598,83" },
  { "item": "Faqueiro Inox Classic", "valor": "R$ 365,26" },
  { "item": "Fritadeira Air Fryer Forno Oven 12L", "valor": "R$ 519,28" },
  { "item": "Fritadeira Elétrica Ultra Air Fryer Sem Óleo", "valor": "R$ 340,70" },
  { "item": "Fruteira de mesa de cristal", "valor": "R$ 353,26" },
  { "item": "Jogo De 6 Taças Para Sobremesa Cristal", "valor": "R$ 237,91" },
  { "item": "Jogo de 6 xícaras para café Rojemac - Spicy", "valor": "R$ 306,44" },
  { "item": "Jogo de assadeiras alumínio 3 peças", "valor": "R$ 280,17" },
  { "item": "Jogo de facas para petiscos - 6 peças", "valor": "R$ 119,12" },
  { "item": "Jogo de panela antiaderente Rochedo", "valor": "R$ 363,54" },
  { "item": "Jogo de Panelas Antiaderente Panelux", "valor": "R$ 477,76" },
  { "item": "Jogo de panelas vermelhas 5 peças", "valor": "R$ 569,13" },
  { "item": "Jogo de saquetes encaixe - 94 peças", "valor": "R$ 398,95" },
  { "item": "Jogo de taças azul para água", "valor": "R$ 173,95" },
  { "item": "Jogo de travessas de porcelana", "valor": "R$ 128,26" },
  { "item": "Jogo para churrasco - 24 peças Tramontina", "valor": "R$ 300,73" },
  { "item": "JOGO TALHER PORTA TALHER CLASSIC 29 PECAS", "valor": "R$ 186,51" },
  { "item": "Kit churrasqueiro profissional", "valor": "R$ 686,77" },
  { "item": "Kit de utensílios silicone 12 peças", "valor": "R$ 141,97" },
  { "item": "Kit mesa de cabeceira retrô - 2 unidades", "valor": "R$ 477,76" },
  { "item": "Kit sobremesa de vidro - 7 peças", "valor": "R$ 114,24" },
  { "item": "Lavadora de alta pressão Karcher", "valor": "R$ 431,96" },
  { "item": "Lavadora de alta pressão Electrolux", "valor": "R$ 721,03" },
  { "item": "Lava e seca brastemp 11kg", "valor": "R$ 3.218,91" },
  { "item": "Lava-louça automática 10 serviços", "valor": "R$ 2.346,31" },
  { "item": "Liquidificador com jarra de vidro Oster", "valor": "R$ 301,87" },
  { "item": "Máquina de fazer pão Mondial", "valor": "R$ 553,14" },
  { "item": "Mesa de jantar - 4 cadeiras MDF", "valor": "R$ 488,14" },
  { "item": "Mesa de Passar Tramontina Premium", "valor": "R$ 237,79" },
  { "item": "Mesa Multiuso Preta 91398120 - Tramontina", "valor": "R$ 111,13" },
  { "item": "Mixer, processador e batedor oster", "valor": "R$ 328,14" },
  { "item": "Panela Elétrica Electrolux 1,8L", "valor": "R$ 456,98" },
  { "item": "Parafusadeira e furadeira Bosch", "valor": "R$ 263,03" },
  { "item": "Pipoqueira elétrica sem óleo", "valor": "R$ 171,46" },
  { "item": "Poltrona decorativa bege", "valor": "R$ 280,17" },
  { "item": "Purificador de água IBBL", "valor": "R$ 855,81" },
  { "item": "Recamier Barcelona em Linho", "valor": "R$ 430,93" },
  { "item": "Sofá linho 3 lugares", "valor": "R$ 1.128,78" },
  { "item": "Talheres para Kit Pizza", "valor": "R$ 124,72" },
  { "item": "Travessa oval porcelana", "valor": "R$ 82,58" },
  { "item": "Travessa Refrataria Rasa e Funda p/ Lasanha Oxford", "valor": "R$ 249,32" },
  { "item": "Vale-presente Reconstrução do Lar", "valor": "R$ 363,54" }
];

export const initialGifts: Gift[] = rawGifts.map((rg, index) => {
  // Parse value: e.g. "R$ 1.024,85" -> 1024.85
  const cleanValStr = rg.valor
    .replace('R$', '')
    .replace('A partir de', '')
    .replace(/\s/g, '')
    .replace('.', '')
    .replace(',', '.')
    .trim();
  const price = parseFloat(cleanValStr) || 100;
  const category = inferCategory(rg.item);
  const imageUrl = getProductImage(rg.item, category);
  
  return {
    id: `gift-${index + 1}`,
    name: rg.item,
    price,
    category,
    imageUrl,
    status: 'disponivel'
  };
});
