import { getMotorcycles, getMotorcyclesPaginated } from "@/actions/motorcycle.action";
import { MotorcycleList } from "@/components/motorcycle/motorcycle-list";
import { AddMotorcycleModal } from "@/components/motorcycle/add-motorcycle-modal";
import { SearchFilter } from "@/components/shared/search-filter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Bike } from "lucide-react";
import Paginate from "@/components/shared/paginate";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

interface MotorcyclesPageProps {
  searchParams: SearchParams;
}

export default async function MotorcyclesPage({ searchParams }: MotorcyclesPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search as string;
  const status = params.status as string;
  const perPage = 8;

  // Get paginated motorcycles and stats
  const [paginatedMotorcycles, allMotorcycles] = await Promise.all([
    getMotorcyclesPaginated(page, perPage, search, status),
    getMotorcycles(), // For stats calculation
  ]);

  const stats = {
    total: allMotorcycles.length,
    available: allMotorcycles.filter((m) => m.status === "AVAILABLE").length,
    rented: allMotorcycles.filter((m) => m.status === "RENTED").length,
    maintenance: allMotorcycles.filter((m) => m.status === "MAINTENANCE").length,
    outOfService: allMotorcycles.filter((m) => m.status === "OUT_OF_SERVICE").length,
  };

  const statusOptions = [
    { value: "AVAILABLE", label: "Available" },
    { value: "RENTED", label: "Rented" },
    { value: "MAINTENANCE", label: "Maintenance" },
    { value: "OUT_OF_SERVICE", label: "Out of Service" },
  ];

  return (
    <div className="space-y-8 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Motorcycle Management</h1>
          <p className="text-muted-foreground">Manage your motorcycle inventory and track their status</p>
        </div>
        <AddMotorcycleModal>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Motorcycle
          </Button>
        </AddMotorcycleModal>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Motorcycles</CardTitle>
            <Bike className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.available}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rented</CardTitle>
            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.rented}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.maintenance}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Service</CardTitle>
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.outOfService}</div>
          </CardContent>
        </Card>
      </div>

      {/* Motorcycle List */}
      <Card>
        <CardHeader>
          <CardTitle>Motorcycle Inventory</CardTitle>
          <CardDescription>Manage your motorcycle fleet, update status, and track maintenance</CardDescription>
        </CardHeader>
        <CardContent>
          <SearchFilter searchPlaceholder="Search motorcycles by brand, model, or plate number..." statusOptions={statusOptions} />
          <MotorcycleList motorcycles={paginatedMotorcycles.data} />
          <div className="mt-6 flex justify-center">
            <Paginate currentPage={paginatedMotorcycles.current_page} totalPages={paginatedMotorcycles.last_page} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
