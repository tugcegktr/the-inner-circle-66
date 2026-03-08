import { SwipeCard, Match, LikedByUser, ZodiacSign } from "@/types/app";

// === Launch Threshold System ===
export const LAUNCH_THRESHOLD = 50;
export const MOCK_APPROVED_COUNT = 34;

export const MOCK_SWIPE_CARDS: SwipeCard[] = [
  {
    id: "1",
    name: "İsabelle",
    age: 28,
    city: "İstanbul",
    district: "Beşiktaş",
    height: "1.72",
    photos: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80",
    ],
    zodiacSign: "Terazi",
    interests: ["Fine Dining Kaşifliği", "Specialty Coffee", "Bienal & Art Week"],
    isVerified: true,
    vibeTags: ["Saygılı", "Eğlenceli", "Nazik", "Entelektüel"],
    compatibilityScore: 94,
    profession: "Mimar",
    gender: "woman",
    musicTaste: ["Indie", "Jazz", "Lo-fi / Chill"],
    averageRating: 4.7,
    ratingCount: 38,
    lookingFor: ["dating", "friendship"],
    bio: "Mimari çizgiler ve sezgisel estetik üzerine düşünen biri. Benimle iyi bir kahve ve daha iyi bir sohbet için buluşalım.",
  },
  {
    id: "2",
    name: "Margaux",
    age: 26,
    city: "İzmir",
    district: "Alsancak",
    height: "1.65",
    photos: [
      "https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=600&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80",
    ],
    zodiacSign: "Balık",
    interests: ["Opera & Bale", "Mixology & Tadım", "Bağımsız Sinema"],
    isVerified: true,
    vibeTags: ["Yaratıcı", "Düşünceli", "Saygılı"],
    compatibilityScore: 87,
    profession: "Küratör",
    gender: "woman",
    musicTaste: ["Klasik Müzik", "Alternatif", "Soundtrack / Film Müzikleri"],
    averageRating: 4.4,
    ratingCount: 21,
    lookingFor: ["networking", "friendship"],
    bio: "Sanatı tüketmekten çok yaşarım. Ortak projeler ve derin sohbetlere açığım.",
  },
  {
    id: "3",
    name: "Celine",
    age: 30,
    city: "Ankara",
    district: "Çankaya",
    height: "1.75",
    photos: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80",
    ],
    zodiacSign: "Akrep",
    interests: ["Yin Yoga & Derin Esneme", "Glamping", "Padel Tenis"],
    isVerified: false,
    vibeTags: ["Maceracı", "Hırslı", "Eğlenceli"],
    compatibilityScore: 78,
    profession: "Avukat",
    gender: "woman",
    musicTaste: ["Pop", "Türkçe Pop", "R&B"],
    averageRating: 4.1,
    ratingCount: 14,
    lookingFor: ["dating"],
    bio: "Hukuk hayatımın büyük parçası ama hafta sonları doğada kaybolmayı tercih ederim.",
  },
  {
    id: "4",
    name: "Natasha",
    age: 27,
    city: "Muğla",
    district: "Bodrum",
    height: "1.68",
    photos: [
      "https://images.unsplash.com/photo-1502323703975-b9630fe78d8b?w=600&q=80",
    ],
    zodiacSign: "İkizler",
    interests: ["Yatçılık & Mavi Tur", "Omakase Deneyimi", "Koleksiyonerlik"],
    isVerified: true,
    vibeTags: ["Nazik", "Eğlenceli", "Yaratıcı"],
    compatibilityScore: 91,
    profession: "Tasarımcı",
    gender: "woman",
    musicTaste: ["House / Techno", "Elektronik / EDM", "Indie"],
    averageRating: 4.8,
    ratingCount: 56,
    lookingFor: ["dating", "networking"],
    bio: "Tasarım sadece bir iş değil, bir bakış açısı. Vizyon sahibi insanlarla tanışmak istiyorum.",
  },
  {
    id: "5",
    name: "Valentina",
    age: 29,
    city: "Antalya",
    district: "Konyaaltı",
    height: "1.63",
    photos: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80",
    ],
    zodiacSign: "Aslan",
    interests: ["Binicilik", "Sürdürülebilir Yaşam", "Ses Meditasyonu"],
    isVerified: true,
    vibeTags: ["Saygılı", "Yaratıcı", "Hırslı"],
    compatibilityScore: 83,
    profession: "Girişimci",
    gender: "woman",
    musicTaste: ["Latin", "Reggaeton", "Blues"],
    averageRating: 4.5,
    ratingCount: 29,
    lookingFor: ["friendship", "networking"],
    bio: "Sürdürülebilir bir dünya için çalışıyorum. Aynı değerleri paylaşan insanlarla bağlantı kurmak istiyorum.",
  },
];

export const MOCK_MATCHES: Match[] = [
  {
    id: "m1",
    userId: "1",
    name: "İsabelle",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80",
    city: "İstanbul",
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
    city: "Bodrum",
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
    isSuperVibe: true,
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
  Koç: { Koç: 72, Boğa: 55, İkizler: 85, Yengeç: 60, Aslan: 95, Başak: 58, Terazi: 88, Akrep: 76, Yay: 90, Oğlak: 52, Kova: 82, Balık: 70 },
  Terazi: { Koç: 88, Boğa: 78, İkizler: 92, Yengeç: 65, Aslan: 86, Başak: 72, Terazi: 80, Akrep: 62, Yay: 85, Oğlak: 68, Kova: 90, Balık: 75 },
  Aslan: { Koç: 95, Boğa: 60, İkizler: 82, Yengeç: 70, Aslan: 75, Başak: 65, Terazi: 86, Akrep: 68, Yay: 92, Oğlak: 55, Kova: 78, Balık: 72 },
};

// Zodiac signs in Turkish
export const ZODIAC_SIGNS: ZodiacSign[] = [
  "Koç", "Boğa", "İkizler", "Yengeç", "Aslan", "Başak",
  "Terazi", "Akrep", "Yay", "Oğlak", "Kova", "Balık"
];

export const ZODIAC_SYMBOLS: Record<string, string> = {
  Koç: "♈", Boğa: "♉", İkizler: "♊", Yengeç: "♋",
  Aslan: "♌", Başak: "♍", Terazi: "♎", Akrep: "♏",
  Yay: "♐", Oğlak: "♑", Kova: "♒", Balık: "♓"
};

// Categorized interest areas
export const INTEREST_CATEGORIES = [
  {
    category: "Sanat & Kültür",
    items: [
      "Bienal & Art Week Takibi",
      "Koleksiyonerlik",
      "Bağımsız Sinema",
      "Kitap Koleksiyonculuğu",
      "Opera & Bale",
    ],
  },
  {
    category: "Spor & Aktif Yaşam",
    items: [
      "Padel Tenis",
      "Binicilik",
      "Yelkencilik",
      "Reformist Pilates",
      "Golf",
      "Kış Sporları",
      "Savunma Sanatları",
    ],
  },
  {
    category: "Gastronomi & Gurme",
    items: [
      "Fine Dining Kaşifliği",
      "Specialty Coffee",
      "Mixology & Tadım",
      "Omakase Deneyimi",
      "Yöresel Tadım Rotaları",
    ],
  },
  {
    category: "Wellness & Spiritüalite",
    items: [
      "Biohacking",
      "Buz Banyosu & Soğuk Terapi",
      "Astroloji",
      "Ses Meditasyonu",
      "Yin Yoga & Derin Esneme",
    ],
  },
  {
    category: "Seyahat & Yaşam Tarzı",
    items: [
      "Saklı Rotalar",
      "Yatçılık & Mavi Tur",
      "Sürdürülebilir Yaşam",
      "Glamping",
      "Solo Traveling",
    ],
  },
];

export const ALL_INTERESTS = INTEREST_CATEGORIES.flatMap((c) => c.items);

// Legacy exports kept for backward compat
export const MUSIC_OPTIONS = ["Techno", "Caz", "Hip-Hop", "Klasik", "R&B", "Indie", "Elektronik", "Pop", "Rock", "Afrobeats"];
export const HOBBY_OPTIONS = ALL_INTERESTS;
export const PERSONALITY_TAGS = ["İçe Dönük", "Dışa Dönük", "Hırslı", "Yaratıcı", "Spiritüel", "Entelektüel", "Maceracı", "Ev İnsanı", "Gece Kuşu", "Erken Kalkan"];
export const INTERESTS = ALL_INTERESTS;

export const VIBE_TAGS = ["Saygılı", "Eğlenceli", "Centilmen", "Düşünceli", "Hırslı", "Nazik", "Yaratıcı", "Maceracı"];

export const GENDER_OPTIONS = [
  { value: "woman", label: "Kadın" },
  { value: "man", label: "Erkek" },
  { value: "bisexual", label: "Biseksüel" },
  { value: "lesbian", label: "Lezbiyen" },
  { value: "gay", label: "Gay" },
] as const;

export const ADMIN_PENDING_USERS = [
  { id: "p1", name: "Elif Şahin", age: 25, city: "İstanbul", profession: "Doktor", gender: "Kadın", submittedAt: "2 saat önce", verified: true, socialLinked: true, instagram: "@elif.sahin", linkedin: "linkedin.com/in/elifsahin", zodiac: "Terazi", height: "1.65", interests: ["Fine Dining Kaşifliği", "Opera & Bale"], bio: "İstanbul'da çalışan genç bir doktorum." },
  { id: "p2", name: "Zeynep Kaya", age: 29, city: "Ankara", profession: "Mühendis", gender: "Kadın", submittedAt: "5 saat önce", verified: false, socialLinked: true, instagram: "@zeynep.kaya", linkedin: "", zodiac: "Boğa", height: "1.70", interests: ["Padel Tenis", "Biohacking"], bio: "Teknoloji ve sporu bir arada seviyorum." },
  { id: "p3", name: "Mert Demir", age: 31, city: "İzmir", profession: "Avukat", gender: "Erkek", submittedAt: "1 gün önce", verified: true, socialLinked: false, instagram: "@mert.demir", linkedin: "linkedin.com/in/mertdemir", zodiac: "Aslan", height: "1.82", interests: ["Yelkencilik", "Golf"], bio: "İzmir'de avukatım, denizi çok seviyorum." },
  { id: "p4", name: "Ayşe Yıldız", age: 24, city: "Bursa", profession: "Girişimci", gender: "Kadın", submittedAt: "2 gün önce", verified: true, socialLinked: true, instagram: "@ayse.yildiz", linkedin: "linkedin.com/in/ayseyildiz", zodiac: "Kova", height: "1.62", interests: ["Sürdürülebilir Yaşam", "Ses Meditasyonu"], bio: "Kendi işimi kuran, hayata pozitif bakan biriyim." },
];

export const ADMIN_FLAGGED_PROFILES = [
  { id: "f1", name: "Ahmet D.", age: 31, city: "İstanbul", reason: "Uygunsuz mesajlar", reportCount: 3, reportedBy: "İsabelle", reportDate: "1 gün önce", instagram: "@ahmetd", linkedin: "" },
  { id: "f2", name: "Burak W.", age: 28, city: "Ankara", reason: "Sahte profil fotoğrafı", reportCount: 1, reportedBy: "Natasha", reportDate: "3 gün önce", instagram: "@burakw", linkedin: "linkedin.com/in/burakw" },
  { id: "f3", name: "Serkan M.", age: 35, city: "İzmir", reason: "Taciz içerikli mesaj", reportCount: 2, reportedBy: "Margaux", reportDate: "5 gün önce", instagram: "@serkanm", linkedin: "" },
];

// Mock members list for admin
export const ADMIN_ALL_MEMBERS = [
  { id: "u1", name: "Elif Şahin", age: 25, city: "İstanbul", gender: "woman" as const, profession: "Doktor", zodiac: "Terazi", instagram: "@elif.s", linkedin: "linkedin.com/in/elifsahin", status: "approved", joinedAt: "1 gün önce" },
  { id: "u2", name: "Zeynep Kaya", age: 29, city: "Ankara", gender: "woman" as const, profession: "Mühendis", zodiac: "Boğa", instagram: "@zeynep.k", linkedin: "linkedin.com/in/zeynepkaya", status: "approved", joinedAt: "3 gün önce" },
  { id: "u3", name: "Mert Demir", age: 31, city: "İzmir", gender: "man" as const, profession: "Avukat", zodiac: "Aslan", instagram: "@mertd", linkedin: "", status: "approved", joinedAt: "5 gün önce" },
  { id: "u4", name: "Ayşe Yıldız", age: 24, city: "Bursa", gender: "woman" as const, profession: "Girişimci", zodiac: "Kova", instagram: "@ayse.y", linkedin: "linkedin.com/in/ayseyildiz", status: "approved", joinedAt: "1 hafta önce" },
  { id: "u5", name: "Can Öztürk", age: 27, city: "Antalya", gender: "man" as const, profession: "Mimar", zodiac: "Akrep", instagram: "@can.o", linkedin: "", status: "approved", joinedAt: "1 hafta önce" },
  { id: "u6", name: "Selin Arslan", age: 26, city: "İstanbul", gender: "woman" as const, profession: "Tasarımcı", zodiac: "İkizler", instagram: "@selinar", linkedin: "linkedin.com/in/selinar", status: "pending", joinedAt: "2 gün önce" },
  { id: "u7", name: "Defne Çelik", age: 28, city: "İzmir", gender: "woman" as const, profession: "Psikolog", zodiac: "Yay", instagram: "@defne.c", linkedin: "linkedin.com/in/defnecelik", status: "approved", joinedAt: "2 hafta önce" },
  { id: "u8", name: "Emre Koç", age: 33, city: "Ankara", gender: "man" as const, profession: "Finansçı", zodiac: "Oğlak", instagram: "@emrek", linkedin: "linkedin.com/in/emrekoc", status: "approved", joinedAt: "3 hafta önce" },
];
