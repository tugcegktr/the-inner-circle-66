import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider, useApp } from "@/context/AppContext";
import { LoginScreen } from "@/screens/LoginScreen";
import { OnboardingScreen } from "@/screens/OnboardingScreen";
import { WaitlistScreen } from "@/screens/WaitlistScreen";
import { DiscoveryScreen } from "@/screens/DiscoveryScreen";
import { MatchesScreen } from "@/screens/MatchesScreen";
import { ProfileScreen } from "@/screens/ProfileScreen";
import { EditProfileScreen } from "@/screens/EditProfileScreen";
import { PremiumScreen } from "@/screens/PremiumScreen";
import { PreLaunchScreen } from "@/screens/PreLaunchScreen";
import { AdminLogin } from "@/pages/admin/AdminLogin";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { ProtectedRoute } from "@/pages/admin/ProtectedRoute";

const queryClient = new QueryClient();

const ONBOARDING_SCREENS = ["onboarding-basic", "onboarding-photos", "onboarding-lifestyle", "onboarding-zodiac", "onboarding-social"];

const MobileRouter = () => {
  const { screen } = useApp();
  if (screen === "login") return <LoginScreen />;
  if (ONBOARDING_SCREENS.includes(screen)) return <OnboardingScreen />;
  if (screen === "waitlist") return <WaitlistScreen />;
  if (screen === "pre-launch") return <PreLaunchScreen />;
  if (screen === "discovery") return <DiscoveryScreen />;
  if (screen === "matches") return <MatchesScreen />;
  if (screen === "profile") return <ProfileScreen />;
  if (screen === "edit-profile") return <EditProfileScreen />;
  if (screen === "premium") return <PremiumScreen />;
  return <LoginScreen />;
};

const MobileApp = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <MobileRouter />
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

const App = () => (
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Routes>
      <Route path="/admin" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard/*"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/*" element={<MobileApp />} />
    </Routes>
  </BrowserRouter>
);

export default App;
