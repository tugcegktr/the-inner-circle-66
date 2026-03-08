import React, { createContext, useContext, useState, ReactNode } from "react";
import { AppScreen, UserProfile, ZodiacSign } from "@/types/app";

interface AppContextType {
  screen: AppScreen;
  setScreen: (s: AppScreen) => void;
  currentUser: UserProfile;
  setCurrentUser: (u: UserProfile) => void;
  isAdmin: boolean;
  setIsAdmin: (v: boolean) => void;
}

const defaultUser: UserProfile = {
  id: "me",
  name: "Alexandra",
  age: 27,
  city: "İstanbul",
  height: "1.68",
  gender: "woman",
  interestedIn: ["man"],
  profession: "Sanat Direktörü",
  bio: "Gündüzleri sanat direktörü, geceleri caz tutkunuyum. Benimle aynı hızda koşabilecek birini arıyorum.",
  photos: [
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80",
    "https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=600&q=80",
  ],
  zodiacSign: "Terazi",
  risingSign: "Koç",
  interests: ["Fine Dining Kaşifliği", "Opera & Bale", "Koleksiyonerlik"],
  musicTaste: ["Caz", "Indie"],
  hobbyPreferences: ["Opera & Bale", "Specialty Coffee", "Bienal & Art Week Takibi"],
  personalityTags: ["Yaratıcı", "Entelektüel", "Gece Kuşu"],
  instagramHandle: "@alex.creates",
  isVerified: true,
  isPremium: false,
  isApproved: true,
  vibeTags: [],
  subscriptionStatus: "none",
  dailySwipesLeft: 15,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [screen, setScreen] = useState<AppScreen>("login");
  const [currentUser, setCurrentUser] = useState<UserProfile>(defaultUser);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <AppContext.Provider value={{ screen, setScreen, currentUser, setCurrentUser, isAdmin, setIsAdmin }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
