export interface CardData {
  id: string;
  coupleName: string;
  groom: string;
  bride: string;
  akadDate: string;
  akadTime: string;
  resepsiDate: string;
  resepsiTime: string;
  venue: string;
  venueAddress: string;
  greetingMessage: string;
  template: 'minimalist' | 'batik' | 'songket' | 'floral';
  accentColor: 'indigo' | 'amber' | 'rose' | 'teal';
  shareToken: string;
  createdBy: string;
}

export interface RSVPFormData {
  name: string;
  email: string;
  attending: 'yes' | 'no' | 'maybe';
  dietary: string;
  hasPlus1: boolean;
  plus1Name: string;
}

export interface RSVPFormErrors {
  name?: string;
  email?: string;
  attending?: string;
  plus1Name?: string;
}

export interface WishFormData {
  name: string;
  email: string;
  message: string;
}

export interface WishFormErrors {
  name?: string;
  email?: string;
  message?: string;
}
