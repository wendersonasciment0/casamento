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
