"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/data/mockData";
import { useMarketplace } from "@/context/MarketplaceContext";
import { ProductListing } from "@/types/marketplace";
import SefedWatermarkBackground from "@/components/landing/SefedWatermarkBackground";
import {
  Upload,
  Repeat,
  CheckCircle,
  ArrowLeft,
  Info,
  MapPin,
  Trash2,
  Star,
  Image as ImageIcon,
  Sparkles,
  Lock,
  ArrowRight,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";

export default function CreateListingPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addListing, currentUser, isLoggedIn, showToast } = useMarketplace();

  // Authentication Guard: Redirect to login if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      showToast("Please sign in or register to publish free ads on Sefed Market.", "info");
      router.replace("/auth/login?redirect=/listings/create");
    }
  }, [isLoggedIn, router, showToast]);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("smartphones");
  const [subcategory, setSubcategory] = useState("");
  const [price, setPrice] = useState("");
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [condition, setCondition] = useState<"Brand New" | "Like New" | "Excellent" | "Good" | "Fair">("Like New");
  const [city, setCity] = useState(currentUser?.city || "Addis Ababa");
  const [kebele, setKebele] = useState(currentUser?.kebele || "Bole");
  const [landmark, setLandmark] = useState("");
  const [description, setDescription] = useState("");
  const [allowBarter, setAllowBarter] = useState(true);
  const [wishlist, setWishlist] = useState("");
  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800&auto=format&fit=crop&q=80",
  ]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const selectedCategoryObj = CATEGORIES.find((c) => c.slug === category);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.urls && data.urls.length > 0) {
        setImages((prev) => [...prev, ...data.urls]);
      } else {
        // Local FileReader fallback
        Array.from(files).forEach((file) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              setImages((prev) => [...prev, event.target!.result as string]);
            }
          };
          reader.readAsDataURL(file);
        });
      }
    } catch {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setImages((prev) => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMakeCover = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const target = prev[index];
      const rest = prev.filter((_, i) => i !== index);
      return [target, ...rest];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      router.push("/auth/login?redirect=/listings/create");
      return;
    }

    setIsSubmitting(true);

    const newListingObj: ProductListing = {
      id: `lst-${Date.now()}`,
      title,
      price: Number(price) || 0,
      isNegotiable,
      condition,
      categorySlug: category,
      subcategory: subcategory || selectedCategoryObj?.subcategories[0] || "General",
      city: city || "Addis Ababa",
      kebele: kebele || "Bole",
      landmark: landmark || `${kebele} Center`,
      description: description || "Inspected item in great condition, ready for direct cash purchase or barter across Ethiopia.",
      allowBarter,
      wishlist: wishlist || (allowBarter ? "Open to device trade proposals" : ""),
      allowCash: true,
      images: images.length > 0 ? images : [
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
      ],
      seller: {
        id: currentUser.id,
        name: currentUser.name,
        phone: currentUser.phone,
        whatsapp: currentUser.phone,
        city: currentUser.city || city,
        kebele: currentUser.kebele || kebele,
        isVerified: false,
        verificationStatus: currentUser.verificationStatus || "UNVERIFIED",
        sellerTier: currentUser.sellerTier,
        memberSince: currentUser.memberSince || "Nov 2026",
        rating: currentUser.rating || 5.0,
        completedDeals: currentUser.completedTrades || 0,
        avatar: currentUser.avatarUrl || "",
      },
      postedDate: "Just now",
      views: 1,
      isFeatured: false,
    };

    // Add to marketplace context
    addListing(newListingObj);

    try {
      await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          price,
          isNegotiable,
          condition,
          category,
          subcategory: newListingObj.subcategory,
          city,
          kebele,
          landmark,
          description,
          allowBarter,
          wishlist,
          images,
          sellerName: currentUser.name,
          sellerPhone: currentUser.phone,
        }),
      });
    } catch {
      // offline fallback
    }

    setIsSubmitting(false);
    setIsSuccess(true);
    setTimeout(() => {
      router.push("/dashboard?tab=ads");
    }, 2000);
  };

  // If user is not authenticated, render secure gatekeeper view
  if (!isLoggedIn) {
    return (
      <div className="relative min-h-[75vh] flex items-center justify-center px-4 py-12">
        <SefedWatermarkBackground opacity={0.15} blur="md" />
        <div className="relative z-10 max-w-md w-full bg-white/95 backdrop-blur-sm rounded-3xl border border-emerald-900/10 p-8 text-center space-y-5 shadow-xl shadow-emerald-950/5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-[#0e623a] mx-auto flex items-center justify-center shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          {/* Reassurance Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
            <span>👁️ Public Browsing is 100% Free</span>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Sign In to Post Free Ads
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto font-medium">
              You are free to watch and browse all listings on Sefed Market! An account is only required when publishing your own ads or contacting sellers to protect our community against fraud.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 text-left space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-[#0e623a]" />
              <span>Registered Seller Benefits:</span>
            </div>
            <ul className="text-[11px] space-y-1 list-disc pl-5 text-slate-600">
              <li>Direct buyer inquiries and phone contact</li>
              <li>Safe public landmark meetups across Ethiopia</li>
              <li>Automated multi-item barter &amp; trade matching</li>
            </ul>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href="/auth/login?redirect=/listings/create"
              className="w-full min-h-[46px] py-3.5 rounded-full bg-[#0f172a] hover:bg-slate-800 active:scale-[0.99] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <span>Sign In to Continue</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5] text-amber-400" />
            </Link>

            <Link
              href="/auth/signup?redirect=/listings/create"
              className="w-full min-h-[44px] py-3 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center transition-colors"
            >
              Create Free Sefed Account
            </Link>

            <Link
              href="/listings"
              className="w-full py-2 text-center text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
            >
              ← Keep Watching &amp; Browsing All Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-24 px-4 sm:px-6 max-w-3xl mx-auto space-y-6">
      <SefedWatermarkBackground opacity={0.12} blur="md" />

      {/* Top Breadcrumb & Badge */}
      <div className="relative z-10 flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => {
            if (typeof window !== "undefined" && window.history.length > 1) {
              router.back();
            } else {
              router.push("/");
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs text-slate-700 hover:text-[#0f172a] font-bold bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
          title="Back to previous page"
        >
          <ArrowLeft className="w-4 h-4 text-slate-800" />
          <span>Back</span>
        </button>
        <span className="text-[11px] font-black text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
          Post Free Ad Nationwide
        </span>
      </div>

      {/* Main Form Card */}
      <div className="relative z-10 bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Post a Free Product or Device
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Publish your item for cash sale or enable device swaps across Addis Ababa and all Ethiopian cities
          </p>
        </div>

        {isSuccess ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#0f172a] mx-auto flex items-center justify-center shadow-xs">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-black text-slate-900">Your Product Has Been Published!</h2>
            <p className="text-xs text-slate-600 max-w-sm mx-auto font-medium">
              Your item is now live across Ethiopia on Sefed Market and visible in your My Product Posts list.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/dashboard?tab=ads"
                className="px-5 py-2.5 rounded-full bg-[#0f172a] hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Go to My Product Posts
              </Link>
              <Link
                href="/"
                className="px-5 py-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all cursor-pointer"
              >
                View Marketplace Feed
              </Link>
            </div>
            <p className="text-[11px] text-slate-400 font-medium pt-1 animate-pulse">
              Redirecting to My Product Posts...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">
                Item Title <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. iPhone 13 Pro 128GB (Sierra Blue) or Dell XPS 13"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0e623a]"
              />
            </div>

            {/* Category & Subcategory */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block">Category</label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setSubcategory("");
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0e623a] cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block">Subcategory</label>
                <select
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0e623a] cursor-pointer"
                >
                  <option value="">Select Subcategory...</option>
                  {selectedCategoryObj?.subcategories?.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price & Condition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block">
                  Price in Ethiopian Birr (ETB) <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 45000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full pl-3.5 pr-14 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0e623a]"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    ETB
                  </span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer mt-1">
                  <input
                    type="checkbox"
                    checked={isNegotiable}
                    onChange={(e) => setIsNegotiable(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-[#0e623a] border-slate-300 focus:ring-[#0e623a]"
                  />
                  <span className="text-[11px] font-medium text-slate-600">Price is negotiable</span>
                </label>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block">Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0e623a] cursor-pointer"
                >
                  <option value="Brand New">Brand New (Sealed in box)</option>
                  <option value="Like New">Like New (Flawless condition)</option>
                  <option value="Excellent">Excellent (Minor cosmetic signs)</option>
                  <option value="Good">Good (Fully functional)</option>
                  <option value="Fair">Fair (Noticeable wear)</option>
                </select>
              </div>
            </div>

            {/* City & Kebele Location */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block">City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0e623a] cursor-pointer"
                >
                  <option value="Addis Ababa">Addis Ababa (አዲስ አበባ)</option>
                  <option value="Adama">Adama (አዳማ)</option>
                  <option value="Hawassa">Hawassa (ሀዋሳ)</option>
                  <option value="Bahir Dar">Bahir Dar (ባህር ዳር)</option>
                  <option value="Dire Dawa">Dire Dawa (ድሬዳዋ)</option>
                  <option value="Mekelle">Mekelle (መቐለ)</option>
                  <option value="Jimma">Jimma (ጅማ)</option>
                  <option value="Gondar">Gondar (ጎንደር)</option>
                  <option value="Bishoftu">Bishoftu (ቢሾፍቱ)</option>
                  <option value="Dessie">Dessie (ደሴ)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block">Kebele / Sub-City</label>
                <input
                  type="text"
                  placeholder="e.g. Bole"
                  value={kebele}
                  onChange={(e) => setKebele(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0e623a]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block">Landmark (Meetup)</label>
                <input
                  type="text"
                  placeholder="e.g. Near Edna Mall"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0e623a]"
                />
              </div>
            </div>

            {/* Photos Upload Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">Product Photos</label>
                <span className="text-[10px] text-slate-400 font-medium">Add up to 5 clear photos</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 group bg-slate-100"
                  >
                    <img src={imgUrl} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-[#0e623a] text-white text-[9px] font-black uppercase shadow-xs">
                        Cover
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {idx !== 0 && (
                      <button
                        type="button"
                        onClick={() => handleMakeCover(idx)}
                        className="absolute bottom-1.5 left-1.5 right-1.5 py-1 rounded bg-slate-900/80 text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Set as Cover
                      </button>
                    )}
                  </div>
                ))}

                {images.length < 5 && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-[#0e623a] rounded-2xl aspect-square flex flex-col items-center justify-center p-3 text-center cursor-pointer bg-slate-50 transition-colors"
                  >
                    <Upload className="w-5 h-5 text-slate-400 mb-1" />
                    <span className="text-[11px] font-bold text-slate-700">Add Photo</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">Description</label>
              <textarea
                rows={4}
                placeholder="Describe your item in detail (battery health, specs, included accessories, reason for selling)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0e623a]"
              />
            </div>

            {/* Barter & Trade-in Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                    <Repeat className="w-4 h-4 text-amber-600" /> Enable Circular Barter / Device Swap
                  </span>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    Allow other verified users to propose their devices in trade, with cash top-up for value differences
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowBarter}
                    onChange={(e) => setAllowBarter(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0e623a]"></div>
                </label>
              </div>

              {allowBarter && (
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <label className="text-xs font-bold text-slate-800 block">
                    What items are you willing to accept in exchange? (Wishlist)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Looking for iPhone 13 Pro or Samsung S22 (+/- cash difference)"
                    value={wishlist}
                    onChange={(e) => setWishlist(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0e623a]"
                  />
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                    <Info className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>Our barter engine matches your wishlist to discover direct &amp; 3-way circular trade deals!</span>
                  </p>
                </div>
              )}
            </div>

            {/* Seller Contact Info Preview */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500" />
                <span className="text-slate-700 font-medium">
                  Posting as: <strong className="text-slate-900 font-bold">{currentUser.name}</strong> ({currentUser.phone}) &bull; {city} ({landmark.trim() || "Local Hub"})
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-700 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full shadow-2xs">
                Direct Contact
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-[48px] py-3.5 rounded-full bg-[#0f172a] hover:bg-slate-800 active:scale-[0.99] text-white font-black text-sm transition-all shadow-md disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Publishing Product Nationwide..." : "Publish Free Product on Sefed Market"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
