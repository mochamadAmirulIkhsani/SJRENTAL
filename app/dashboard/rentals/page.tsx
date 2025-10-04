import { getRentals, getRentalsPaginated, getActiveRentals, getOverdueRentals, getCustomers } from "@/actions/rental.action";
import { getAvailableMotorcycles } from "@/actions/motorcycle.action";
import { RentalList } from "@/components/rental/rental-list";
import { CreateRentalModal } from "@/components/rental/create-rental-modal";
import { SearchFilter } from "@/components/shared/search-filter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar, Clock, AlertTriangle } from "lucide-react";
import Paginate from "@/components/shared/paginate";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

interface RentalsPageProps {
  searchParams: SearchParams;
}

export default async function RentalsPage({ searchParams }: RentalsPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search as string;
  const status = params.status as string;
  const perPage = 10;

  const [paginatedRentals, allRentals, activeRentals, overdueRentals, availableMotorcycles, customers] = await Promise.all([
    getRentalsPaginated(page, perPage, search, status),
    getRentals(), // For stats calculation
    getActiveRentals(),
    getOverdueRentals(),
    getAvailableMotorcycles(),
    getCustomers(),
  ]);

  const stats = {
    total: allRentals.length,
    active: activeRentals.length,
    overdue: overdueRentals.length,
    completed: allRentals.filter((r) => r.status === "COMPLETED").length,
  };

  const statusOptions = [
    { value: "ACTIVE", label: "Active" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELLED", label: "Cancelled" },
    { value: "OVERDUE", label: "Overdue" },
  ];

  return (
    <div className="space-y-8 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Rental Management</h1>
          <p className="text-muted-foreground">Manage bookings, track active rentals, and handle returns</p>
        </div>
        <CreateRentalModal motorcycles={availableMotorcycles} customers={customers}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Rental
          </Button>
        </CreateRentalModal>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rentals</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Rental Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Rental Overview</CardTitle>
          <CardDescription>Track all rental activities and manage bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Rentals</TabsTrigger>
              <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
              <TabsTrigger value="overdue" className={stats.overdue > 0 ? "text-red-600" : ""}>
                Overdue ({stats.overdue})
              </TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <SearchFilter searchPlaceholder="Search rentals by customer, phone, or motorcycle..." statusOptions={statusOptions} />
              <RentalList rentals={paginatedRentals.data} />
              <div className="mt-6 flex justify-center">
                <Paginate currentPage={paginatedRentals.current_page} totalPages={paginatedRentals.last_page} />
              </div>
            </TabsContent>

            <TabsContent value="active" className="mt-6">
              <RentalList rentals={activeRentals} />
            </TabsContent>

            <TabsContent value="overdue" className="mt-6">
              <RentalList rentals={overdueRentals} />
            </TabsContent>

            <TabsContent value="completed" className="mt-6">
              <RentalList rentals={allRentals.filter((r) => r.status === "COMPLETED")} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
