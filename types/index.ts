export type Language = 'en' | 'es';

export type CognitoGroup = 'Admin' | 'DataRoom';

export type InquiryType =
  | 'enterprise_training'
  | 'investor'
  | 'government'
  | 'strategic_partner'
  | 'media'
  | 'other';

export type ArchetypeId =
  | 'conductor'
  | 'choreographer'
  | 'composer'
  | 'sculptor'
  | 'painter'
  | 'director';

export interface Archetype {
  id: ArchetypeId;
  artForm: string;
  domain: string;
  caption: string;
  keyThemes: string[];
  imageSrc: string;
}

export interface DataRoomDocument {
  id: string;
  title: string;
  description?: string;
  version?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InvestorContact {
  id: string;
  fullName: string;
  organisation?: string;
  email: string;
  inquiryType: InquiryType;
  message: string;
  preferredLanguage?: Language;
  ipHash?: string;
  createdAt: string;
}
