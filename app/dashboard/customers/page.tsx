import { getCustomers, getCustomersPaginated } from "@/actions/rental.action";
import { CustomerList } from "@/components/customer/customer-list";
import { AddCustomerModal } from "@/components/customer/add-customer-modal";
import { SearchFilter } from "@/components/shared/search-filter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, UserCheck, Star } from "lucide-react";
import Paginate from "@/components/shared/paginate";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

interface CustomersPageProps {
  searchParams: SearchParams;
}

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search as string;
  const perPage = 10;

  // Get paginated customers and all customers for stats
  const [paginatedCustomers, allCustomers] = await Promise.all([
    getCustomersPaginated(page, perPage, search),
    getCustomers(), // For stats calculation
  ]);

  const stats = {
    total: allCustomers.length,
    withRentals: allCustomers.filter((c) => c._count.rentals > 0).length,
    newThisMonth: allCustomers.filter((c) => {
      const customerDate = new Date(c.createdAt);
      const now = new Date();
      return customerDate.getMonth() === now.getMonth() && customerDate.getFullYear() === now.getFullYear();
    }).length,
  };

  return (
    <div className="space-y-8 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <p className="text-muted-foreground">Manage your customer database and track rental history</p>
        </div>
        <AddCustomerModal>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </AddCustomerModal>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.withRentals}</div>
            <p className="text-xs text-muted-foreground">Have rental history</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <Star className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.newThisMonth}</div>
            <p className="text-xs text-muted-foreground">Recently registered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rentals</CardTitle>
            <div className="h-3 w-3 rounded-full bg-purple-500"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.withRentals > 0 ? Math.round((allCustomers.reduce((sum: number, c: any) => sum + c._count.rentals, 0) / stats.withRentals) * 10) / 10 : 0}</div>
            <p className="text-xs text-muted-foreground">Per active customer</p>
          </CardContent>
        </Card>
      </div>

      {/* Customer List */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Database</CardTitle>
          <CardDescription>View and manage all your customers</CardDescription>
        </CardHeader>
        <CardContent>
          <SearchFilter searchPlaceholder="Search customers by name, email, phone, or license..." showStatusFilter={false} />
          <CustomerList customers={paginatedCustomers.data} />
          <div className="mt-6 flex justify-center">
            <Paginate currentPage={paginatedCustomers.current_page} totalPages={paginatedCustomers.last_page} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
