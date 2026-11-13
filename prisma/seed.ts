import { PrismaClient } from "@prisma/client";
import { Role, KycStatus, VehicleType, PoolStatus } from "../src/types";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Sebez Market comprehensive database seeding for Adama, Ethiopia...");

  // Clear existing records safely
  await prisma.review.deleteMany({});
  await prisma.chatMessage.deleteMany({});
  await prisma.escrowTransaction.deleteMany({});
  await prisma.deliveryOrder.deleteMany({});
  await prisma.deliveryPool.deleteMany({});
  await prisma.tradeCycleParticipant.deleteMany({});
  await prisma.tradeCycle.deleteMany({});
  await prisma.tradeOffer.deleteMany({});
  await prisma.listing.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.driverKyc.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Categories
  const catPhones = await prisma.category.create({
    data: { name: "Mobile Phones & Tablets", slug: "phones", iconName: "Smartphone" },
  });
  const catLaptops = await prisma.category.create({
    data: { name: "Laptops & Computers", slug: "laptops", iconName: "Laptop" },
  });
  const catVehicles = await prisma.category.create({
    data: { name: "Vehicles & Bajaj", slug: "vehicles", iconName: "Car" },
  });
  const catElectronics = await prisma.category.create({
    data: { name: "Electronics & Video", slug: "electronics", iconName: "Tv" },
  });
  const catHome = await prisma.category.create({
    data: { name: "Home, Furniture & Mitad", slug: "home", iconName: "Home" },
  });
  const catFashion = await prisma.category.create({
    data: { name: "Fashion & Watches", slug: "fashion", iconName: "Watch" },
  });
  const catRealEstate = await prisma.category.create({
    data: { name: "Real Estate & Rentals", slug: "real-estate", iconName: "Building" },
  });

  // 2. Verified Users in Adama
  const henok = await prisma.user.create({
    data: {
      id: "sel-1",
      name: "Henok Tadesse",
      email: "henok@example.com",
      phone: "+251911448822",
      passwordHash: "pbkdf2_sha256_mock_hash_henok",
      role: Role.MERCHANT,
      city: "Adama",
      kebele: "Bole",
      landmark: "Near Bole High School Gate",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      rating: 4.9,
      completedTrades: 19,
    },
  });

  const dawit = await prisma.user.create({
    data: {
      id: "sel-2",
      name: "Dawit Bekele (Arada Tech)",
      email: "dawit@example.com",
      phone: "+251922771133",
      passwordHash: "pbkdf2_sha256_mock_hash_dawit",
      role: Role.MERCHANT,
      city: "Adama",
      kebele: "Arada",
      landmark: "Electronics Center, 2nd Floor, Stall 14",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      rating: 4.8,
      completedTrades: 27,
    },
  });

  const chaltu = await prisma.user.create({
    data: {
      id: "sel-3",
      name: "Chaltu Girma",
      email: "chaltu@example.com",
      phone: "+251933880011",
      passwordHash: "pbkdf2_sha256_mock_hash_chaltu",
      role: Role.BUYER,
      city: "Adama",
      kebele: "Bole",
      landmark: "Opposite Post Office",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
      rating: 5.0,
      completedTrades: 12,
    },
  });

  const abebeDriver = await prisma.user.create({
    data: {
      id: "drv-1",
      name: "Abebe Demissie",
      email: "abebe@example.com",
      phone: "+251911223344",
      passwordHash: "pbkdf2_sha256_mock_hash_abebe",
      role: Role.DRIVER,
      city: "Adama",
      kebele: "Arada",
      landmark: "Arada Bajaj Terminal Gate 1",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
      rating: 4.9,
      completedTrades: 142,
    },
  });

  const admin = await prisma.user.create({
    data: {
      id: "adm-1",
      name: "Sebez Market Operations (Adama)",
      email: "admin@sebezmarket.et",
      phone: "+251900000000",
      passwordHash: "pbkdf2_sha256_admin_secret",
      role: Role.ADMIN,
      city: "Adama",
      kebele: "Posta Bet",
      rating: 5.0,
      completedTrades: 500,
    },
  });

  // 3. Driver KYC for Abebe
  await prisma.driverKyc.create({
    data: {
      userId: abebeDriver.id,
      nationalIdNumber: "ETH-ADAMA-98421",
      licenseNumber: "DL-OROMIA-55412",
      vehicleType: VehicleType.BAJAJ,
      plateNumber: "3-B042-OR",
      status: KycStatus.APPROVED,
      verifiedAt: new Date(),
    },
  });

  // 4. Classified Listings
  const lstIphone = await prisma.listing.create({
    data: {
      id: "lst-1",
      title: "iPhone 13 Pro 128GB - Sierra Blue (Factory Unlocked)",
      description: "Mint condition iPhone 13 Pro in Sierra Blue. 89% battery health. Comes with original charger and box. Open to cash sale or trade with Samsung S22 Ultra or M1 MacBook.",
      price: 55000,
      condition: "Like New",
      allowBarter: true,
      allowCashBuy: true,
      targetWishlist: "Samsung Galaxy S22 Ultra or MacBook Air M1 (Can top up or receive top-up based on specs)",
      city: "Adama",
      kebele: "Bole",
      landmark: "Near Bole High School Gate",
      imageUrls: JSON.stringify([
        "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80",
      ]),
      status: "AVAILABLE",
      userId: henok.id,
      categoryId: catPhones.id,
    },
  });

  const lstDell = await prisma.listing.create({
    data: {
      id: "lst-2",
      title: "Dell XPS 13 (Core i7 11th Gen, 16GB RAM, 512GB NVMe)",
      description: "High-performance ultrabook with 4K touch display. Battery lasts 7+ hours. Ideal for software developers or architects. Cash or swap accepted.",
      price: 68000,
      condition: "Excellent",
      allowBarter: true,
      allowCashBuy: true,
      targetWishlist: "Sony Alpha A7 series camera or M1 Pro MacBook with cash adjustment",
      city: "Adama",
      kebele: "Arada",
      landmark: "Electronics Center, 2nd Floor, Stall 14",
      imageUrls: JSON.stringify([
        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80",
      ]),
      status: "AVAILABLE",
      userId: dawit.id,
      categoryId: catLaptops.id,
    },
  });

  const lstSamsung = await prisma.listing.create({
    data: {
      id: "lst-3",
      title: "Samsung Galaxy S21 5G (Phantom Gray, 128GB)",
      description: "Clean Samsung Galaxy S21 with dynamic AMOLED 120Hz display. Dual SIM active. Ready for instant barter trade or cash sale.",
      price: 36000,
      condition: "Good",
      allowBarter: true,
      allowCashBuy: true,
      targetWishlist: "iPhone 12 or iPad Air with cash difference",
      city: "Adama",
      kebele: "Kebele 04",
      landmark: "Behind Adama Stadium",
      imageUrls: JSON.stringify([
        "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80",
      ]),
      status: "AVAILABLE",
      userId: chaltu.id,
      categoryId: catPhones.id,
    },
  });

  const lstMitad = await prisma.listing.create({
    data: {
      id: "lst-4",
      title: "Traditional Electric Mitad (Energy Saving, Heavy Duty Clay)",
      description: "Genuine heavy duty clay baking mitad. Uses 40% less electricity than older models. Includes metal lid and heat stand.",
      price: 12500,
      condition: "Brand New",
      allowBarter: false,
      allowCashBuy: true,
      city: "Adama",
      kebele: "Amede",
      landmark: "Amede Market Gate 3",
      imageUrls: JSON.stringify([
        "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80",
      ]),
      status: "AVAILABLE",
      userId: dawit.id,
      categoryId: catHome.id,
    },
  });

  const lstBajaj = await prisma.listing.create({
    data: {
      id: "lst-5",
      title: "TVS King Deluxe 200cc Bajaj (2022 Model, Oromia Plate)",
      description: "Engine in perfect condition. Fuel efficient 4-stroke engine. New tires and clean yellow/blue canvas canopy. Licensed in Adama.",
      price: 320000,
      condition: "Excellent",
      allowBarter: true,
      allowCashBuy: true,
      targetWishlist: "Toyota Vitz or DX with cash top-up difference",
      city: "Adama",
      kebele: "Arada",
      landmark: "Arada Post Office",
      imageUrls: JSON.stringify([
        "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80",
      ]),
      status: "AVAILABLE",
      userId: abebeDriver.id,
      categoryId: catVehicles.id,
    },
  });

  // 5. Pooled Bajaj Runs
  const departure1 = new Date();
  departure1.setHours(departure1.getHours() + 1);

  const pool1 = await prisma.deliveryPool.create({
    data: {
      id: "pool-101",
      originMarket: "Arada Central Market, Adama",
      destinationKebele: "Bole Kebele",
      driverId: abebeDriver.id,
      status: PoolStatus.GATHERING,
      scheduledDeparture: departure1,
      maxOrders: 6,
      ordersCount: 4,
      baseFare: 150.0,
      discountedFarePerUser: 40.0,
    },
  });

  // 6. Delivery Orders with Dual-OTP
  const delOrder1 = await prisma.deliveryOrder.create({
    data: {
      id: "del-101",
      poolId: pool1.id,
      listingId: lstIphone.id,
      buyerId: chaltu.id,
      merchantId: henok.id,
      dropoffKebele: "Bole Kebele",
      dropoffLandmark: "Near Bole High School Gate, House 412",
      recipientPhone: "+251933880011",
      deliveryFee: 40.0,
      status: "IN_TRANSIT",
    },
  });

  // 7. Telebirr Escrow Hold for Order 1
  await prisma.escrowTransaction.create({
    data: {
      amount: 55040.0, // 55k phone + 40 ETB delivery
      currency: "ETB",
      provider: "TELEBIRR",
      buyerId: chaltu.id,
      sellerId: henok.id,
      merchantReleaseOtp: "4829",
      customerDeliveryOtp: "9153",
      status: "HELD",
      deliveryOrderId: delOrder1.id,
      platformFee: 1100.0, // 2% platform fee
    },
  });

  // 8. Real Customer Reviews
  await prisma.review.createMany({
    data: [
      {
        sellerId: henok.id,
        author: "Chaltu Girma",
        kebele: "Bole Kebele",
        rating: 5,
        dealType: "Cash + Pooled Bajaj",
        comment: "Met outside Posta Bet, verified device IMEI and battery health. Delivery driver arrived right on schedule for 40 ETB. 100% genuine seller in Adama!",
      },
      {
        sellerId: henok.id,
        author: "Dawit Bekele",
        kebele: "Arada Market",
        rating: 5,
        dealType: "Barter Swap (HP for Dell)",
        comment: "We did a direct barter with a 5,000 ETB cash top-up difference via Telebirr escrow. Smooth, honest, and zero disputes.",
      },
      {
        sellerId: dawit.id,
        author: "Yonas Worku",
        kebele: "Kebele 04",
        rating: 5,
        dealType: "3-Way Circular Trade",
        comment: "Participated in a 3-way circular trade loop across Adama. The laptop matched the photos and description accurately.",
      },
    ],
  });

  // 9. Persistent Chat Messages
  await prisma.chatMessage.createMany({
    data: [
      {
        conversationId: "conv-1",
        senderId: henok.id,
        senderName: "Henok Tadesse",
        receiverId: chaltu.id,
        text: "Hello! Yes, the iPhone 13 Pro is available with original box and 89% battery health in Bole.",
      },
      {
        conversationId: "conv-1",
        senderId: chaltu.id,
        senderName: "Buyer",
        receiverId: henok.id,
        text: "Great! Are you open to a barter swap with Samsung S21 or cash via Telebirr escrow?",
      },
      {
        conversationId: "conv-1",
        senderId: henok.id,
        senderName: "Henok Tadesse",
        receiverId: chaltu.id,
        text: "Yes, I am happy to accept S21 with fair cash top-up! You can send me a swap proposal directly through the platform.",
      },
    ],
  });

  console.log("✅ Sebez Market database successfully seeded with authentic Adama data!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
