export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  licenseNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Rental {
  id: string;
  motorcycleId: string;
  customerId: string;
  startDate: Date;
  endDate?: Date;
  plannedEndDate: Date;
  dailyRate: number;
  totalAmount?: number;
  deposit: number;
  status: "ACTIVE" | "COMPLETED" | "CANCELLED" | "OVERDUE";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  motorcycle?: {
    brand: string;
    model: string;
    plateNumber: string;
  };
  customer?: {
    name: string;
    phone: string;
  };
}

export interface CreateRentalData {
  motorcycleId: string;
  customerId: string;
  startDate: Date;
  plannedEndDate: Date;
  dailyRate: number;
  deposit: number;
  notes?: string;
}

export interface CreateCustomerData {
  name: string;
  email?: string;
  phone: string;
  address?: string;
  licenseNumber: string;
}
