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
  city: "New York",
  height: "5'6\"",
  gender: "woman",
  bio: "Art director by day, jazz lover by night. Looking for someone who can keep up.",
  photos: [
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80",
    "https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=600&q=80",
  ],
  zodiacSign: "Libra",
  risingSign: "Aries",
  interests: ["Jazz", "Art Galleries", "Coffee"],
  musicTaste: ["Jazz", "Indie"],
  hobbyPreferences: ["Art Galleries", "Coffee Dates", "Concerts"],
  personalityTags: ["Creative", "Intellectual", "Night Owl"],
  instagramHandle: "@alex.creates",
  isVerified: true,
  isPremium: false,
  isApproved: true,
  vibeTags: [],
  subscriptionStatus: "none",
  dailySwipesLeft: 5,
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
