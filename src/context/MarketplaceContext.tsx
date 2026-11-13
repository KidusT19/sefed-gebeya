"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ProductListing, PooledRun } from "@/types/marketplace";
import { MOCK_LISTINGS, MOCK_POOLED_RUNS } from "@/data/mockData";
import { TRANSLATIONS, Language } from "@/data/translations";

export type { Language };

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
  phone: string;
  role: "BUYER" | "MERCHANT" | "DRIVER" | "ADMIN";
  city: string;
  kebele?: string;
  landmark?: string;
  avatarUrl?: string;
  rating?: number;
  completedTrades?: number;
  walletBalance: number;
}

export const PRESET_USERS: ActiveUser[] = [
  {
    id: "sel-1",
    name: "Henok Tadesse",
    phone: "+251911448822",
    role: "MERCHANT",
    city: "Addis Ababa",
    kebele: "Bole",
    landmark: "Near Edna Mall & Medhanialem",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    rating: 4.9,
    completedTrades: 19,
    walletBalance: 14250,
  },
  {
    id: "sel-2",
    name: "Dawit Bekele (Tech Hub)",
    phone: "+251922771133",
    role: "MERCHANT",
    city: "Addis Ababa",
    kebele: "Piassa",
    landmark: "Mexico Square / Piassa Tech Center",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    rating: 4.8,
    completedTrades: 27,
    walletBalance: 28500,
  },
  {
    id: "sel-3",
    name: "Chaltu Girma",
    phone: "+251933880011",
    role: "BUYER",
    city: "Hawassa",
    kebele: "Piazza",
    landmark: "Piazza Commercial Area",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
    rating: 5.0,
    completedTrades: 12,
    walletBalance: 8400,
  },
  {
    id: "sel-4",
    name: "Yonas Worku (Studio)",
    phone: "+251911223344",
    role: "BUYER",
    city: "Bahir Dar",
    kebele: "Kebele 04",
    landmark: "Felege Hiwot Commercial Gate",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    rating: 4.9,
    completedTrades: 15,
    walletBalance: 19800,
  },
  {
    id: "adm-1",
    name: "Sebez Operations Admin",
    phone: "+251900000000",
    role: "ADMIN",
    city: "Addis Ababa",
    kebele: "Bole",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80",
    rating: 5.0,
    completedTrades: 500,
    walletBalance: 64200,
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
  login: (user: ActiveUser) => void;
  logout: () => void;
  switchUserById: (userId: string) => void;
  favorites: string[];
  toggleFavorite: (listingId: string) => void;
  isFavorite: (listingId: string) => boolean;
  listings: ProductListing[];
  addListing: (listing: ProductListing) => void;
  offers: CustomOffer[];
  addOffer: (listingId: string, offeredPrice: number, message: string) => void;
  deliveries: ActiveDelivery[];
  addDelivery: (delivery: Omit<ActiveDelivery, "id" | "trackingCode" | "merchantReleaseOtp" | "customerDeliveryOtp" | "status">) => ActiveDelivery;
  selectedKebele: string;
  setSelectedKebele: (kebele: string) => void;
  toast: ToastNotification | null;
  showToast: (message: string, type?: "success" | "info" | "error") => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export function MarketplaceProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [favorites, setFavorites] = useState<string[]>(["lst-1", "lst-3"]);
  const [selectedKebele, setSelectedKebele] = useState<string>("All Ethiopia");
  const [currentUser, setCurrentUser] = useState<ActiveUser>(PRESET_USERS[0]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [listings, setListings] = useState<ProductListing[]>(MOCK_LISTINGS);
  const [toast, setToast] = useState<ToastNotification | null>(null);

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
    setListings((prev) => [newListing, ...prev]);
    showToast(`✓ Listing "${newListing.title.slice(0, 24)}..." published to marketplace feed!`, "success");
  };

  const login = (user: ActiveUser) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    try {
      localStorage.setItem("sebez_current_user", JSON.stringify(user));
      localStorage.setItem("sebez_is_logged_in", "true");
    } catch {}
    showToast(`✓ Welcome back, ${user.name}!`, "success");
  };

  const logout = () => {
    setIsLoggedIn(false);
    try {
      localStorage.removeItem("sebez_is_logged_in");
    } catch {}
    showToast("You have been signed out.", "info");
  };

  const [offers, setOffers] = useState<CustomOffer[]>([
    {
      id: "off-1",
      listingId: "lst-2",
      listingTitle: "Dell XPS 13 (Core i7 11th Gen, 16GB RAM)",
      listingPrice: 68000,
      offeredPrice: 63000,
      sellerName: "Arada Tech Store (Dawit B.)",
      sellerPhone: "+251922771133",
      message: "I can pay 63,000 ETB cash today via Telebirr. Can we meet at Arada?",
      status: "PENDING",
      date: "Today, 11:20 AM",
    },
  ]);

  const [deliveries, setDeliveries] = useState<ActiveDelivery[]>([
    {
      id: "del-101",
      trackingCode: "ADM-RUN-101-449",
      listingTitle: "iPhone 13 Pro 128GB - Sierra Blue",
      itemPrice: 55000,
      deliveryFee: 40,
      originMarket: "Arada Central Market",
      destinationKebele: "Bole Kebele",
      driverName: "Abebe Demissie",
      driverPlate: "3-B042-OR (Bajaj RE)",
      driverPhone: "+251911223344",
      merchantReleaseOtp: "4829",
      customerDeliveryOtp: "9153",
      status: "IN_TRANSIT",
      departureTime: "2:30 PM Today",
    },
  ]);

  // Load favorites and user from localStorage if present
  useEffect(() => {
    try {
      const stored = localStorage.getItem("sebez_favorites");
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
      const storedUser = localStorage.getItem("sebez_current_user");
      const storedAuth = localStorage.getItem("sebez_is_logged_in");
      if (storedUser && storedAuth === "true") {
        setCurrentUser(JSON.parse(storedUser));
        setIsLoggedIn(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const switchUserById = (userId: string) => {
    const found = PRESET_USERS.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
      try {
        localStorage.setItem("sebez_current_user", JSON.stringify(found));
      } catch {
        // ignore
      }
    }
  };

  const handleSetCurrentUser = (user: ActiveUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem("sebez_current_user", JSON.stringify(user));
    } catch {
      // ignore
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem("sebez_favorites", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const isFavorite = (id: string) => favorites.includes(id);

  const addOffer = (listingId: string, offeredPrice: number, message: string) => {
    const listing = MOCK_LISTINGS.find((l) => l.id === listingId);
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
        login,
        logout,
        switchUserById,
        favorites,
        toggleFavorite,
        isFavorite,
        listings,
        addListing,
        offers,
        addOffer,
        deliveries,
        addDelivery,
        selectedKebele,
        setSelectedKebele,
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
                ? "bg-blue-600 text-white border-blue-400"
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
