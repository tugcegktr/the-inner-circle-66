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
import { AdminScreen } from "@/screens/AdminScreen";

const queryClient = new QueryClient();

const AppRouter = () => {
  const { screen } = useApp();

  if (screen === "login") return <LoginScreen />;
  if (screen === "onboarding-basic" || screen === "onboarding-photos" || screen === "onboarding-lifestyle" || screen === "onboarding-zodiac" || screen === "onboarding-social") return <OnboardingScreen />;
  if (screen === "waitlist") return <WaitlistScreen />;
  if (screen === "discovery") return <DiscoveryScreen />;
  if (screen === "matches") return <MatchesScreen />;
  if (screen === "profile") return <ProfileScreen />;
  if (screen === "edit-profile") return <EditProfileScreen />;
  if (screen === "premium") return <PremiumScreen />;
  if (screen === "admin") return <AdminScreen />;

  return <LoginScreen />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <AppRouter />
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
