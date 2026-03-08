// App state types for The Club dating app
export type AppScreen =
  | "login"
  | "phone-verify"
  | "onboarding-basic"
  | "onboarding-photos"
  | "onboarding-lifestyle"
  | "onboarding-zodiac"
  | "onboarding-social"
  | "waitlist"
  | "pre-launch"
  | "discovery"
  | "matches"
  | "profile"
  | "edit-profile"
  | "premium"
  | "admin";

export type UserGender = "woman" | "man" | "bisexual" | "lesbian" | "gay";
export type ZodiacSign =
  | "Koç" | "Boğa" | "İkizler" | "Yengeç" | "Aslan" | "Başak"
  | "Terazi" | "Akrep" | "Yay" | "Oğlak" | "Kova" | "Balık";

export type VibeTag = "Saygılı" | "Eğlenceli" | "Centilmen" | "Düşünceli" | "Hırslı" | "Nazik" | "Yaratıcı" | "Maceracı" | "Entelektüel";

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  city: string;
  height: string;
  gender: UserGender;
  interestedIn: UserGender[];
  profession?: string;
  bio: string;
  photos: string[];
  zodiacSign: ZodiacSign;
  risingSign?: ZodiacSign;
  interests: string[];
  musicTaste: string[];
  hobbyPreferences: string[];
  personalityTags: string[];
  instagramHandle?: string;
  linkedinUrl?: string;
  isVerified: boolean;
  isPremium: boolean;
  isApproved: boolean;
  vibeTags: VibeTag[];
  subscriptionStatus: "none" | "monthly" | "yearly";
  dailySwipesLeft: number;
  averageRating?: number;
  ratingCount?: number;
}

export interface SwipeCard {
  id: string;
  name: string;
  age: number;
  city: string;
  district?: string;
  height: string;
  photos: string[];
  zodiacSign: ZodiacSign;
  interests: string[];
  isVerified: boolean;
  vibeTags: VibeTag[];
  compatibilityScore?: number;
  averageRating?: number;
  ratingCount?: number;
  profession?: string;
  gender: UserGender;
  instagramHandle?: string;
  linkedinUrl?: string;
  musicTaste?: string[];
}

export interface FlaggedReport {
  id: string;
  reportedName: string;
  reportedBy: string;
  reason: string;
  timestamp: string;
}

export interface Match {
  id: string;
  userId: string;
  name: string;
  photo: string;
  city: string;
  isVerified: boolean;
  matchedAt: Date;
  hasVibeCheck?: boolean;
  myRating?: number;
  theirRating?: number;
  averageRating?: number;
  ratingCount?: number;
}

export interface LikedByUser {
  id: string;
  name: string;
  photo: string;
  isVerified: boolean;
}
