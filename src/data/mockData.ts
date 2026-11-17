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

export const DEFAULT_USER_BARTER_INVENTORY: BarterInventoryItem[] = [];

export const MOCK_POOLED_RUNS: PooledRun[] = [];

export const MOCK_CIRCULAR_CYCLES: CircularTradeCycle[] = [];
