import { Category, ProductListing, PooledRun, CircularTradeCycle } from "@/types/marketplace";

export const CATEGORIES: Category[] = [
  {
    id: "cat-1",
    name: "Mobile Phones & Tablets",
    nameAm: "ሞባይል ስልኮች እና ታብሌቶች",
    nameOr: "Bilbila Moobaayilaa fi Taabileetii",
    slug: "phones",
    icon: "Smartphone",
    subcategories: ["iPhones", "Samsung", "Tecno & Infinix", "Xiaomi", "iPads & Tablets", "Accessories"],
  },
  {
    id: "cat-2",
    name: "Laptops & Computers",
    nameAm: "ላፕቶፖች እና ኮምፒውተሮች",
    nameOr: "Laappoottooppii fi Kompiitara",
    slug: "laptops",
    icon: "Laptop",
    subcategories: ["MacBooks", "Dell", "HP & Lenovo", "Gaming Laptops", "Monitors & Printers"],
  },
  {
    id: "cat-3",
    name: "Vehicles & Cars",
    nameAm: "ተሽከርካሪዎች እና መኪና",
    nameOr: "Konkolaataa fi Otomobiilii",
    slug: "vehicles",
    icon: "Car",
    subcategories: ["Toyota & Suzuki Cars", "Motorcycles & Scooters", "Trucks & Pickups", "Spare Parts & Tires"],
  },
  {
    id: "cat-4",
    name: "Electronics & Video",
    nameAm: "ኤሌክትሮኒክስ እና ቴሌቪዥን",
    nameOr: "Meeshaalee Elektirooniksii",
    slug: "electronics",
    icon: "Tv",
    subcategories: ["Smart TVs", "Sound Systems", "Cameras & Lenses", "Gaming Consoles"],
  },
  {
    id: "cat-5",
    name: "Home, Furniture & Mitad",
    nameAm: "የቤት እቃዎች እና ምጣድ",
    nameOr: "Meeshaalee Manaa fi Miixaada",
    slug: "home",
    icon: "Home",
    subcategories: ["Electric Mitad", "Living Room Sofas", "Beds & Mattresses", "Refrigerators"],
  },
  {
    id: "cat-6",
    name: "Fashion & Watches",
    nameAm: "ፋሽን እና ሰዓቶች",
    nameOr: "Uffata fi Sa'aatii",
    slug: "fashion",
    icon: "Watch",
    subcategories: ["Smartwatches", "Men's Shoes", "Women's Fashion", "Jackets & Bags"],
  },
  {
    id: "cat-7",
    name: "Real Estate & Rentals",
    nameAm: "ሪል እስቴት እና ኪራይ",
    nameOr: "Mana fi Lafa",
    slug: "real-estate",
    icon: "Building",
    subcategories: ["Houses for Rent", "Commercial Shops & Offices", "Residential Plots", "Apartments"],
  },
];

export const ETHIOPIAN_CITIES = [
  "All Ethiopia",
  "Addis Ababa",
  "Adama",
  "Hawassa",
  "Bahir Dar",
  "Dire Dawa",
  "Mekelle",
  "Gondar",
  "Jimma",
  "Bishoftu",
  "Dessie",
] as const;

export const MOCK_LISTINGS: ProductListing[] = [];

export interface BarterInventoryItem {
  id: string;
  title: string;
  estimatedValue: number;
  condition: string;
  category: string;
  image: string;
  specs?: string;
}

export const DEFAULT_USER_BARTER_INVENTORY: BarterInventoryItem[] = [
  {
    id: "inv-1",
    title: "Samsung Galaxy S21 5G 128GB (Phantom Black)",
    estimatedValue: 36000,
    condition: "Good",
    category: "Mobile Phones",
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&auto=format&fit=crop&q=80",
    specs: "8GB RAM · 128GB Storage · Dual SIM · 120Hz AMOLED",
  },
  {
    id: "inv-2",
    title: "Lenovo ThinkPad T14 Gen 2 (Core i7, 16GB RAM)",
    estimatedValue: 45000,
    condition: "Like New",
    category: "Laptops & Computers",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&auto=format&fit=crop&q=80",
    specs: "Intel Core i7 11th Gen · 16GB DDR4 · 512GB NVMe SSD",
  },
  {
    id: "inv-3",
    title: "Apple AirPods Pro (2nd Gen, Active Noise Canceling)",
    estimatedValue: 8500,
    condition: "Like New",
    category: "Audio & Accessories",
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&auto=format&fit=crop&q=80",
    specs: "MagSafe Charging Case · ANC & Transparency · Original Box",
  },
  {
    id: "inv-4",
    title: "Brand New Nike Air Max 270 Sneakers (Size 42)",
    estimatedValue: 6500,
    condition: "Brand New",
    category: "Fashion & Footwear",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80",
    specs: "Authentic Original · Size 42 (EU) / 8.5 (US) · In Box",
  },
];

export const MOCK_POOLED_RUNS: PooledRun[] = [];

export const MOCK_CIRCULAR_CYCLES: CircularTradeCycle[] = [
  {
    id: "cycle-301",
    estimatedDate: "Detected Today",
    totalMarketValue: 185000,
    status: "Matched",
    nodes: [
      {
        userId: "u-1",
        userName: "Henok T. (Bole)",
        userKebele: "Bole Kebele",
        offeringItem: {
          id: "lst-1",
          title: "iPhone 13 Pro 128GB",
          value: 55000,
          image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=200&auto=format&fit=crop&q=80",
        },
        receivingItem: {
          id: "lst-4",
          title: "Sony Alpha A6400 Camera",
          value: 62000,
          fromUserName: "Yonas S. (Posta Bet)",
        },
        cashTopUpAdjustment: -7000, // Pays 7,000 ETB cash top-up
        hasApproved: true,
      },
      {
        userId: "u-2",
        userName: "Yonas S. (Posta Bet)",
        userKebele: "Posta Bet",
        offeringItem: {
          id: "lst-4",
          title: "Sony Alpha A6400 Camera",
          value: 62000,
          image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&auto=format&fit=crop&q=80",
        },
        receivingItem: {
          id: "lst-2",
          title: "Dell XPS 13 (Core i7)",
          value: 68000,
          fromUserName: "Dawit B. (Arada)",
        },
        cashTopUpAdjustment: -6000, // Pays 6,000 ETB cash top-up
        hasApproved: true,
      },
      {
        userId: "u-3",
        userName: "Dawit B. (Arada)",
        userKebele: "Arada Kebele",
        offeringItem: {
          id: "lst-2",
          title: "Dell XPS 13 (Core i7)",
          value: 68000,
          image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=200&auto=format&fit=crop&q=80",
        },
        receivingItem: {
          id: "lst-1",
          title: "iPhone 13 Pro 128GB",
          value: 55000,
          fromUserName: "Henok T. (Bole)",
        },
        cashTopUpAdjustment: 13000, // Receives 13,000 ETB cash top-up
        hasApproved: false,
      },
    ],
  },
];
