import { SwipeCard, Match, LikedByUser } from "@/types/app";

// === Launch Threshold System ===
// The app only becomes visible to approved members when this number is reached.
export const LAUNCH_THRESHOLD = 50;
// Mock: current approved member count (admin can see real number; users see progress)
export const MOCK_APPROVED_COUNT = 34;

export const MOCK_SWIPE_CARDS: SwipeCard[] = [
  {
    id: "1",
    name: "Isabelle",
    age: 28,
    city: "New York",
    height: "5'7\"",
    photos: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80",
    ],
    zodiacSign: "Libra",
    interests: ["Techno", "Coffee", "Art Galleries"],
    isVerified: true,
    vibeTags: ["Respectful", "Funny"],
    compatibilityScore: 94,
  },
  {
    id: "2",
    name: "Margaux",
    age: 26,
    city: "Paris",
    height: "5'5\"",
    photos: [
      "https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=600&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80",
    ],
    zodiacSign: "Pisces",
    interests: ["Jazz", "Wine Tasting", "Film"],
    isVerified: true,
    vibeTags: ["Creative", "Thoughtful"],
    compatibilityScore: 87,
  },
  {
    id: "3",
    name: "Celine",
    age: 30,
    city: "London",
    height: "5'9\"",
    photos: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80",
    ],
    zodiacSign: "Scorpio",
    interests: ["Concerts", "Yoga", "Travel"],
    isVerified: false,
    vibeTags: ["Adventurous", "Ambitious"],
    compatibilityScore: 78,
  },
  {
    id: "4",
    name: "Natasha",
    age: 27,
    city: "Milan",
    height: "5'6\"",
    photos: [
      "https://images.unsplash.com/photo-1502323703975-b9630fe78d8b?w=600&q=80",
    ],
    zodiacSign: "Gemini",
    interests: ["Fashion", "DJ Sets", "Photography"],
    isVerified: true,
    vibeTags: ["Kind", "Funny"],
    compatibilityScore: 91,
  },
  {
    id: "5",
    name: "Valentina",
    age: 29,
    city: "Barcelona",
    height: "5'4\"",
    photos: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80",
    ],
    zodiacSign: "Leo",
    interests: ["Rooftop Bars", "Cooking", "Salsa"],
    isVerified: true,
    vibeTags: ["Respectful", "Creative"],
    compatibilityScore: 83,
  },
];

export const MOCK_MATCHES: Match[] = [
  {
    id: "m1",
    userId: "1",
    name: "Isabelle",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80",
    city: "New York",
    isVerified: true,
    matchedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    hasVibeCheck: true,
    averageRating: 4.7,
    ratingCount: 12,
  },
  {
    id: "m2",
    userId: "4",
    name: "Natasha",
    photo: "https://images.unsplash.com/photo-1502323703975-b9630fe78d8b?w=300&q=80",
    city: "Milan",
    isVerified: true,
    matchedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    hasVibeCheck: false,
    averageRating: 4.2,
    ratingCount: 8,
  },
];

export const MOCK_LIKED_BY: LikedByUser[] = [
  {
    id: "l1",
    name: "Sophie",
    photo: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=300&q=80",
    isVerified: true,
  },
  {
    id: "l2",
    name: "Aurora",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80",
    isVerified: false,
  },
  {
    id: "l3",
    name: "Leila",
    photo: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=300&q=80",
    isVerified: true,
  },
];

export const ZODIAC_COMPATIBILITY: Record<string, Record<string, number>> = {
  Aries: { Aries: 72, Taurus: 55, Gemini: 85, Cancer: 60, Leo: 95, Virgo: 58, Libra: 88, Scorpio: 76, Sagittarius: 90, Capricorn: 52, Aquarius: 82, Pisces: 70 },
  Libra: { Aries: 88, Taurus: 78, Gemini: 92, Cancer: 65, Leo: 86, Virgo: 72, Libra: 80, Scorpio: 62, Sagittarius: 85, Capricorn: 68, Aquarius: 90, Pisces: 75 },
  Leo: { Aries: 95, Taurus: 60, Gemini: 82, Cancer: 70, Leo: 75, Virgo: 65, Libra: 86, Scorpio: 68, Sagittarius: 92, Capricorn: 55, Aquarius: 78, Pisces: 72 },
};

export const MUSIC_OPTIONS = ["Techno", "Jazz", "Hip-Hop", "Classical", "R&B", "Indie", "Electronic", "Pop", "Rock", "Afrobeats"];
export const HOBBY_OPTIONS = ["Coffee Dates", "Parties", "Concerts", "Hiking", "Art Galleries", "Wine Tasting", "Yoga", "Cooking", "Travel", "Sports"];
export const PERSONALITY_TAGS = ["Introvert", "Extrovert", "Ambitious", "Creative", "Spiritual", "Intellectual", "Adventurous", "Homebody", "Night Owl", "Early Bird"];
export const INTERESTS = [...MUSIC_OPTIONS, ...HOBBY_OPTIONS];

export const VIBE_TAGS = ["Respectful", "Funny", "Gentleman", "Thoughtful", "Ambitious", "Kind", "Creative", "Adventurous"];

export const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

export const ZODIAC_SYMBOLS: Record<string, string> = {
  Aries: "♈", Taurus: "♉", Gemini: "♊", Cancer: "♋",
  Leo: "♌", Virgo: "♍", Libra: "♎", Scorpio: "♏",
  Sagittarius: "♐", Capricorn: "♑", Aquarius: "♒", Pisces: "♓"
};

export const ADMIN_PENDING_USERS = [
  { id: "p1", name: "Emma Laurent", age: 25, city: "Paris", submittedAt: "2 hours ago", verified: true, socialLinked: true },
  { id: "p2", name: "Aisha Okonkwo", age: 29, city: "Lagos", submittedAt: "5 hours ago", verified: false, socialLinked: true },
  { id: "p3", name: "Sofia Reyes", age: 27, city: "Madrid", submittedAt: "1 day ago", verified: true, socialLinked: false },
  { id: "p4", name: "Zara Chen", age: 24, city: "Singapore", submittedAt: "2 days ago", verified: true, socialLinked: true },
];

export const ADMIN_FLAGGED_PROFILES = [
  { id: "f1", name: "Marcus D.", age: 31, city: "NYC", reason: "Inappropriate messages", reportCount: 3 },
  { id: "f2", name: "Tyler W.", age: 28, city: "LA", reason: "Fake profile photo", reportCount: 1 },
];
