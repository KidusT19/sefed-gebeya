"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ProductListing, PooledRun, VerificationStatus, SellerTier, SellerVerificationDoc } from "@/types/marketplace";
import { MOCK_LISTINGS, MOCK_POOLED_RUNS } from "@/data/mockData";
import { TRANSLATIONS, Language } from "@/data/translations";

export type { Language };

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  sellerName?: string;
  category?: string;
}

export interface CustomOffer {
  id: string;
  listingId: string;
  listingTitle: string;
  listingPrice: number;
  offeredPrice: number;
  sellerName: string;
  sellerPhone: string;
  message: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  date: string;
}

export interface ActiveDelivery {
  id: string;
  trackingCode: string;
  listingTitle: string;
  itemPrice: number;
  deliveryFee: number;
  originMarket: string;
  destinationKebele: string;
  driverName: string;
  driverPlate: string;
  driverPhone: string;
  merchantReleaseOtp: string;
  customerDeliveryOtp: string;
  status: "DISPATCHED" | "PICKED_UP" | "IN_TRANSIT" | "DELIVERED";
  departureTime: string;
}

export interface ActiveUser {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: "BUYER" | "MERCHANT" | "DRIVER" | "ADMIN";
  city: string;
  kebele?: string;
  landmark?: string;
  avatarUrl?: string;
  rating?: number;
  completedTrades?: number;
  walletBalance: number;
  verificationStatus?: VerificationStatus;
  sellerTier?: SellerTier;
  businessName?: string;
  memberSince?: string;
  bio?: string;
  kebeleIdNumber?: string;
  tradeLicenseNumber?: string;
  tinNumber?: string;
  verificationDoc?: SellerVerificationDoc;
}

export const PRESET_USERS: ActiveUser[] = [
  {
    id: "sel-1",
    name: "Henok Tadesse",
    phone: "+251911448822",
    email: "henok.tadesse@sefed.et",
    role: "MERCHANT",
    city: "Addis Ababa",
    kebele: "Bole",
    landmark: "Near Edna Mall & Medhanialem",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    rating: 5.0,
    completedTrades: 0,
    walletBalance: 0,
    verificationStatus: "VERIFIED",
    sellerTier: "Verified Seller",
    businessName: "Henok Electronics Bole",
    memberSince: "Nov 2024",
    bio: "Certified electronics dealer & device specialist based in Bole Medhanialem.",
    kebeleIdNumber: "ADD-BOL-882194",
  },
  {
    id: "sel-2",
    name: "Dawit Bekele (Tech Hub)",
    phone: "+251922771133",
    email: "dawit.bekele@arada.et",
    role: "MERCHANT",
    city: "Addis Ababa",
    kebele: "Piassa",
    landmark: "Mexico Square / Piassa Tech Center",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    rating: 5.0,
    completedTrades: 0,
    walletBalance: 0,
    verificationStatus: "OFFICIAL_STORE",
    sellerTier: "Official Merchant",
    businessName: "Arada Tech Store",
    memberSince: "Jan 2024",
    bio: "Official importer of high-end Apple, Dell and HP computers with warranty.",
    tradeLicenseNumber: "TL-AA-094821",
    tinNumber: "0094821944",
  },
  {
    id: "sel-3",
    name: "Chaltu Girma",
    phone: "+251933880011",
    email: "chaltu.g@gmail.com",
    role: "BUYER",
    city: "Hawassa",
    kebele: "Piazza",
    landmark: "Piazza Commercial Area",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
    rating: 5.0,
    completedTrades: 0,
    walletBalance: 0,
    verificationStatus: "UNVERIFIED",
    sellerTier: "Individual Trader",
    memberSince: "March 2025",
    bio: "Student and gadget trader in Hawassa. Verified phone user.",
  },
  {
    id: "sel-4",
    name: "Yonas Worku (Studio)",
    phone: "+251911223344",
    email: "yonas.worku@studio.et",
    role: "BUYER",
    city: "Bahir Dar",
    kebele: "Kebele 04",
    landmark: "Felege Hiwot Commercial Gate",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    rating: 5.0,
    completedTrades: 0,
    walletBalance: 0,
    verificationStatus: "PENDING",
    sellerTier: "Individual Trader",
    businessName: "Yonas Studio Bahir Dar",
    memberSince: "April 2025",
    bio: "Pro sound engineer trading musical gear and cameras in Bahir Dar.",
  },
  {
    id: "adm-1",
    name: "Sefed Operations Admin",
    phone: "+251900000000",
    email: "admin@sefed.et",
    role: "ADMIN",
    city: "Addis Ababa",
    kebele: "Bole",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80",
    rating: 5.0,
    completedTrades: 0,
    walletBalance: 0,
    verificationStatus: "OFFICIAL_STORE",
    sellerTier: "Official Merchant",
    businessName: "Sefed Market Headquarters",
    memberSince: "Jan 2024",
  },
];

export interface ToastNotification {
  id: string;
  message: string;
  type: "success" | "info" | "error";
}

interface MarketplaceContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  currentUser: ActiveUser;
  setCurrentUser: (user: ActiveUser) => void;
  isLoggedIn: boolean;
  isAuthReady: boolean;
  login: (user: ActiveUser) => void;
  logout: () => void;
  switchUserById: (userId: string) => void;
  favorites: string[];
  toggleFavorite: (listingId: string) => void;
  isFavorite: (listingId: string) => boolean;
  listings: ProductListing[];
  addListing: (listing: ProductListing) => void;
  deleteListing: (listingId: string) => void;
  toggleListingStatus: (listingId: string) => void;
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  offers: CustomOffer[];
  addOffer: (listingId: string, offeredPrice: number, message: string) => void;
  deliveries: ActiveDelivery[];
  addDelivery: (delivery: Omit<ActiveDelivery, "id" | "trackingCode" | "merchantReleaseOtp" | "customerDeliveryOtp" | "status">) => ActiveDelivery;
  selectedKebele: string;
  setSelectedKebele: (kebele: string) => void;
  updateUserProfile: (updates: Partial<ActiveUser>) => void;
  submitSellerVerification: (doc: Omit<SellerVerificationDoc, "submittedAt" | "status">) => void;
  toast: ToastNotification | null;
  showToast: (message: string, type?: "success" | "info" | "error") => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export function MarketplaceProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedKebele, setSelectedKebele] = useState<string>("All Ethiopia");
  const [currentUser, setCurrentUser] = useState<ActiveUser>(PRESET_USERS[0]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const [listings, setListings] = useState<ProductListing[]>([]);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  // Persistent shopping cart state
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load listings from API or initial state
  useEffect(() => {
    fetch("/api/listings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.listings && data.listings.length > 0) {
          setListings(data.listings);
        }
      })
      .catch(() => {});
  }, []);

  const showToast = (message: string, type: "success" | "info" | "error" = "success") => {
    const id = `toast-${Date.now()}`;
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 3500);
  };

  const addListing = (newListing: ProductListing) => {
    const listingWithStatus: ProductListing = {
      ...newListing,
      status: newListing.status || "ACTIVE",
    };
    setListings((prev) => [listingWithStatus, ...prev]);
    try {
      const stored = JSON.parse(localStorage.getItem("sefed_user_created_listings") || "[]");
      if (!stored.includes(listingWithStatus.id)) {
        localStorage.setItem("sefed_user_created_listings", JSON.stringify([listingWithStatus.id, ...stored]));
      }
    } catch {}
    showToast(`✓ Listing "${newListing.title.slice(0, 24)}..." published to marketplace feed!`, "success");
  };

  const deleteListing = (listingId: string) => {
    setListings((prev) => prev.filter((l) => l.id !== listingId));
    try {
      const stored = JSON.parse(localStorage.getItem("sefed_user_created_listings") || "[]");
      localStorage.setItem(
        "sefed_user_created_listings",
        JSON.stringify(stored.filter((id: string) => id !== listingId))
      );
    } catch {}
    showToast("Listing removed successfully.", "info");
  };

  const toggleListingStatus = (listingId: string) => {
    setListings((prev) =>
      prev.map((l) =>
        l.id === listingId
          ? { ...l, status: l.status === "SOLD" ? "ACTIVE" : "SOLD" }
          : l
      )
    );
    showToast("Listing status updated.", "success");
  };

  // Cart operations
  const addToCart = (item: Omit<CartItem, "quantity">, qty: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      let updated: CartItem[];
      if (existing) {
        updated = prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + qty } : i
        );
      } else {
        updated = [...prev, { ...item, quantity: qty }];
      }
      try {
        localStorage.setItem("sefed_cart", JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showToast(`✓ Added "${item.title.slice(0, 20)}..." to your cart!`, "success");
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const updated = prev.filter((i) => i.id !== itemId);
      try {
        localStorage.setItem("sefed_cart", JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showToast("Item removed from cart", "info");
  };

  const updateCartQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) => {
      const updated = prev.map((i) => (i.id === itemId ? { ...i, quantity: qty } : i));
      try {
        localStorage.setItem("sefed_cart", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem("sefed_cart");
    } catch {}
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const login = (user: ActiveUser) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    try {
      localStorage.setItem("sefed_current_user", JSON.stringify(user));
      localStorage.setItem("sefed_is_logged_in", "true");
    } catch {}
    showToast(`✓ Welcome back, ${user.name}!`, "success");
  };

  const logout = () => {
    setIsLoggedIn(false);
    try {
      localStorage.removeItem("sefed_is_logged_in");
    } catch {}
    showToast("You have been signed out.", "info");
  };

  const [offers, setOffers] = useState<CustomOffer[]>([]);

  const [deliveries, setDeliveries] = useState<ActiveDelivery[]>([]);

  // Load favorites, user, and cart from localStorage
  useEffect(() => {
    try {
      const storedFavs = localStorage.getItem("sefed_favorites") || localStorage.getItem("sebez_favorites");
      if (storedFavs) {
        setFavorites(JSON.parse(storedFavs));
      }
      const storedUser = localStorage.getItem("sefed_current_user") || localStorage.getItem("sebez_current_user");
      const storedAuth = localStorage.getItem("sefed_is_logged_in") || localStorage.getItem("sebez_is_logged_in");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          // Purge legacy demo balances (e.g. 14250, 28500, 5000)
          if (parsed.walletBalance === 14250 || parsed.walletBalance === 28500 || parsed.walletBalance === 5000 || typeof parsed.walletBalance !== "number") {
            parsed.walletBalance = 0;
            localStorage.setItem("sefed_current_user", JSON.stringify(parsed));
          }
          setCurrentUser(parsed);
          if (storedAuth === "true") {
            setIsLoggedIn(true);
          }
        } catch {
          // ignore parsing error
        }
      }
      const storedCart = localStorage.getItem("sefed_cart");
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch {
      // ignore
    } finally {
      setIsAuthReady(true);
    }
  }, []);

  const switchUserById = (userId: string) => {
    const found = PRESET_USERS.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
      try {
        localStorage.setItem("sefed_current_user", JSON.stringify(found));
      } catch {
        // ignore
      }
    }
  };

  const handleSetCurrentUser = (user: ActiveUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem("sefed_current_user", JSON.stringify(user));
    } catch {
      // ignore
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem("sefed_favorites", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const isFavorite = (id: string) => favorites.includes(id);

  const addOffer = (listingId: string, offeredPrice: number, message: string) => {
    const listing = listings.find((l) => l.id === listingId);
    const newOffer: CustomOffer = {
      id: `off-${Date.now()}`,
      listingId,
      listingTitle: listing?.title || "Product Listing",
      listingPrice: listing?.price || offeredPrice,
      offeredPrice,
      sellerName: listing?.seller.name || "Seller",
      sellerPhone: listing?.seller.phone || "+251911000000",
      message,
      status: "PENDING",
      date: "Just now",
    };
    setOffers((prev) => [newOffer, ...prev]);
  };

  const addDelivery = (d: Omit<ActiveDelivery, "id" | "trackingCode" | "merchantReleaseOtp" | "customerDeliveryOtp" | "status">) => {
    const genOtp = () => Math.floor(1000 + Math.random() * 9000).toString();
    const newDel: ActiveDelivery = {
      ...d,
      id: `del-${Date.now()}`,
      trackingCode: `ADM-RUN-${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`,
      merchantReleaseOtp: genOtp(),
      customerDeliveryOtp: genOtp(),
      status: "DISPATCHED",
    };
    setDeliveries((prev) => [newDel, ...prev]);
    return newDel;
  };

  const updateUserProfile = (updates: Partial<ActiveUser>) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem("sefed_current_user", JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showToast("Profile details updated successfully!", "success");
  };

  const submitSellerVerification = (doc: Omit<SellerVerificationDoc, "submittedAt" | "status">) => {
    const isBusiness = doc.docType === "TRADE_LICENSE" || doc.docType === "TIN_CERTIFICATE";
    const verificationDoc: SellerVerificationDoc = {
      ...doc,
      submittedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "VERIFIED",
    };

    setCurrentUser((prev) => {
      const updated: ActiveUser = {
        ...prev,
        verificationStatus: "VERIFIED",
        sellerTier: isBusiness ? "Official Merchant" : "Verified Seller",
        businessName: doc.businessName || prev.businessName,
        kebeleIdNumber: doc.docType === "KEBELE_ID" ? doc.docNumber : prev.kebeleIdNumber,
        tradeLicenseNumber: doc.docType === "TRADE_LICENSE" ? doc.docNumber : prev.tradeLicenseNumber,
        tinNumber: doc.tinNumber || prev.tinNumber,
        verificationDoc,
      };
      try {
        localStorage.setItem("sefed_current_user", JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showToast("✓ Identity verified! You are now a Verified Seller on Sefed Market.", "success");
  };

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <MarketplaceContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentUser,
        setCurrentUser: handleSetCurrentUser,
        isLoggedIn,
        isAuthReady,
        login,
        logout,
        switchUserById,
        favorites,
        toggleFavorite,
        isFavorite,
        listings,
        addListing,
        deleteListing,
        toggleListingStatus,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartCount,
        offers,
        addOffer,
        deliveries,
        addDelivery,
        selectedKebele,
        setSelectedKebele,
        updateUserProfile,
        submitSellerVerification,
        toast,
        showToast,
      }}
    >
      {children}

      {/* Floating Animated Toast Container */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-none">
          <div
            className={`pointer-events-auto px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-3 max-w-sm text-xs font-bold ${
              toast.type === "success"
                ? "bg-[#0e623a] text-white border-[#15803d]"
                : toast.type === "error"
                ? "bg-rose-700 text-white border-rose-500"
                : "bg-slate-900 text-white border-slate-700"
            }`}
          >
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error("useMarketplace must be used within a MarketplaceProvider");
  }
  return context;
}
