import { PrismaClient, Prisma } from "@prisma/client";
import { hashSync } from "bcrypt-ts";

const prisma = new PrismaClient();

const hashedPassword = hashSync("password", 10);

// User data
const userData: Prisma.UserCreateInput[] = [
  {
    name: "Ahmad Rental Owner",
    email: "owner@sjrent.com",
    password: hashedPassword,
    role: "OWNER",
  },
  {
    name: "Sarah Manager",
    email: "manager@sjrent.com",
    password: hashedPassword,
    role: "MANAGER",
  },
];

// Customer data
const customerData = [
  {
    name: "Budi Santoso",
    email: "budi@email.com",
    phone: "081234567890",
    address: "Jl. Merdeka No. 123, Jakarta",
    licenseNumber: "LIC001234567",
  },
  {
    name: "Siti Rahayu",
    email: "siti@email.com",
    phone: "082345678901",
    address: "Jl. Sudirman No. 456, Bandung",
    licenseNumber: "LIC002345678",
  },
  {
    name: "Rudi Hermawan",
    email: "rudi@email.com",
    phone: "083456789012",
    address: "Jl. Gatot Subroto No. 789, Surabaya",
    licenseNumber: "LIC003456789",
  },
  {
    name: "Maya Sari",
    email: "maya@email.com",
    phone: "084567890123",
    address: "Jl. Ahmad Yani No. 321, Yogyakarta",
    licenseNumber: "LIC004567890",
  },
  {
    name: "Andi Pratama",
    email: "andi@email.com",
    phone: "085678901234",
    address: "Jl. Diponegoro No. 654, Medan",
    licenseNumber: "LIC005678901",
  },
];

// Motorcycle data
const motorcycleData = [
  {
    brand: "Honda",
    model: "Beat Street",
    year: 2023,
    color: "White",
    plateNumber: "B1234AB",
    engineSize: 110,
    status: "AVAILABLE" as const,
    condition: "Excellent condition, regularly serviced",
    dailyRate: 45000,
  },
  {
    brand: "Yamaha",
    model: "Nmax 155",
    year: 2022,
    color: "Blue",
    plateNumber: "B5678CD",
    engineSize: 155,
    status: "RENTED" as const,
    condition: "Good condition, minor scratches",
    dailyRate: 75000,
  },
  {
    brand: "Honda",
    model: "Vario 160",
    year: 2023,
    color: "Red",
    plateNumber: "B9012EF",
    engineSize: 160,
    status: "AVAILABLE" as const,
    condition: "Like new, premium package",
    dailyRate: 80000,
  },
  {
    brand: "Suzuki",
    model: "Address 110",
    year: 2021,
    color: "Black",
    plateNumber: "B3456GH",
    engineSize: 110,
    status: "MAINTENANCE" as const,
    condition: "Under maintenance - brake service",
    dailyRate: 50000,
  },
  {
    brand: "Kawasaki",
    model: "Ninja 250",
    year: 2022,
    color: "Green",
    plateNumber: "B7890IJ",
    engineSize: 250,
    status: "AVAILABLE" as const,
    condition: "Sport bike, perfect for touring",
    dailyRate: 120000,
  },
  {
    brand: "Honda",
    model: "PCX 160",
    year: 2023,
    color: "Silver",
    plateNumber: "B2468KL",
    engineSize: 160,
    status: "RENTED" as const,
    condition: "Premium scooter, top condition",
    dailyRate: 90000,
  },
  {
    brand: "Yamaha",
    model: "Aerox 155",
    year: 2022,
    color: "Orange",
    plateNumber: "B1357MN",
    engineSize: 155,
    status: "AVAILABLE" as const,
    condition: "Sporty design, great performance",
    dailyRate: 70000,
  },
  {
    brand: "Honda",
    model: "Scoopy 110",
    year: 2021,
    color: "Pink",
    plateNumber: "B8642OP",
    engineSize: 110,
    status: "OUT_OF_SERVICE" as const,
    condition: "Engine overhaul needed",
    dailyRate: 40000,
  },
];

// Asset data
const assetData = [
  {
    name: "Workshop Equipment Set",
    description: "Complete motorcycle maintenance tools and equipment",
    category: "TOOLS" as const,
    value: 15000000,
    purchaseDate: new Date("2023-01-15"),
    condition: "Good",
    location: "Main Workshop",
  },
  {
    name: "Office Furniture",
    description: "Desk, chairs, filing cabinets for office",
    category: "FURNITURE" as const,
    value: 8000000,
    purchaseDate: new Date("2023-02-01"),
    condition: "Excellent",
    location: "Office Building",
  },
  {
    name: "CCTV Security System",
    description: "8-camera security system with DVR",
    category: "ELECTRONICS" as const,
    value: 5000000,
    purchaseDate: new Date("2023-03-10"),
    condition: "Excellent",
    location: "Entire Facility",
  },
  {
    name: "Helmet Collection",
    description: "20 safety helmets for customer rental",
    category: "EQUIPMENT" as const,
    value: 3000000,
    purchaseDate: new Date("2023-04-01"),
    condition: "Good",
    location: "Storage Room",
  },
];

export async function main() {
  console.log("🌱 Starting database seeding...");

  // Create users
  console.log("👤 Creating users...");
  const users = [];
  for (const u of userData) {
    const user = await prisma.user.create({ data: u });
    users.push(user);
    console.log(`✅ Created user: ${user.name}`);
  }

  const ownerId = users[0].id;

  // Create customers
  console.log("🤝 Creating customers...");
  const customers = [];
  for (const c of customerData) {
    const customer = await prisma.customer.create({ data: c });
    customers.push(customer);
    console.log(`✅ Created customer: ${customer.name}`);
  }

  // Create motorcycles
  console.log("🏍️ Creating motorcycles...");
  const motorcycles = [];
  for (const m of motorcycleData) {
    const motorcycle = await prisma.motorcycle.create({ data: m });
    motorcycles.push(motorcycle);
    console.log(`✅ Created motorcycle: ${motorcycle.brand} ${motorcycle.model} (${motorcycle.plateNumber})`);
  }

  // Create assets
  console.log("🏪 Creating assets...");
  for (const a of assetData) {
    const asset = await prisma.asset.create({
      data: { ...a, userId: ownerId },
    });
    console.log(`✅ Created asset: ${asset.name}`);
  }

  // Create some active rentals
  console.log("📋 Creating active rentals...");
  const activeRentalData = [
    {
      motorcycleId: motorcycles[1].id, // Yamaha Nmax (RENTED)
      customerId: customers[0].id,
      startDate: new Date("2024-10-01"),
      plannedEndDate: new Date("2024-10-05"),
      dailyRate: 75000,
      deposit: 200000,
      status: "ACTIVE" as const,
      notes: "Customer requested helmet and rain coat",
    },
    {
      motorcycleId: motorcycles[5].id, // Honda PCX (RENTED)
      customerId: customers[1].id,
      startDate: new Date("2024-10-02"),
      plannedEndDate: new Date("2024-10-06"),
      dailyRate: 90000,
      deposit: 250000,
      status: "ACTIVE" as const,
      notes: "Tourist rental for city tour",
    },
  ];

  for (const r of activeRentalData) {
    const rental = await prisma.rental.create({ data: r });
    console.log(`✅ Created active rental: ${rental.id}`);
  }

  // Create some completed rentals
  console.log("✅ Creating completed rentals...");
  const completedRentalData = [
    {
      motorcycleId: motorcycles[0].id, // Honda Beat
      customerId: customers[2].id,
      startDate: new Date("2024-09-20"),
      endDate: new Date("2024-09-23"),
      plannedEndDate: new Date("2024-09-23"),
      dailyRate: 45000,
      totalAmount: 135000,
      deposit: 150000,
      status: "COMPLETED" as const,
      notes: "Returned on time, no issues",
    },
    {
      motorcycleId: motorcycles[2].id, // Honda Vario
      customerId: customers[3].id,
      startDate: new Date("2024-09-15"),
      endDate: new Date("2024-09-18"),
      plannedEndDate: new Date("2024-09-18"),
      dailyRate: 80000,
      totalAmount: 240000,
      deposit: 200000,
      status: "COMPLETED" as const,
      notes: "Customer very satisfied",
    },
  ];

  for (const r of completedRentalData) {
    const rental = await prisma.rental.create({ data: r });
    console.log(`✅ Created completed rental: ${rental.id}`);
  }

  // Get all rentals for income/expense generation
  const allRentals = await prisma.rental.findMany();

  // Create income records
  console.log("💰 Creating income records...");
  const incomeData = [
    // Rental payments
    {
      description: "Rental payment - Honda Beat (B1234AB) - Rudi Hermawan",
      amount: 135000,
      category: "RENTAL_PAYMENT" as const,
      date: new Date("2024-09-23"),
      rentalId: allRentals[2]?.id,
      userId: ownerId,
    },
    {
      description: "Rental payment - Honda Vario (B9012EF) - Maya Sari",
      amount: 240000,
      category: "RENTAL_PAYMENT" as const,
      date: new Date("2024-09-18"),
      rentalId: allRentals[3]?.id,
      userId: ownerId,
    },
    // Deposits
    {
      description: "Deposit - Yamaha Nmax (B5678CD) - Budi Santoso",
      amount: 200000,
      category: "DEPOSIT" as const,
      date: new Date("2024-10-01"),
      rentalId: allRentals[0]?.id,
      userId: ownerId,
    },
    {
      description: "Deposit - Honda PCX (B2468KL) - Siti Rahayu",
      amount: 250000,
      category: "DEPOSIT" as const,
      date: new Date("2024-10-02"),
      rentalId: allRentals[1]?.id,
      userId: ownerId,
    },
    // Other income
    {
      description: "Late return fee - Previous customer",
      amount: 50000,
      category: "LATE_FEE" as const,
      date: new Date("2024-09-25"),
      source: "Penalty fee for 1 day late return",
      userId: ownerId,
    },
  ];

  for (const i of incomeData) {
    const income = await prisma.income.create({ data: i });
    console.log(`✅ Created income: ${income.description}`);
  }

  // Create expense records
  console.log("💸 Creating expense records...");
  const expenseData = [
    {
      description: "Fuel for Honda Beat (B1234AB)",
      amount: 50000,
      category: "FUEL" as const,
      date: new Date("2024-09-28"),
      motorcycleId: motorcycles[0].id,
      vendor: "Shell Gas Station",
      userId: ownerId,
    },
    {
      description: "Monthly insurance premium - All motorcycles",
      amount: 800000,
      category: "INSURANCE" as const,
      date: new Date("2024-10-01"),
      vendor: "Asuransi Jasa Raharja",
      userId: ownerId,
    },
    {
      description: "Brake service for Suzuki Address (B3456GH)",
      amount: 150000,
      category: "MAINTENANCE" as const,
      date: new Date("2024-09-30"),
      motorcycleId: motorcycles[3].id,
      vendor: "Honda Authorized Service",
      userId: ownerId,
    },
    {
      description: "Oil change for Yamaha Nmax (B5678CD)",
      amount: 75000,
      category: "MAINTENANCE" as const,
      date: new Date("2024-09-26"),
      motorcycleId: motorcycles[1].id,
      vendor: "Yamaha Service Center",
      userId: ownerId,
    },
    {
      description: "Spare parts - brake pads and filters",
      amount: 200000,
      category: "SPARE_PARTS" as const,
      date: new Date("2024-09-20"),
      vendor: "Motor Parts Shop",
      userId: ownerId,
    },
    {
      description: "Office rent - October 2024",
      amount: 2000000,
      category: "OFFICE" as const,
      date: new Date("2024-10-01"),
      vendor: "Property Management",
      userId: ownerId,
    },
    {
      description: "Cleaning supplies and equipment",
      amount: 125000,
      category: "CLEANING" as const,
      date: new Date("2024-09-22"),
      vendor: "Cleaning Supply Store",
      userId: ownerId,
    },
    {
      description: "Social media advertising",
      amount: 300000,
      category: "MARKETING" as const,
      date: new Date("2024-09-15"),
      vendor: "Facebook Ads",
      userId: ownerId,
    },
  ];

  for (const e of expenseData) {
    const expense = await prisma.expense.create({ data: e });
    console.log(`✅ Created expense: ${expense.description}`);
  }

  // Create AI insights
  console.log("🤖 Creating AI insights...");
  const insightData = [
    {
      title: "Strong Rental Performance This Month",
      content: "Your rental business is performing well with 85% occupancy rate. The Honda and Yamaha models are most popular among customers. Consider adding more premium scooters to your fleet based on demand patterns.",
      category: "FINANCIAL_TREND" as const,
      priority: "MEDIUM" as const,
      userId: ownerId,
      data: { occupancyRate: 85, popularBrands: ["Honda", "Yamaha"] },
    },
    {
      title: "Maintenance Schedule Alert",
      content: "Suzuki Address (B3456GH) requires immediate attention. The brake service is overdue and the motorcycle is currently out of service. Schedule maintenance soon to avoid revenue loss.",
      category: "MAINTENANCE_ALERT" as const,
      priority: "HIGH" as const,
      userId: ownerId,
      data: { motorcycleId: motorcycles[3].id, plateNumber: "B3456GH" },
    },
    {
      title: "Revenue Optimization Opportunity",
      content: "Peak demand occurs on weekends and holidays. Consider implementing dynamic pricing with 20-30% premium during high-demand periods to maximize revenue.",
      category: "REVENUE_OPPORTUNITY" as const,
      priority: "MEDIUM" as const,
      userId: ownerId,
      data: { recommendedPremium: 25, peakDays: ["Saturday", "Sunday"] },
    },
    {
      title: "Cost Management Insight",
      content: "Maintenance costs have increased by 15% this month. Consider negotiating better rates with service providers or bringing some basic maintenance in-house to reduce costs.",
      category: "COST_OPTIMIZATION" as const,
      priority: "LOW" as const,
      userId: ownerId,
      data: { costIncrease: 15, category: "maintenance" },
    },
  ];

  for (const insight of insightData) {
    const aiInsight = await prisma.aiInsight.create({ data: insight });
    console.log(`✅ Created AI insight: ${aiInsight.title}`);
  }

  console.log("🎉 Database seeding completed successfully!");
  console.log(`
📊 Seeding Summary:
- 👤 Users: ${userData.length}
- 🤝 Customers: ${customerData.length}
- 🏍️ Motorcycles: ${motorcycleData.length}
- 🏪 Assets: ${assetData.length}
- 📋 Rentals: 4 (2 active, 2 completed)
- 💰 Income Records: ${incomeData.length}
- 💸 Expense Records: ${expenseData.length}
- 🤖 AI Insights: ${insightData.length}

🔑 Login Credentials:
Email: owner@sjrent.com
Password: password

🚀 Your motorcycle rental business is ready!
  `);
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
