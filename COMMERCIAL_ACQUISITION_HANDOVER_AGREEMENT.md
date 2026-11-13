# SEBEZ MARKET (ሰበዝ ገበያ)
## COMMERCIAL SOFTWARE ASSET ACQUISITION & INTELLECTUAL PROPERTY HANDOVER AGREEMENT
**Agreed Acquisition Valuation: 25,000 ETB (Twenty-Five Thousand Ethiopian Birr)**

---

### 1. TRANSACTION SUMMARY & PARTIES

* **Software Asset Name:** Sebez Market (*Adama Hyperlocal Classifieds, Circular Barter Engine & Pooled Bajaj Logistics Network*)
* **Commercial Purchase Price:** **25,000 ETB** (One-time complete intellectual property buyout, zero royalty fees)
* **Lead Architect & Developer:** Kidus Tilahun (`kidustila64@gmail.com`)
* **Repository Remote:** `https://github.com/KidusT19/sebez-market.git` (Target Branch: `main`)
* **Deployment Location:** Adama City (Nazret), Oromia Regional State, Ethiopia
* **Effective Handover Date:** November 2026

---

### 2. COMPLETE INVENTORY OF DELIVERED INTELLECTUAL PROPERTY

The Purchaser acquires full, unrestricted ownership of the complete codebase, system architecture, visual branding assets, algorithms, database models, and operational documentation:

#### A. Proprietary Barter & Logistics Engines
1. **Johnson-Tarjan 3-Way Circular Barter Loop Detector (`src/app/api/swaps/match/route.ts`)**:
   - Detects closed multi-party trade cycles ($A \to B \to C \to A$) across Adama wishlists.
   - Dynamically computes required cash top-up balances to normalize value differences.
2. **Hyperlocal Pooled Bajaj Batching Logistics Engine (`src/app/api/pools`, `src/app/api/deliveries`)**:
   - Batches orders from central wholesale hubs (*Arada Market*, *Amede Market*) to residential kebeles (*Bole*, *Kebele 04*, *Posta Bet*).
   - Reduces delivery cost from 150 ETB (charter) to 40 ETB (pooled batch) with a guaranteed **5 ETB platform margin per parcel**.
3. **Dual-OTP Telebirr Escrow Protocol (`src/app/api/deliveries/verify/route.ts`)**:
   - Zero-fraud physical handoff mechanism:
     - **Code 1 (Merchant Release OTP):** Driver displays code at merchant stall before picking up merchandise.
     - **Code 2 (Customer Delivery OTP):** Customer inputs code upon doorstep inspection, releasing held funds to merchant and driver.

#### B. Localized Branding & Traditional Cultural Identity
1. **Traditional Ethiopian ሰፌድ (Sefed) Cultural Motifs:**
   - Vector and high-resolution graphical assets representing the circular woven straw tray — symbolically anchoring unbroken circular barter loops, community trust, and sustainable reuse.
2. **Instant Tri-Lingual Localization (`src/data/translations.ts`)**:
   - 100% complete localized UI dictionaries across **English**, **Amharic (አማርኛ)**, and **Afaan Oromoo**.

#### C. Database & Backend Architecture
1. **Relational Prisma ORM Schema (`prisma/schema.prisma`)**:
   - 10 Production Tables: `User`, `DriverKyc`, `Category`, `Listing`, `TradeOffer`, `TradeCycle`, `TradeCycleParticipant`, `DeliveryPool`, `DeliveryOrder`, `EscrowTransaction`, `ChatMessage`, `Review`.
2. **Persistent REST API Endpoints (`src/app/api/`)**:
   - Listings, Physical File Uploads (`/uploads`), User Authentication & Role Switching, In-App Chat, Reviews & Ratings, Driver Verification.
3. **Interactive Neighborhood Route Visualizer (`src/components/AdamaRouteMap.tsx`)**:
   - Dynamic SVG mapping of Adama kebeles with real-time route filters and dispatch timers.

---

### 3. OPERATIONAL MONETIZATION & FINANCIAL RETURN MODEL

The software has been engineered to deliver immediate return on investment for the acquiring company within **7 to 14 days of launch**:

| Revenue Stream | Unit Economics | Adama City Projected Volume | Monthly Revenue (ETB) |
|---|---|---|---|
| **Pooled Bajaj Delivery Platform Cut** | 5 ETB net margin per 40 ETB parcel | 800 packages / day (24,000/mo) | **120,000 ETB** |
| **Telebirr & CBE Escrow Transaction Fee** | 2.0% platform settlement fee | 350 transactions @ 15,000 ETB avg | **105,000 ETB** |
| **Verified Merchant Badges** | 350 ETB / month per shop | 60 verified merchant storefronts | **21,000 ETB** |
| **Featured Listing & Urgent Ad Boosts** | 80 ETB per 3-day homepage pin | 120 boosts / month | **9,600 ETB** |
| **TOTAL PROJECTED MONTHLY GROSS REVENUE** | — | — | **255,600 ETB** |

> **Payback Period:** At an acquisition cost of 25,000 ETB and a conservative 255,600 ETB monthly gross income, the purchase price is **100% recovered in less than 4 days of operations**.

---

### 4. PRODUCTION DEPLOYMENT & QUICKSTART GUIDE

The platform requires zero proprietary third-party subscriptions and can be run immediately on any Ubuntu VPS, cloud server, or local machine:

#### Step 1: Environment Setup
```bash
# Clone the repository
git clone https://github.com/KidusT19/sebez-market.git
cd sebez-market

# Install production dependencies
npm install
```

#### Step 2: Database Initialization & Seeding
```bash
# Push Prisma schema to SQLite (or configure PostgreSQL in .env)
npx prisma db push

# Run the comprehensive Adama merchant, driver, and classifieds seed
npx tsx prisma/seed.ts
```

#### Step 3: Build & Launch Production Server
```bash
# Compile optimized Next.js 14 production bundle
npm run build

# Start production server on port 3000
npm start
```

---

### 5. PRESET USER CREDENTIALS FOR TESTING & DEMONSTRATION

| Role | Persona Name | Location | Phone / Login | Simulated Balance |
|---|---|---|---|---|
| **Merchant** | Henok Tadesse | Bole Kebele | `+251911448822` | 14,250 ETB |
| **Merchant** | Dawit Bekele (Arada Tech) | Arada Market | `+251922771133` | 28,500 ETB |
| **Buyer** | Chaltu Girma | Bole Kebele | `+251933880011` | 8,400 ETB |
| **Bajaj Driver** | Abebe Demissie | Arada Terminal | `+251911223344` | 3,200 ETB |
| **Administrator**| Operations HQ | Posta Bet HQ | `+251900000000` | 64,200 ETB |

---

### 6. ACCEPTANCE & HANDOVER SIGN-OFF

By purchasing the Sebez Market software platform for the sum of **25,000 ETB**, the Purchaser receives all intellectual property rights, source code files, database models, graphics, and architectural assets without liens, encumbrances, or ongoing royalty liabilities.

**Delivered By:**  
*Kidus Tilahun*  
Lead Software Architect & Engineer  
Email: `kidustila64@gmail.com`  
Adama / Addis Ababa, Ethiopia  

**Accepted & Approved By Purchaser:**  
*Representative of Acquiring Enterprise / Investor*  
Date: ________________________  
Signature: ___________________  
