export interface Category {
  id: string;
  name: string;
  nameAm: string;
  nameOr: string;
  slug: string;
  icon: string;
  subcategories: string[];
}

export interface Seller {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  city: string;
  kebele: string;
  isVerified: boolean;
  memberSince: string;
  rating: number;
  completedDeals: number;
  avatar: string;
}

export interface ProductListing {
  id: string;
  title: string;
  price: number; // in ETB
  isNegotiable: boolean;
  condition: "Brand New" | "Like New" | "Excellent" | "Good" | "Fair";
  categorySlug: string;
  subcategory: string;
  description: string;
  images: string[];
  city: string;
  kebele: string;
  landmark: string;
  allowBarter: boolean;
  wishlist: string; // Target items accepted for trade
  allowCash: boolean;
  seller: Seller;
  postedDate: string;
  views: number;
  isFeatured?: boolean;
}

export interface PooledRun {
  id: string;
  title: string;
  originMarket: string;
  destinationKebele: string;
  departureTime: string;
  driverName: string;
  driverPhone: string;
  driverPlate: string;
  driverRating: number;
  maxCapacity: number;
  currentBooked: number;
  farePerDrop: number; // in ETB (e.g. 40 ETB)
  standardCharterFare: number; // 150 ETB
  savingsPercentage: number; // 73%
  status: "Open" | "Filling Fast" | "Departed" | "Completed";
}

export interface CircularTradeCycle {
  id: string;
  estimatedDate: string;
  totalMarketValue: number;
  status: "Matched" | "Pending Approvals" | "Locked" | "Completed";
  nodes: {
    userId: string;
    userName: string;
    userKebele: string;
    offeringItem: {
      id: string;
      title: string;
      value: number;
      image: string;
    };
    receivingItem: {
      id: string;
      title: string;
      value: number;
      fromUserName: string;
    };
    cashTopUpAdjustment: number; // positive = receives cash, negative = pays cash
    hasApproved: boolean;
  }[];
}
