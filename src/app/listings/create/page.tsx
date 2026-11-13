"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/data/mockData";
import { useMarketplace } from "@/context/MarketplaceContext";
import { ProductListing } from "@/types/marketplace";
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
} from "lucide-react";

export default function CreateListingPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addListing, currentUser } = useMarketplace();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("phones");
  const [subcategory, setSubcategory] = useState("");
  const [price, setPrice] = useState("");
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [condition, setCondition] = useState("Like New");
  const [city, setCity] = useState("Adama");
  const [kebele, setKebele] = useState("Bole");
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
        // Fallback
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

  const handleAddSamplePhotos = (preset: "phone" | "laptop" | "mitad") => {
    const presets = {
      phone: [
        "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80",
      ],
      laptop: [
        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80",
      ],
      mitad: [
        "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80",
      ],
    };
    setImages(presets[preset]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newListingObj: ProductListing = {
      id: `lst-${Date.now()}`,
      title,
      price: Number(price) || 0,
      isNegotiable,
      condition: (condition as any) || "Like New",
      categorySlug: category,
      subcategory: subcategory || selectedCategoryObj?.subcategories[0] || "General",
      city: city || "Adama",
      kebele: kebele || "Bole",
      landmark: landmark || `${kebele} Center`,
      description: description || "Inspected device in great condition, ready for direct pickup or barter in Adama.",
      allowBarter,
      wishlist: wishlist || (allowBarter ? "Open to trade proposals" : ""),
      allowCash: true,
      images: images.length > 0 ? images : [
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
      ],
      seller: {
        id: currentUser.id,
        name: currentUser.name,
        phone: currentUser.phone,
        whatsapp: currentUser.phone,
        city: currentUser.city || "Adama",
        kebele: currentUser.kebele || kebele,
        isVerified: true,
        memberSince: "Nov 2026",
        rating: currentUser.rating || 5.0,
        completedDeals: (currentUser.completedTrades || 0) + 1,
        avatar: currentUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      },
      postedDate: "Just now",
      views: 1,
      isFeatured: false,
    };

    // Add directly to live state
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
      router.push("/listings");
    }, 1800);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      <div className="flex items-center justify-between">
        <Link href="/listings" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 font-bold">
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </Link>
        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
          Post Free Ad Across Ethiopia
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Post a Free Ad</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Sell for cash or enable circular barter to swap your device with buyers nationwide
          </p>
        </div>

        {isSuccess ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center shadow-xs">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Your Ad Has Been Published!</h2>
            <p className="text-xs text-slate-600 max-w-sm mx-auto font-medium">
              Your item is now live across Ethiopia. Matching barter algorithms are scanning for potential circular trades.
            </p>
            <p className="text-xs text-blue-600 font-bold animate-pulse">
              Redirecting to marketplace...
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block">Subcategory</label>
                <select
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                >
                  <option value="">Select subcategory...</option>
                  {selectedCategoryObj?.subcategories.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Condition & Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block">Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                >
                  <option value="Brand New">Brand New</option>
                  <option value="Like New">Like New (Mint)</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block">
                  Price / Estimated Value (ETB) <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    placeholder="e.g. 55000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full pl-3.5 pr-14 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                    ETB
                  </span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer pt-1 text-xs text-slate-600 font-medium">
                  <input
                    type="checkbox"
                    checked={isNegotiable}
                    onChange={(e) => setIsNegotiable(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-600"
                  />
                  <span>Price is negotiable</span>
                </label>
              </div>
            </div>

            {/* Location in Ethiopia */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 block">City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
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

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 block">Sub-City / Area</label>
                <input
                  type="text"
                  placeholder="e.g. Bole, Piassa, Arada, Piazza"
                  value={kebele}
                  onChange={(e) => setKebele(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 block">Meeting Landmark</label>
                <input
                  type="text"
                  placeholder="e.g. Near CBE Branch or Mall"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* INTERACTIVE PHOTO UPLOADER WITH INSTANT PREVIEWS */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 block">
                  Product Photos ({images.length}/5)
                </label>
                {/* Sample Presets for Fast Testing */}
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <span>Load Sample:</span>
                  <button
                    type="button"
                    onClick={() => handleAddSamplePhotos("phone")}
                    className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-200"
                  >
                    Phone
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddSamplePhotos("laptop")}
                    className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-200"
                  >
                    Laptop
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddSamplePhotos("mitad")}
                    className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-200"
                  >
                    Mitad
                  </button>
                </div>
              </div>

              {/* Upload Dropzone */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors space-y-2 group ${
                  isUploading
                    ? "border-blue-600 bg-blue-50/50 cursor-wait"
                    : "border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-slate-100/70 cursor-pointer"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-slate-200 group-hover:bg-blue-100 text-slate-600 group-hover:text-blue-600 mx-auto flex items-center justify-center transition-colors">
                  {isUploading ? (
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-5 h-5" />
                  )}
                </div>
                <div className="text-xs font-bold text-slate-800">
                  {isUploading ? "Uploading photos to server..." : "Click to select photos from your device or drag & drop"}
                </div>
                <div className="text-[11px] text-slate-500">
                  Supports PNG, JPG, or WEBP up to 5MB each. First photo will be your cover image.
                </div>
              </div>

              {/* Image Previews Grid */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-[4/3] group shadow-2xs"
                    >
                      <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />

                      {/* Cover Photo Badge */}
                      {idx === 0 ? (
                        <span className="absolute top-1.5 left-1.5 bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow-xs">
                          Cover Photo
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleMakeCover(idx)}
                          className="absolute top-1.5 left-1.5 bg-slate-900/80 hover:bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Make Cover
                        </button>
                      )}

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-rose-600/90 text-white hover:bg-rose-700 opacity-90 transition-opacity"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">Description</label>
              <textarea
                rows={4}
                placeholder="Describe your item in detail (battery health, specs, included accessories, reason for selling)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Barter & Trade-in Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                    <Repeat className="w-4 h-4 text-amber-600" /> Enable Circular Barter / Swap
                  </span>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    Allow other users to propose their devices in trade, with cash top-up for value differences
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowBarter}
                    onChange={(e) => setAllowBarter(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                    <Info className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    Our graph algorithm uses this wishlist to automatically discover 3-way circular trade loops!
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button in Blue */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Publishing Ad Nationwide..." : "Publish My Ad for Free"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
