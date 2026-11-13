"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "am" | "om";

interface Translations {
  [key: string]: {
    en: string;
    am: string;
    om: string;
  };
}

export const DICTIONARY: Translations = {
  // Navigation
  "nav.allAds": {
    en: "All Ads",
    am: "ሁሉም ማስታወቂያዎች",
    om: "Beeksisa Hunda",
  },
  "nav.swaps": {
    en: "Swap Deals",
    am: "የመለዋወጫ እድሎች",
    om: "Wal-jijjiirraa",
  },
  "nav.directMeet": {
    en: "Direct In-Person Meetup",
    am: "በአካል ተገናኝተው ይገበያዩ",
    om: "Fuulaan Wal-argaa",
  },
  "nav.postAd": {
    en: "+ Post Free Ad",
    am: "+ በነጻ ይለጥፉ",
    om: "+ Bilisaan Maxxansaa",
  },
  "nav.searchPlaceholder": {
    en: "Search phones, laptops, electronics to buy or swap...",
    am: "የሚገዙትን ወይም የሚለውጡትን ስልክ፣ ላፕቶፕ ይፈልጉ...",
    om: "Bilbila, laappoottooppii bittan ykn jijjiirtan barbaadaa...",
  },
  "nav.safeMeet": {
    en: "Safe Meetups at CBE Branches & Public Landmarks",
    am: "በባንክ ቅርንጫፎች እና ዋና ዋና ቦታዎች በአካል ተገናኝተው ይገበያዩ",
    om: "Fuulaan dameewwan baankii fi iddoowwan beekamotti wal-argaa",
  },

  // Hero
  "hero.badge": {
    en: "📍 Nationwide Ethiopia • መላው ኢትዮጵያ",
    am: "📍 የመላው ኢትዮጵያ የገበያ እና መለዋወጫ ማዕከል",
    om: "📍 Gabaa fi Wal-jijjiirraa Itoophiyaa Guutuu",
  },
  "hero.title": {
    en: "Buy, Sell, or Swap Devices Across Ethiopia.",
    am: "በመላው ኢትዮጵያ እቃዎችን በቀላሉ ይግዙ፣ ይሽጡ ወይም ይለውጡ።",
    om: "Itoophiyaa Guututti Meeshaalee Bitaa, Gurguraa ykn Wal-jijjiiraa.",
  },
  "hero.subtitle": {
    en: "Don't lose value waiting for cash. Swap your phone or laptop directly with cash difference, or buy directly from local sellers at public landmarks.",
    am: "ጥሬ ገንዘብ ፍለጋ ሳይቸገሩ ያለዎትን ስልክ ወይም ላፕቶፕ ከዋጋ ልዩነት ጋር ይለውጡ፤ ወይም ከሻጮች በቀጥታ በነጻ ይግዙ።",
    om: "Qarshii callaa eeguun osoo hin rakkatin, bilbila ykn laappoottooppii keessan jijjiiradhaa; ykn gurgurtoota irraa kallattiin bitaa.",
  },

  // Actions
  "btn.viewDetails": {
    en: "View Details",
    am: "ዝርዝር ይመልከቱ",
    om: "Bal'inaan Ilaala",
  },
  "btn.swapDeal": {
    en: "Swap Deal",
    am: "መለዋወጥ እፈልጋለሁ",
    om: "Wal-jijjiirraa",
  },
  "btn.buyNow": {
    en: "Buy Now",
    am: "አሁን ይግዙ",
    om: "Amma Bitaa",
  },
  "badge.swapAccepted": {
    en: "Swap Accepted",
    am: "መለዋወጥ ይቻላል",
    om: "Wal-jijjiirraan ni danda'ama",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    if (DICTIONARY[key] && DICTIONARY[key][language]) {
      return DICTIONARY[key][language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
