import { createContext, useContext, useState, ReactNode } from "react";
import { AppScreen, UserProfile, FlaggedReport } from "@/types/app";

interface AppContextType {
  screen: AppScreen;
  setScreen: (s: AppScreen) => void;
  currentUser: UserProfile;
  setCurrentUser: (u: UserProfile) => void;
  flaggedReports: FlaggedReport[];
  addFlaggedReport: (r: FlaggedReport) => void;
  registeredPhone: string;
  setRegisteredPhone: (p: string) => void;
  registeredUserId: number | null;
  setRegisteredUserId: (id: number | null) => void;
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

const STORAGE_KEY = "theclub_session";

const loadSession = () => {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) : null;
  } catch { return null; }
};

const saveSession = (data: object) => {
  try {
    const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...data }));
  } catch { }
};

const clearSession = () => {
  try { localStorage.removeItem(STORAGE_KEY); } catch { }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const stored = loadSession();

  const [screen, setScreenState] = useState<AppScreen>(stored?.screen ?? "login");
  const [currentUser, setCurrentUserState] = useState<UserProfile>(stored?.currentUser ?? defaultUser);
  const [flaggedReports, setFlaggedReports] = useState<FlaggedReport[]>([]);
  const [registeredPhone, setRegisteredPhoneState] = useState<string>(stored?.registeredPhone ?? "");
  const [registeredUserId, setRegisteredUserIdState] = useState<number | null>(stored?.registeredUserId ?? null);

  const setScreen = (s: AppScreen) => {
    setScreenState(s);
    if (s === "login") {
      clearSession();
    } else {
      saveSession({ screen: s });
    }
  };

  const setCurrentUser = (u: UserProfile) => {
    setCurrentUserState(u);
    saveSession({ currentUser: u });
  };

  const setRegisteredPhone = (p: string) => {
    setRegisteredPhoneState(p);
    saveSession({ registeredPhone: p });
  };

  const setRegisteredUserId = (id: number | null) => {
    setRegisteredUserIdState(id);
    saveSession({ registeredUserId: id });
  };

  const addFlaggedReport = (r: FlaggedReport) => {
    setFlaggedReports((prev) => [r, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      screen, setScreen,
      currentUser, setCurrentUser,
      flaggedReports, addFlaggedReport,
      registeredPhone, setRegisteredPhone,
      registeredUserId, setRegisteredUserId,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
