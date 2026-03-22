import { createContext, useContext, useState, useEffect, ReactNode, createElement } from "react";

export const ENTITLEMENT_IDENTIFIER = "premium";

export interface PurchasePackage {
  identifier: string;
  product: {
    identifier: string;
    priceString: string;
    title: string;
    description: string;
  };
}

export interface SubscriptionState {
  isSubscribed: boolean;
  isLoading: boolean;
  packages: PurchasePackage[];
  purchase: (pkg: PurchasePackage) => Promise<void>;
  restore: () => Promise<void>;
  isPurchasing: boolean;
}

const TEST_API_KEY = import.meta.env.VITE_REVENUECAT_TEST_API_KEY as string | undefined;
const IOS_API_KEY = import.meta.env.VITE_REVENUECAT_IOS_API_KEY as string | undefined;
const ANDROID_API_KEY = import.meta.env.VITE_REVENUECAT_ANDROID_API_KEY as string | undefined;

function getApiKey(): string | null {
  if (TEST_API_KEY) return TEST_API_KEY;
  return IOS_API_KEY || ANDROID_API_KEY || null;
}

const SubscriptionContext = createContext<SubscriptionState | null>(null);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [packages, setPackages] = useState<PurchasePackage[]>([]);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    const apiKey = getApiKey();
    if (!apiKey) {
      setIsLoading(false);
      return;
    }

    const initPurchases = async () => {
      try {
        const Purchases = await import("@revenuecat/purchases-capacitor").then((m) => m.Purchases).catch(() => null);
        if (!Purchases) { setIsLoading(false); return; }

        await Purchases.configure({ apiKey });

        const [{ customerInfo }, { offerings }] = await Promise.all([
          Purchases.getCustomerInfo(),
          Purchases.getOfferings(),
        ]);

        const active = customerInfo.entitlements.active[ENTITLEMENT_IDENTIFIER];
        setIsSubscribed(!!active);

        const current = offerings.current;
        if (current) {
          setPackages(current.availablePackages.map((pkg) => ({
            identifier: pkg.identifier,
            product: {
              identifier: pkg.product.identifier,
              priceString: pkg.product.priceString,
              title: pkg.product.title,
              description: pkg.product.description,
            },
          })));
        }
      } catch (err) {
        console.warn("[purchases] init failed (running in web/dev?):", err);
      } finally {
        setIsLoading(false);
      }
    };

    initPurchases();
  }, []);

  const purchase = async (pkg: PurchasePackage) => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("RevenueCat API key not configured");

    setIsPurchasing(true);
    try {
      const Purchases = await import("@revenuecat/purchases-capacitor").then((m) => m.Purchases);
      const { offerings } = await Purchases.getOfferings();
      const current = offerings.current;
      const capacitorPkg = current?.availablePackages.find((p) => p.identifier === pkg.identifier);
      if (!capacitorPkg) throw new Error("Paket bulunamadı");
      const { customerInfo } = await Purchases.purchasePackage({ aPackage: capacitorPkg });
      const active = customerInfo.entitlements.active[ENTITLEMENT_IDENTIFIER];
      setIsSubscribed(!!active);
    } finally {
      setIsPurchasing(false);
    }
  };

  const restore = async () => {
    const apiKey = getApiKey();
    if (!apiKey) return;
    try {
      const Purchases = await import("@revenuecat/purchases-capacitor").then((m) => m.Purchases);
      const { customerInfo } = await Purchases.restorePurchases();
      const active = customerInfo.entitlements.active[ENTITLEMENT_IDENTIFIER];
      setIsSubscribed(!!active);
    } catch (err) {
      console.warn("[purchases] restore failed:", err);
    }
  };

  return createElement(
    SubscriptionContext.Provider,
    { value: { isSubscribed, isLoading, packages, purchase, restore, isPurchasing } },
    children
  );
}

export function useSubscription(): SubscriptionState {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error("useSubscription must be used within SubscriptionProvider");
  return ctx;
}
