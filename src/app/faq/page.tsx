"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  ChevronDown,
  Repeat,
  ShieldCheck,
  ShoppingBag,
  Plus,
  MapPin,
  Search,
  MessageSquare,
} from "lucide-react";

interface FAQItem {
  id: string;
  category: "buying" | "selling" | "barter" | "escrow";
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: "f-1",
    category: "buying",
    question: "How do I directly buy an item from a seller in Adama?",
    answer:
      "Browse our classifieds by searching for your desired product or filtering by Adama kebele (Bole, Arada, Kebele 04, Posta Bet). When you find an item you like, you can call the seller directly, start an in-app chat to bargain, or click 'Buy Now with Escrow' to freeze your payment safely before meeting in person.",
  },
  {
    id: "f-2",
    category: "selling",
    question: "How do I post an item for sale?",
    answer:
      "Click the prominent '+ SELL' or 'Post Free Ad' button. Upload photos of your phone, laptop, or goods, set your cash price in ETB, select your kebele in Adama, and indicate whether you are open to barter trades. Your ad goes live immediately to buyers across Adama.",
  },
  {
    id: "f-3",
    category: "barter",
    question: "How does the 1-to-1 direct barter swap with cash top-up work?",
    answer:
      "If you want to trade your phone or laptop for another device but their market values differ, you don't need to sell first. Our automated calculator subtracts your item's value from the other item's price. The resulting cash difference can be paid in cash at your meetup or deposited into escrow. Once both parties inspect and approve the devices, the exchange is complete.",
  },
  {
    id: "f-4",
    category: "barter",
    question: "What is a 3-way circular trade loop?",
    answer:
      "Often Person A wants what Person B has, but Person B doesn't want Person A's item. Our algorithm scans all user wishlists across Adama to find a 3rd person (Person C) that closes the loop (A -> B -> C -> A). All three traders meet at an agreed spot to exchange devices simultaneously without anyone needing 100% cash.",
  },
  {
    id: "f-5",
    category: "escrow",
    question: "How does Telebirr and CBE Birr escrow protect my money?",
    answer:
      "When you buy an item or add a cash top-up, your funds are not sent directly to the seller's personal account. Instead, the money is safely frozen in platform escrow. The seller cannot touch the funds until you physically meet in person, inspect the item, and authorize the 4-digit release OTP.",
  },
  {
    id: "f-6",
    category: "buying",
    question: "Where should I meet the seller for a safe handover in Adama?",
    answer:
      "Always arrange meetups during daytime at busy, well-lit public spots: outside the Commercial Bank of Ethiopia Main Branch in Posta Bet, near the Adama Stadium Gate, or in the Arada Electronics Market center. Never meet in isolated or unfamiliar areas.",
  },
  {
    id: "f-7",
    category: "escrow",
    question: "What happens if an item is defective or counterfeit during the meetup?",
    answer:
      "Do NOT share your Escrow Release OTP and do not hand over cash. Simply decline the deal. If you deposited funds into escrow, your payment will be refunded 100% back to your Telebirr or CBE Birr account without any penalty.",
  },
  {
    id: "f-8",
    category: "buying",
    question: "Which kebeles in Adama are covered on Sebez Market?",
    answer:
      "We cover all of Adama including Arada, Bole, Kebele 04 (Stadium area), Posta Bet, Amede Market, Kebele 02, Dembela, and Boku Shenen.",
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>("f-1");

  const filteredFaqs = FAQS.filter((faq) => {
    if (activeCategory !== "all" && faq.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q);
    }
    return true;
  });

  const toggleOpen = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Header */}
      <section className="bg-[#ede4d6] border border-[#dfd2be] rounded-3xl p-6 sm:p-10 text-[#2b1c11] shadow-2xs space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1e40af] bg-[#dbeafe] px-3 py-1 rounded-full border border-[#bfdbfe]">
          <HelpCircle className="w-3.5 h-3.5 text-[#1d4ed8]" />
          Adama Marketplace Knowledge Base
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#2b1c11]">
          Frequently Asked Questions (FAQ)
        </h1>
        <p className="text-[#6a4727] text-xs sm:text-sm max-w-2xl leading-relaxed font-medium">
          Everything you need to know about buying directly from sellers, posting free ads, 1-to-1 device barter, and circular trade loops in Adama.
        </p>

        {/* Search Bar inside FAQ */}
        <div className="pt-2 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search a question (e.g. swap, escrow, refund, meetup)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#faf5ed] border border-[#d2ba92] text-xs text-[#2b1c11] placeholder-[#8d7159] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]"
            />
            <Search className="w-4 h-4 text-[#8d7159] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </section>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
            activeCategory === "all"
              ? "bg-[#3d2717] text-white shadow-xs"
              : "bg-[#faf5ed] border border-[#dfd2be] text-[#52361f] hover:bg-[#eee4d5]"
          }`}
        >
          All Questions ({FAQS.length})
        </button>
        <button
          onClick={() => setActiveCategory("buying")}
          className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-all ${
            activeCategory === "buying"
              ? "bg-[#1d4ed8] text-white shadow-xs"
              : "bg-[#faf5ed] border border-[#bfdbfe] text-[#1e40af] hover:bg-[#dbeafe]"
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Direct Buying</span>
        </button>
        <button
          onClick={() => setActiveCategory("selling")}
          className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-all ${
            activeCategory === "selling"
              ? "bg-[#1d4ed8] text-white shadow-xs"
              : "bg-[#faf5ed] border border-[#bfdbfe] text-[#1e40af] hover:bg-[#dbeafe]"
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Selling Items</span>
        </button>
        <button
          onClick={() => setActiveCategory("barter")}
          className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-all ${
            activeCategory === "barter"
              ? "bg-[#6a4727] text-white shadow-xs"
              : "bg-[#faf5ed] border border-[#dfd2be] text-[#6a4727] hover:bg-[#ede4d6]"
          }`}
        >
          <Repeat className="w-3.5 h-3.5" />
          <span>Device Swaps</span>
        </button>
        <button
          onClick={() => setActiveCategory("escrow")}
          className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-all ${
            activeCategory === "escrow"
              ? "bg-[#1d4ed8] text-white shadow-xs"
              : "bg-[#faf5ed] border border-[#bfdbfe] text-[#1e40af] hover:bg-[#dbeafe]"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Escrow &amp; OTP</span>
        </button>
      </div>

      {/* Accordion FAQ List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="bg-[#faf5ed] rounded-2xl border border-[#dfd2be] p-8 text-center text-xs text-[#785437]">
            No answers match your search term. Try another keyword or browse all topics.
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-[#faf5ed] rounded-2xl border border-[#dfd2be] overflow-hidden shadow-2xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleOpen(faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-[#faf6f0] transition-colors"
                >
                  <span className="font-extrabold text-sm text-[#2b1c11]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#785437] transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-[#52361f] leading-relaxed border-t border-[#f0e6d8]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Direct Contact Banner */}
      <section className="bg-[#ede4d6] rounded-2xl border border-[#dfd2be] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-sm text-[#2b1c11]">Still have a question?</h3>
          <p className="text-xs text-[#785437]">
            Chat with a seller directly or send a message to our local Adama support team.
          </p>
        </div>
        <Link
          href="/messages"
          className="inline-flex items-center gap-2 bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Open Chat Messenger</span>
        </Link>
      </section>
    </div>
  );
}
