# Sefed Market (ሰፌድ ገበያ)

> **Shop Smart · Live Better** — Ethiopia's trusted national e-commerce marketplace and device barter exchange with secure Telebirr and CBE escrow.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)

---

## Project Overview

**Sefed Market (ሰፌድ ገበያ)** is a full-scale national e-commerce platform built to provide Ethiopians with a convenient, secure, and modern shopping experience across Addis Ababa, Adama, Hawassa, Bahir Dar, Dire Dawa, and nationwide.

Inspired by the traditional Ethiopian **Sefed (ሰፌድ)** — a woven basket tray symbolizing communal abundance, fair exchange, and unity — Sefed Market combines direct customer-to-seller commerce with two key innovations:

1. **Smart Device Barter & Fair Value Equalizer:**
   Allows shoppers to upgrade electronics (smartphones, laptops, cameras) by swapping directly with automated fair cash-difference balancing, eliminating liquidity bottlenecks.

2. **Hyperlocal Pooled Logistics & Safe Escrow:**
   Integrates clustered delivery runs and public landmark pickups with digital Telebirr / CBE Birr escrow and dual-OTP verification to ensure that buyer funds are only released after goods are inspected and approved.

---

## Core System Architecture

```
+-------------------------------------------------------------+
|                      SEFED MARKET UI                        |
|       (Next.js App Router, Tailwind CSS, TypeScript)        |
+-------------------------------------------------------------+
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
+-----------------------+             +-----------------------+
|  DIRECT COMMERCE HUB  |             |  POOLED BAJAJ ENGINE  |
| - Verified Listings   |             | - Kebele Clustering   |
| - Email / Phone Auth  |             | - Scheduled Runs      |
| - Bilateral Swaps     |             | - Dual-OTP Release    |
+-----------------------+             +-----------------------+
            │                                     │
            └──────────────────┬──────────────────┘
                               ▼
+-------------------------------------------------------------+
|                     CORE SERVICES & DATA                    |
|      Prisma ORM | Telebirr & CBE Escrow | Multi-Language    |
+-------------------------------------------------------------+
```

---

## Production Functional Modules

* **Brand & Landing Experience:** Custom Sefed vector identity, responsive edge-to-edge organic curves, 4 trust pillars (Secure Payment, Fast Delivery, Best Quality, 24/7 Support), and pastel category grid.
* **Production Authentication:** Multi-method sign in supporting both **Email** and **Ethiopian Mobile Numbers** (`+251 9...` / `09...`), with dynamic active button routing.
* **Product Catalog & Direct Purchasing:** Verified listings with real-time city filtering, price in ETB, direct seller calling/chat, and instant buy actions.
* **Device Barter Engine:** Bilateral device swap calculator and fair cash difference balancing.
* **Hyperlocal Delivery & Escrow:** Localized order routing, clustered kebele runs, and Telebirr/CBE Birr payment holds.
* **Multi-Language Localization:** Built-in localization support for **English**, **Amharic (አማርኛ)**, and **Afaan Oromoo**.

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/KidusT19/sefed-gebeya.git
cd sefed-gebeya

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run database migrations
npx prisma generate
npx prisma db push

# Start the development server
npm run dev
```

---

## License

This project is licensed under the MIT License.
