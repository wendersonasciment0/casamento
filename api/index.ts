import dotenv from "dotenv";
// Carregar variáveis de ambiente do .env
dotenv.config();

import express from "express";
import path from "path";
import fs from "fs";
import { createClient } from "@supabase/supabase-js";
export interface WeddingInfo {
  noivaName: string;
  noivoName: string;
  weddingDate: string;
  weddingTime: string;
  venueName: string;
  venueAddress: string;
  venueCity: string;
  venueMapUrl: string;
  ourStory: string;
  ourStoryImageUrl: string;
  pixKey: string;
  pixHolder: string;
  adminPin: string;
  hasBannerImage?: boolean;
}

export interface RSVP {
  id: string;
  name: string;
  phone: string;
  confirmed: boolean;
  numGuests: number;
  message: string;
  dietRestrictions: string;
  createdAt: string;
}

export interface Gift {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  status: 'disponivel' | 'comprado';
  buyerName?: string;
  buyerEmail?: string;
  purchasedAt?: string;
}

export interface Purchase {
  id: string;
  giftId: string;
  giftName: string;
  amount: number;
  buyerName: string;
  buyerEmail: string;
  paymentMethod: 'pix' | 'card';
  paidAt: string;
  status: 'pendente' | 'aprovado';
}

export interface EmailNotification {
  id: string;
  type: 'rsvp' | 'purchase_buyer' | 'purchase_couple';
  recipient: string;
  subject: string;
  body: string;
  sentAt: string;
}


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


const app = express();
const PORT = Number(process.env.PORT || 3001);

app.use(express.json());

// Middleware para semear o banco sob demanda na primeira requisição de API
let isSeeded = false;
app.use(async (req, res, next) => {
  if (!isSeeded && req.path.startsWith("/api")) {
    try {
      await seedDatabaseIfNeeded();
      isSeeded = true;
    } catch (seedErr) {
      console.error("Falha ao configurar a semeadura inicial do banco:", seedErr);
    }
  }
  next();
});

// Inicializar cliente do Supabase
const supabaseUrl = process.env.SUPABASE_URL || "https://kfdyekcvaeurbscdvhyd.supabase.co";
// Usa chave Service Role se disponível para saltar RLS com segurança administrativa, ou Anon Key como fallback secundário
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY !== "INSIRA_SUA_CHAVE_SERVICE_ROLE_AQUI"
  ? process.env.SUPABASE_SERVICE_ROLE_KEY
  : (process.env.SUPABASE_ANON_KEY || "");

if (!supabaseKey) {
  console.warn("AVISO: Chave do Supabase não configurada. Conexão com o banco pode falhar.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ==========================================
// MIGRATION & SEEDING HELPERS (Para ler arquivos locais e importar para o Supabase)
// ==========================================
const DATA_DIR = path.join(process.cwd(), "data");
if (!process.env.VERCEL) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getFilePath(filename: string): string {
  return path.join(DATA_DIR, filename);
}

function readJSON<T>(filename: string, defaultValue: T): T {
  const filePath = getFilePath(filename);
  if (!fs.existsSync(filePath)) {
    return defaultValue;
  }
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`Error reading local JSON file ${filename}`, e);
    return defaultValue;
  }
}

const defaultWeddingInfo: WeddingInfo = {
  noivaName: "Letielly",
  noivoName: "Wenderson",
  weddingDate: "2026-11-14",
  weddingTime: "16:30",
  venueName: "Mansão Rosewood",
  venueAddress: "Alameda das Capelas, 1200 - Vale do Sol",
  venueCity: "Vale do Paraíba, SP",
  venueMapUrl: "https://maps.google.com/?q=Mansao+Rosewood+Vale+do+Paraiba",
  ourStory: "Nossa história começou como um encontro de almas que sabiam, desde o primeiro momento, que o destino reservava algo maior. Cada dia ao seu lado foi um tijolo na construção do nosso 'para sempre'. Hoje, convidamos você a testemunhar o capítulo mais lindo da nossa união.",
  ourStoryImageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
  pixKey: "wenderson.dnsilva@gmail.com",
  pixHolder: "Wenderson Silva",
  adminPin: "1234",
  hasBannerImage: true,
  notificationEmail: "letielly&wenderson@casamento.com"
};

// ==========================================
// MAREAMENTOS DE OBJETOS: LOCAL (camelCase) <-> BANCO DE DADOS (snake_case)
// ==========================================

function dbToWeddingInfo(row: any): WeddingInfo {
  return {
    noivaName: row.noiva_name,
    noivoName: row.noivo_name,
    weddingDate: row.wedding_date,
    weddingTime: row.wedding_time,
    venueName: row.venue_name,
    venueAddress: row.venue_address,
    venueCity: row.venue_city,
    venueMapUrl: row.venue_map_url,
    ourStory: row.our_story,
    ourStoryImageUrl: row.our_story_image_url,
    pixKey: row.pix_key,
    pixHolder: row.pix_holder,
    adminPin: row.admin_pin,
    hasBannerImage: row.has_banner_image,
    notificationEmail: row.notification_email
  };
}

function weddingInfoToDb(info: WeddingInfo): any {
  return {
    id: 1,
    noiva_name: info.noivaName,
    noivo_name: info.noivoName,
    wedding_date: info.weddingDate,
    wedding_time: info.weddingTime,
    venue_name: info.venueName,
    venue_address: info.venueAddress,
    venue_city: info.venueCity,
    venue_map_url: info.venueMapUrl,
    our_story: info.ourStory,
    our_story_image_url: info.ourStoryImageUrl,
    pix_key: info.pixKey,
    pix_holder: info.pixHolder,
    admin_pin: info.adminPin,
    has_banner_image: info.hasBannerImage,
    notification_email: info.notificationEmail || "letielly&wenderson@casamento.com"
  };
}

function dbToGift(row: any): Gift {
  return {
    id: row.id,
    name: row.name,
    price: parseFloat(row.price),
    category: row.category,
    imageUrl: row.image_url,
    status: row.status,
    buyerName: row.buyer_name || undefined,
    buyerEmail: row.buyer_email || undefined,
    purchasedAt: row.purchased_at || undefined
  };
}

function giftToDb(gift: Gift): any {
  return {
    id: gift.id,
    name: gift.name,
    price: gift.price,
    category: gift.category,
    image_url: gift.imageUrl,
    status: gift.status,
    buyer_name: gift.buyerName || null,
    buyer_email: gift.buyerEmail || null,
    purchased_at: gift.purchasedAt || null
  };
}

function dbToRSVP(row: any): RSVP {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    confirmed: row.confirmed,
    numGuests: row.num_guests,
    message: row.message || "",
    dietRestrictions: row.diet_restrictions || "",
    createdAt: row.created_at
  };
}

function rsvpToDb(rsvp: RSVP): any {
  return {
    id: rsvp.id,
    name: rsvp.name,
    phone: rsvp.phone,
    confirmed: rsvp.confirmed,
    num_guests: rsvp.numGuests,
    message: rsvp.message || "",
    diet_restrictions: rsvp.dietRestrictions || "",
    created_at: rsvp.createdAt
  };
}

function dbToPurchase(row: any): Purchase {
  return {
    id: row.id,
    giftId: row.gift_id || undefined,
    giftName: row.gift_name,
    amount: parseFloat(row.amount),
    buyerName: row.buyer_name,
    buyerEmail: row.buyer_email,
    paymentMethod: row.payment_method as 'pix' | 'card',
    paidAt: row.paid_at,
    status: row.status as 'aprovado' | 'pendente'
  };
}

function purchaseToDb(p: Purchase): any {
  return {
    id: p.id,
    gift_id: p.giftId || null,
    gift_name: p.giftName,
    amount: p.amount,
    buyer_name: p.buyerName,
    buyer_email: p.buyerEmail,
    payment_method: p.paymentMethod,
    paid_at: p.paidAt,
    status: p.status
  };
}

function dbToNotification(row: any): EmailNotification {
  return {
    id: row.id,
    type: row.type as 'rsvp' | 'purchase_buyer' | 'purchase_couple',
    recipient: row.recipient,
    subject: row.subject,
    body: row.body,
    sentAt: row.sent_at
  };
}

function notificationToDb(n: EmailNotification): any {
  return {
    id: n.id,
    type: n.type,
    recipient: n.recipient,
    subject: n.subject,
    body: n.body,
    sent_at: n.sentAt
  };
}

// ==========================================
// FUNÇÕES ASYNC DE ACESSO AO BANCO DE DADOS
// ==========================================

async function getWeddingInfoDb(): Promise<WeddingInfo> {
  const { data, error } = await supabase
    .from("wedding_info")
    .select("*")
    .eq("id", 1)
    .single();
  
  if (error || !data) {
    console.log("Configurações não encontradas ou erro no Supabase, usando padrão.");
    return defaultWeddingInfo;
  }
  return dbToWeddingInfo(data);
}

async function verifyAdminPin(req: express.Request): Promise<boolean> {
  const pin = req.headers["x-admin-pin"] as string;
  const currentWedding = await getWeddingInfoDb();
  return pin === currentWedding.adminPin;
}

async function addNotificationDb(type: EmailNotification["type"], recipient: string, subject: string, body: string) {
  const newNotif: EmailNotification = {
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    type,
    recipient,
    subject,
    body,
    sentAt: new Date().toISOString()
  };
  
  const { error } = await supabase
    .from("notifications")
    .insert([notificationToDb(newNotif)]);
  
  if (error) {
    console.error("Erro ao registrar notificação no Supabase:", error);
  }
}

// ==========================================
// FUNÇÃO DE SEMEADURA (SEEDING) DO BANCO DE DADOS
// ==========================================
async function seedDatabaseIfNeeded() {
  console.log("Supabase: Verificando tabelas para sincronizar dados locais...");

  // 1. Sincronizar wedding_info
  const { data: infoData, error: infoErr } = await supabase
    .from("wedding_info")
    .select("id")
    .eq("id", 1);

  if (infoErr) {
    console.error("Erro ao ler tabela wedding_info no Supabase:", infoErr);
  } else if (!infoData || infoData.length === 0) {
    console.log("Banco wedding_info vazio. Migrando dados locais ou padrão...");
    const localInfo = readJSON<WeddingInfo>("wedding_info.json", defaultWeddingInfo);
    const { error: insertErr } = await supabase
      .from("wedding_info")
      .insert([weddingInfoToDb(localInfo)]);
    if (insertErr) {
      console.error("Erro ao migrar wedding_info para o Supabase:", insertErr);
    } else {
      console.log("Configurações do casamento migradas com sucesso para o Supabase!");
    }
  }

  // 2. Sincronizar gifts
  const { data: giftsData, error: giftsErr } = await supabase
    .from("gifts")
    .select("id")
    .limit(1);

  if (giftsErr) {
    console.error("Erro ao ler tabela gifts no Supabase:", giftsErr);
  } else if (!giftsData || giftsData.length === 0) {
    console.log("Banco gifts vazio. Migrando presentes...");
    const localGifts = readJSON<Gift[]>("gifts.json", initialGifts);
    const dbGifts = localGifts.map(giftToDb);
    
    // Batch insert de 50 itens
    for (let i = 0; i < dbGifts.length; i += 50) {
      const batch = dbGifts.slice(i, i + 50);
      const { error: insertErr } = await supabase.from("gifts").insert(batch);
      if (insertErr) {
        console.error(`Erro ao migrar presentes (${i} a ${i + batch.length}):`, insertErr);
      }
    }
    console.log(`Lista de presentes (${localGifts.length} itens) migrada com sucesso.`);
  }

  // 3. Sincronizar rsvps
  const { data: rsvpsData, error: rsvpsErr } = await supabase
    .from("rsvps")
    .select("id")
    .limit(1);

  if (rsvpsErr) {
    console.error("Erro ao ler tabela rsvps no Supabase:", rsvpsErr);
  } else if (!rsvpsData || rsvpsData.length === 0) {
    const localRsvps = readJSON<RSVP[]>("rsvps.json", []);
    if (localRsvps.length > 0) {
      console.log(`Banco rsvps vazio. Migrando (${localRsvps.length} itens)...`);
      const { error: insertErr } = await supabase.from("rsvps").insert(localRsvps.map(rsvpToDb));
      if (insertErr) {
        console.error("Erro ao migrar rsvps para o Supabase:", insertErr);
      }
    }
  }

  // 4. Sincronizar purchases
  const { data: purchasesData, error: purchasesErr } = await supabase
    .from("purchases")
    .select("id")
    .limit(1);

  if (purchasesErr) {
    console.error("Erro ao ler tabela purchases no Supabase:", purchasesErr);
  } else if (!purchasesData || purchasesData.length === 0) {
    const localPurchases = readJSON<Purchase[]>("purchases.json", []);
    if (localPurchases.length > 0) {
      console.log(`Banco purchases vazio. Migrando (${localPurchases.length} compras)...`);
      const { error: insertErr } = await supabase.from("purchases").insert(localPurchases.map(purchaseToDb));
      if (insertErr) {
        console.error("Erro ao migrar purchases para o Supabase:", insertErr);
      }
    }
  }

  // 5. Sincronizar notifications
  const { data: notificationsData, error: notificationsErr } = await supabase
    .from("notifications")
    .select("id")
    .limit(1);

  if (notificationsErr) {
    console.error("Erro ao ler tabela notifications no Supabase:", notificationsErr);
  } else if (!notificationsData || notificationsData.length === 0) {
    const localNotifs = readJSON<EmailNotification[]>("notifications.json", []);
    if (localNotifs.length > 0) {
      console.log(`Banco notifications vazio. Migrando (${localNotifs.length} registros)...`);
      const { error: insertErr } = await supabase.from("notifications").insert(localNotifs.map(notificationToDb));
      if (insertErr) {
        console.error("Erro ao migrar notifications para o Supabase:", insertErr);
      }
    }
  }

  console.log("Supabase: Verificação de tabelas finalizada.");
}

// ==========================================
// DIRETRIZES E ROTAS DA API
// ==========================================

// GET Wedding info
app.get("/api/wedding-info", async (req, res) => {
  try {
    const info = await getWeddingInfoDb();
    const publicInfo = { ...info };
    // @ts-ignore
    delete publicInfo.adminPin;
    res.json({ info: publicInfo });
  } catch (err: any) {
    console.error("Erro na API get/wedding-info:", err);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

// GET Wedding info com validação de PIN (Login do painel dos noivos)
app.post("/api/wedding-info/verify", async (req, res) => {
  try {
    const { pin } = req.body;
    const info = await getWeddingInfoDb();
    if (pin === info.adminPin) {
      res.json({ success: true, info });
    } else {
      res.status(401).json({ success: false, message: "Código PIN inválido!" });
    }
  } catch (err: any) {
    console.error("Erro na API verify/wedding-info:", err);
    res.status(500).json({ success: false, message: "Erro interno no servidor." });
  }
});

// POST Modificar informações do casamento
app.post("/api/wedding-info", async (req, res) => {
  try {
    if (!(await verifyAdminPin(req))) {
      return res.status(401).json({ error: "Acesso não autorizado." });
    }
    const current = await getWeddingInfoDb();
    const updated: WeddingInfo = {
      ...current,
      ...req.body
    };
    
    // Atualizar no Supabase
    const { error } = await supabase
      .from("wedding_info")
      .update(weddingInfoToDb(updated))
      .eq("id", 1);

    if (error) {
      console.error("Erro ao salvar no Supabase:", error);
      return res.status(500).json({ error: "Erro ao salvar informações no banco de dados." });
    }

    res.json({ success: true, info: updated });
  } catch (err: any) {
    console.error("Erro ao atualizar wedding-info:", err);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

// GET RSVPs (Admin only)
app.get("/api/rsvps", async (req, res) => {
  try {
    if (!(await verifyAdminPin(req))) {
      return res.status(401).json({ error: "Acesso não autorizado." });
    }
    
    const { data, error } = await supabase
      .from("rsvps")
      .select("*")
      .order("db_created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar rsvps no Supabase:", error);
      return res.status(500).json({ error: "Erro ao buscar RSVPs no banco." });
    }

    res.json({ rsvps: (data || []).map(dbToRSVP) });
  } catch (err: any) {
    console.error("Erro na API get/rsvps:", err);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

// POST RSVP (Novo convidado confirmando presença)
app.post("/api/rsvps", async (req, res) => {
  try {
    const { name, phone, confirmed, numGuests, message, dietRestrictions } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: "Nome e Telefone são obrigatórios." });
    }

    const newRsvp: RSVP = {
      id: `rsvp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name,
      phone,
      confirmed: !!confirmed,
      numGuests: confirmed ? parseInt(numGuests) || 1 : 0,
      message: message || "",
      dietRestrictions: dietRestrictions || "",
      createdAt: new Date().toISOString()
    };

    const { error } = await supabase
      .from("rsvps")
      .insert([rsvpToDb(newRsvp)]);

    if (error) {
      console.error("Erro ao inserir RSVP no Supabase:", error);
      return res.status(500).json({ error: "Erro ao salvar confirmação." });
    }

    // Enviar notificação simulada para o casal
    const wedding = await getWeddingInfoDb();
    const coupleSubject = `[Confirmação de Presença] ${name} ${confirmed ? "confirmou!" : "declinou."}`;
    const coupleBody = `Olá ${wedding.noivaName} & ${wedding.noivoName},
    
Temos novidades sobre a presença no casamento!
Convidado(a): ${name}
Telefone: ${phone}
Status: ${confirmed ? "Confirmado (Eu vou!)" : "Declinado (Não poderei ir)"}
Nº de Acompanhantes: ${newRsvp.numGuests}
Restrições Alimentares: ${dietRestrictions || "Nenhuma"}
Mensagem: "${message || "Sem mensagem"}"

Atenciosamente,
Sistema de Gestão de Celebração`;

    const targetEmail = wedding.notificationEmail || `${wedding.noivoName.toLowerCase()}&${wedding.noivaName.toLowerCase()}@casamento.com`;
    await addNotificationDb("rsvp", targetEmail, coupleSubject, coupleBody);

    res.json({ success: true, rsvp: newRsvp });
  } catch (err: any) {
    console.error("Erro ao processar POST rsvps:", err);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

// DELETE RSVP (Admin only)
app.delete("/api/rsvps/:id", async (req, res) => {
  try {
    if (!(await verifyAdminPin(req))) {
      return res.status(401).json({ error: "Acesso não autorizado." });
    }
    const { id } = req.params;

    const { error } = await supabase
      .from("rsvps")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Erro ao deletar RSVP no Supabase:", error);
      return res.status(500).json({ error: "Erro ao deletar confirmação." });
    }

    res.json({ success: true });
  } catch (err: any) {
    console.error("Erro ao processar DELETE rsvp:", err);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

// GET Lista de presentes
app.get("/api/gifts", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("gifts")
      .select("*");

    if (error) {
      console.error("Erro ao buscar presentes no Supabase:", error);
      return res.status(500).json({ error: "Erro ao carregar lista de presentes." });
    }

    const gifts = (data || []).map(dbToGift);

    // Ordenar presentes: os criados de forma personalizada ou mais novos aparecem primeiro ordenadamente
    gifts.sort((a, b) => {
      const aCustom = a.id.includes("custom");
      const bCustom = b.id.includes("custom");
      if (aCustom && !bCustom) return -1;
      if (!aCustom && bCustom) return 1;

      const aNum = parseInt(a.id.replace(/[^\d]/g, "")) || 0;
      const bNum = parseInt(b.id.replace(/[^\d]/g, "")) || 0;
      return aNum - bNum;
    });

    res.json({ gifts });
  } catch (err: any) {
    console.error("Erro ao carregar lista de presentes:", err);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

// POST Upload de Imagem (Admin apenas)
app.post("/api/upload", async (req, res) => {
  try {
    if (!(await verifyAdminPin(req))) {
      return res.status(401).json({ error: "Acesso não autorizado." });
    }
    const { filename, contentType, base64Data } = req.body;
    if (!filename || !contentType || !base64Data) {
      return res.status(400).json({ error: "Parâmetros filename, contentType e base64Data são obrigatórios." });
    }

    // Decode base64 data to buffer
    const base64Body = base64Data.split(';base64,').pop() || base64Data;
    const buffer = Buffer.from(base64Body, 'base64');
    
    // Upload image to Supabase storage
    const pathName = `public/${Date.now()}-${filename}`;
    const { data: uploadResult, error } = await supabase.storage
      .from('gift-images')
      .upload(pathName, buffer, {
        contentType,
        upsert: true
      });

    if (error) {
      console.error("Erro ao fazer upload no Supabase Storage:", error);
      return res.status(500).json({ error: "Erro ao fazer upload da imagem." });
    }

    // Obter URL pública
    const { data: publicUrlData } = supabase.storage
      .from('gift-images')
      .getPublicUrl(pathName);

    res.json({ success: true, imageUrl: publicUrlData.publicUrl });
  } catch (err: any) {
    console.error("Erro no processamento do upload:", err);
    res.status(500).json({ error: "Erro interno no servidor de upload." });
  }
});

// POST Adicionar presentes (Admin apenas)
app.post("/api/gifts", async (req, res) => {
  try {
    if (!(await verifyAdminPin(req))) {
      return res.status(401).json({ error: "Acesso não autorizado." });
    }
    const { name, price, category, imageUrl } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({ error: "Nome, preço e categoria são obrigatórios." });
    }

    const newGift: Gift = {
      id: `gift-custom-${Date.now()}`,
      name,
      price: parseFloat(price),
      category,
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80",
      status: 'disponivel'
    };

    const { error } = await supabase
      .from("gifts")
      .insert([giftToDb(newGift)]);

    if (error) {
      console.error("Erro ao salvar presente no Supabase:", error);
      return res.status(500).json({ error: "Erro ao criar presente." });
    }

    res.json({ success: true, gift: newGift });
  } catch (err: any) {
    console.error("Erro ao processar POST gifts:", err);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

// PUT Atualizar presentes (Admin apenas)
app.put("/api/gifts/:id", async (req, res) => {
  try {
    if (!(await verifyAdminPin(req))) {
      return res.status(401).json({ error: "Acesso não autorizado." });
    }
    const { id } = req.params;

    // Buscar presente existente
    const { data: existing, error: fetchErr } = await supabase
      .from("gifts")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr || !existing) {
      return res.status(404).json({ error: "Presente não encontrado." });
    }

    const currentGift = dbToGift(existing);
    const { name, price, category, imageUrl, status, buyerName, buyerEmail } = req.body;

    const updatedGift: Gift = {
      ...currentGift
    };

    if (name !== undefined) updatedGift.name = name;
    if (price !== undefined) updatedGift.price = parseFloat(price);
    if (category !== undefined) updatedGift.category = category;
    if (imageUrl !== undefined) updatedGift.imageUrl = imageUrl;

    if (status !== undefined) {
      updatedGift.status = status;
      if (status === 'disponivel') {
        updatedGift.buyerName = undefined;
        updatedGift.buyerEmail = undefined;
        updatedGift.purchasedAt = undefined;
      } else if (status === 'comprado') {
        updatedGift.buyerName = buyerName || currentGift.buyerName || "Adquirido Presencialmente";
        updatedGift.buyerEmail = buyerEmail || currentGift.buyerEmail || "noivos@casamento.com";
        updatedGift.purchasedAt = currentGift.purchasedAt || new Date().toISOString();
      }
    }

    const { error } = await supabase
      .from("gifts")
      .update(giftToDb(updatedGift))
      .eq("id", id);

    if (error) {
      console.error("Erro ao atualizar presente no Supabase:", error);
      return res.status(500).json({ error: "Erro ao salvar alterações no presente." });
    }

    res.json({ success: true, gift: updatedGift });
  } catch (err: any) {
    console.error("Erro ao processar PUT gifts:", err);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

// DELETE Deletar presente (Admin apenas)
app.delete("/api/gifts/:id", async (req, res) => {
  try {
    if (!(await verifyAdminPin(req))) {
      return res.status(401).json({ error: "Acesso não autorizado." });
    }
    const { id } = req.params;

    const { error } = await supabase
      .from("gifts")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Erro ao deletar presente no Supabase:", error);
      return res.status(500).json({ error: "Erro ao excluir presente." });
    }

    res.json({ success: true });
  } catch (err: any) {
    console.error("Erro ao processar DELETE gift:", err);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

// POST Simulação de compra de presente de casamento (Guest buying gift)
app.post("/api/gifts/:id/buy", async (req, res) => {
  try {
    const { id } = req.params;
    const { buyerName, buyerEmail, paymentMethod, amount } = req.body;

    if (!buyerName || !buyerEmail || !paymentMethod) {
      return res.status(400).json({ error: "Nome, e-mail e método de pagamento são obrigatórios." });
    }

    const { data: rawGift, error: fetchErr } = await supabase
      .from("gifts")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr || !rawGift) {
      return res.status(404).json({ error: "Presente não encontrado no catálogo." });
    }

    const gift = dbToGift(rawGift);
    const isHoneymoon = gift.name.toLowerCase().includes("lua de mel") || 
                        gift.name.toLowerCase().includes("cota") || 
                        (gift.category.toLowerCase() === "diversos" && gift.name.toLowerCase().includes("vale"));

    if (gift.status === 'comprado' && !isHoneymoon) {
      return res.status(400).json({ error: "Este presente já foi adquirido por outro convidado." });
    }

    const purchaseAmount = amount ? parseFloat(amount) : gift.price;

    // Se NÃO for cota de lua de mel/flexível, marca o presente como comprado
    if (!isHoneymoon) {
      gift.status = 'comprado';
      gift.buyerName = buyerName;
      gift.buyerEmail = buyerEmail;
      gift.purchasedAt = new Date().toISOString();

      const { error: updateGError } = await supabase
        .from("gifts")
        .update(giftToDb(gift))
        .eq("id", id);
      
      if (updateGError) {
        console.error("Erro ao atualizar status do presente:", updateGError);
        return res.status(500).json({ error: "Falha ao registrar compra do presente." });
      }
    }

    // Criar nova compra histórica no banco
    const newPurchase: Purchase = {
      id: `purchase-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      giftId: gift.id,
      giftName: isHoneymoon ? `${gift.name} - Contribuição Flexível` : gift.name,
      amount: purchaseAmount,
      buyerName,
      buyerEmail,
      paymentMethod,
      paidAt: new Date().toISOString(),
      status: 'aprovado'
    };

    const { error: insertPError } = await supabase
      .from("purchases")
      .insert([purchaseToDb(newPurchase)]);

    if (insertPError) {
      console.error("Erro ao persistir transação no Supabase:", insertPError);
      return res.status(500).json({ error: "Erro ao registrar transação financeira." });
    }

    // Preparar notificações simuladas
    const wedding = await getWeddingInfoDb();
    const formattedPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(purchaseAmount);

    // E-mail para o Convidado
    const buyerSubject = `[Casamento de ${wedding.noivaName} & ${wedding.noivoName}] Obrigado pelo seu presente! 🎁`;
    const buyerBody = `Olá ${buyerName},

Agradecemos imensamente pelo seu gesto de carinho ao nos presentear com:
🎁 ${isHoneymoon ? gift.name + ' (cota)' : gift.name} (${formattedPrice})

Sua contribuição via ${paymentMethod === 'pix' ? 'PIX' : 'Cartão de Crédito'} foi confirmada e convertida em saldo para nossa Lua de Mel e montagem do nosso novo lar.

Sua presença é o nosso maior presente, mas esse carinho extra enche nossos corações de alegria! Mal podemos esperar para celebrar com você em nosso casamento.

Com carinho,
${wedding.noivaName} & ${wedding.noivoName}`;

    await addNotificationDb("purchase_buyer", buyerEmail, buyerSubject, buyerBody);

    // E-mail para os Noivos
    const coupleSubject = `[Novo Presente Recebido!] ${buyerName} enviou: ${gift.name}`;
    const coupleBody = `Olá ${wedding.noivaName} & ${wedding.noivoName},

Vocês receberam um novo presente na lista virtual!
Convidado(a): ${buyerName} (${buyerEmail})
Presente selecionado: ${gift.name}
Valor da contribuição: ${formattedPrice}
Método de Pagamento: ${paymentMethod === 'pix' ? 'PIX' : 'Cartão de Crédito'}

*Lembrando*: Como configurado em sua estratégia de presentes, o valor correspondente a este produto foi arrecadado integralmente em dinheiro na sua carteira virtual para que vocês possam usar como preferirem!

Parabéns! O saldo total arrecadado já foi atualizado no seu painel de noivos.

Abraços,
Sistema de Gestão de Presentes`;

    const targetEmail = wedding.notificationEmail || `${wedding.noivoName.toLowerCase()}&${wedding.noivaName.toLowerCase()}@casamento.com`;
    await addNotificationDb("purchase_couple", targetEmail, coupleSubject, coupleBody);

    res.json({ success: true, gift, purchase: newPurchase });
  } catch (err: any) {
    console.error("Erro ao simular compra de presente:", err);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

// GET Log de Notificações (Admin apenas)
app.get("/api/notifications", async (req, res) => {
  try {
    if (!(await verifyAdminPin(req))) {
      return res.status(401).json({ error: "Acesso não autorizado." });
    }

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("sent_at", { ascending: false });

    if (error) {
      console.error("Erro ao ler notificações no Supabase:", error);
      return res.status(500).json({ error: "Erro ao ler histórico de notificações." });
    }

    res.json({ notifications: (data || []).map(dbToNotification) });
  } catch (err: any) {
    console.error("Erro na rota GET notifications:", err);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

// GET Purchases estatísticas históricas (Admin apenas)
app.get("/api/purchases", async (req, res) => {
  try {
    if (!(await verifyAdminPin(req))) {
      return res.status(401).json({ error: "Acesso não autorizado." });
    }

    const { data, error } = await supabase
      .from("purchases")
      .select("*")
      .order("paid_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar transações no Supabase:", error);
      return res.status(500).json({ error: "Erro ao buscar histórico de contribuições." });
    }

    res.json({ purchases: (data || []).map(dbToPurchase) });
  } catch (err: any) {
    console.error("Erro na rota GET purchases:", err);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

// ==========================================
// VITE / STATIC MIDDLEWARES
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Exportar o app para a Vercel
export default app;

if (!process.env.VERCEL) {
  startServer();
}
