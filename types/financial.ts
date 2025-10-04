export interface Income {
  id: string;
  description: string;
  amount: number;
  category: "RENTAL_PAYMENT" | "DEPOSIT" | "LATE_FEE" | "DAMAGE_FEE" | "OTHER";
  source?: string;
  date: Date;
  rentalId?: string;
  userId: string;
  createdAt: Date;
  rental?: {
    customer: { name: string };
    motorcycle: { plateNumber: string };
  };
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: "FUEL" | "MAINTENANCE" | "INSURANCE" | "REGISTRATION" | "REPAIR" | "SPARE_PARTS" | "CLEANING" | "MARKETING" | "OFFICE" | "OTHER";
  date: Date;
  motorcycleId?: string;
  receipt?: string;
  vendor?: string;
  userId: string;
  createdAt: Date;
  motorcycle?: {
    plateNumber: string;
    brand: string;
    model: string;
  };
}

export interface Asset {
  id: string;
  name: string;
  description?: string;
  category: "MOTORCYCLE" | "EQUIPMENT" | "TOOLS" | "FURNITURE" | "ELECTRONICS" | "PROPERTY" | "OTHER";
  value: number;
  purchaseDate: Date;
  condition?: string;
  location?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AiInsight {
  id: string;
  title: string;
  content: string;
  category: "FINANCIAL_TREND" | "MOTORCYCLE_PERFORMANCE" | "CUSTOMER_BEHAVIOR" | "MAINTENANCE_ALERT" | "REVENUE_OPPORTUNITY" | "COST_OPTIMIZATION" | "RISK_WARNING";
  data?: any;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  userId: string;
  createdAt: Date;
}

export interface CreateIncomeData {
  description: string;
  amount: number;
  category: "RENTAL_PAYMENT" | "DEPOSIT" | "LATE_FEE" | "DAMAGE_FEE" | "OTHER";
  source?: string;
  date: Date;
  rentalId?: string;
}

export interface CreateExpenseData {
  description: string;
  amount: number;
  category: "FUEL" | "MAINTENANCE" | "INSURANCE" | "REGISTRATION" | "REPAIR" | "SPARE_PARTS" | "CLEANING" | "MARKETING" | "OFFICE" | "OTHER";
  date: Date;
  motorcycleId?: string;
  receipt?: string;
  vendor?: string;
}

export interface CreateAssetData {
  name: string;
  description?: string;
  category: "MOTORCYCLE" | "EQUIPMENT" | "TOOLS" | "FURNITURE" | "ELECTRONICS" | "PROPERTY" | "OTHER";
  value: number;
  purchaseDate: Date;
  condition?: string;
  location?: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  totalAssets: number;
  activeRentals: number;
  availableMotorcycles: number;
}
