export interface Motorcycle {
  id: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  plateNumber: string;
  engineSize: number;
  status: "AVAILABLE" | "RENTED" | "MAINTENANCE" | "OUT_OF_SERVICE";
  condition?: string;
  dailyRate: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMotorcycleData {
  brand: string;
  model: string;
  year: number;
  color: string;
  plateNumber: string;
  engineSize: number;
  dailyRate: number;
  condition?: string;
}

export interface UpdateMotorcycleData extends Partial<CreateMotorcycleData> {
  status?: "AVAILABLE" | "RENTED" | "MAINTENANCE" | "OUT_OF_SERVICE";
}
