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

export type UserGender = "woman" | "man" | "non-binary";
export type ZodiacSign =
  | "Aries" | "Taurus" | "Gemini" | "Cancer" | "Leo" | "Virgo"
  | "Libra" | "Scorpio" | "Sagittarius" | "Capricorn" | "Aquarius" | "Pisces";

export type VibeTag = "Respectful" | "Funny" | "Gentleman" | "Thoughtful" | "Ambitious" | "Kind" | "Creative" | "Adventurous";

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  city: string;
  height: string;
  gender: UserGender;
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
  averageRating?: number;   // public star rating (avg of received ratings)
  ratingCount?: number;
}

export interface SwipeCard {
  id: string;
  name: string;
  age: number;
  city: string;
  height: string;
  photos: string[];
  zodiacSign: ZodiacSign;
  interests: string[];
  isVerified: boolean;
  vibeTags: VibeTag[];
  compatibilityScore?: number;
  averageRating?: number;
  ratingCount?: number;
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
  myRating?: number;        // rating I gave them (1–5)
  theirRating?: number;     // rating they gave me (1–5)
  averageRating?: number;   // their public avg rating
  ratingCount?: number;
}

export interface LikedByUser {
  id: string;
  name: string;
  photo: string;
  isVerified: boolean;
}
