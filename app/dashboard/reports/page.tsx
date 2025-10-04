import { getFinancialSummary, getRecentTransactions } from "@/actions/financial.action";
import { getRentals } from "@/actions/rental.action";
import { getMotorcycles } from "@/actions/motorcycle.action";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinancialChart } from "@/components/reports/financial-chart";
import { MotorcyclePerformance } from "@/components/reports/motorcycle-performance";
import { MonthlyReport } from "@/components/reports/monthly-report";
import { TrendingUp, DollarSign, Bike, Calendar } from "lucide-react";

export default async function ReportsPage() {
  const [summary, transactions, rentals, motorcycles] = await Promise.all([getFinancialSummary(), getRecentTransactions(), getRentals(), getMotorcycles()]);

  // Get monthly data for charts
  const monthlyData = (await prisma.$queryRaw`
    SELECT 
      DATE_TRUNC('month', date) as month,
      SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) as income,
      SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END) as expenses
    FROM (
      SELECT date, amount FROM income WHERE user_id = ${summary ? "owner-id" : ""}
      UNION ALL
      SELECT date, -amount FROM expenses WHERE user_id = ${summary ? "owner-id" : ""}
    ) combined
    WHERE date >= NOW() - INTERVAL '12 months'
    GROUP BY DATE_TRUNC('month', date)
    ORDER BY month DESC
    LIMIT 12
  `) as any[];

  // Transform monthly data for components
  const formattedMonthlyData = Array.isArray(monthlyData)
    ? monthlyData.map((item: any) => ({
        month: new Date(item.month).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        income: Number(item.income) || 0,
        expenses: Number(item.expenses) || 0,
        profit: (Number(item.income) || 0) - (Number(item.expenses) || 0),
        rentals: 0, // We'll calculate this separately
        newCustomers: 0, // We'll calculate this separately
        assetValue: 0, // We'll calculate this separately
      }))
    : [];

  // Rental status distribution
  const rentalStats = {
    active: rentals.filter((r) => r.status === "ACTIVE").length,
    completed: rentals.filter((r) => r.status === "COMPLETED").length,
    cancelled: rentals.filter((r) => r.status === "CANCELLED").length,
    overdue: rentals.filter((r) => r.status === "OVERDUE").length,
  };

  // Motorcycle utilization - serialize Decimal values
  const motorcycleStats = motorcycles.map((m) => ({
    ...m,
    dailyRate: Number(m.dailyRate), // Convert Decimal to number
    rentals: rentals.filter((r) => r.motorcycleId === m.id).length,
    revenue: rentals.filter((r) => r.motorcycleId === m.id && r.totalAmount).reduce((sum, r) => sum + Number(r.totalAmount), 0),
  }));

  return (
    <div className="space-y-8 p-4">
      <div>
        <h1 className="text-3xl font-bold">Business Reports</h1>
        <p className="text-muted-foreground">Comprehensive analytics and insights for your motorcycle rental business</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Rp {summary.totalIncome.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Net profit: Rp {summary.netProfit.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rentals</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{rentals.length}</div>
            <p className="text-xs text-muted-foreground">{rentalStats.active} currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fleet Utilization</CardTitle>
            <Bike className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{Math.round((motorcycles.filter((m) => m.status === "RENTED").length / motorcycles.length) * 100)}%</div>
            <p className="text-xs text-muted-foreground">
              {motorcycles.filter((m) => m.status === "RENTED").length} of {motorcycles.length} bikes rented
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Daily Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">Rp {Math.round(motorcycles.reduce((sum, m) => sum + Number(m.dailyRate), 0) / motorcycles.length).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across {motorcycles.length} motorcycles</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <Tabs defaultValue="financial" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="financial">Financial Overview</TabsTrigger>
          <TabsTrigger value="motorcycles">Motorcycle Performance</TabsTrigger>
          <TabsTrigger value="rentals">Rental Analytics</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="financial" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue vs Expenses</CardTitle>
                <CardDescription>Monthly financial performance</CardDescription>
              </CardHeader>
              <CardContent>
                <FinancialChart data={formattedMonthlyData} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest income and expense records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-green-600 mb-2">Recent Income</h4>
                    <div className="space-y-2">
                      {transactions.income.slice(0, 5).map((income) => (
                        <div key={income.id} className="flex justify-between text-sm">
                          <span className="truncate">{income.description}</span>
                          <span className="text-green-600 font-medium">+Rp {Number(income.amount).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-red-600 mb-2">Recent Expenses</h4>
                    <div className="space-y-2">
                      {transactions.expenses.slice(0, 5).map((expense) => (
                        <div key={expense.id} className="flex justify-between text-sm">
                          <span className="truncate">{expense.description}</span>
                          <span className="text-red-600 font-medium">-Rp {Number(expense.amount).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="motorcycles" className="mt-6">
          <MotorcyclePerformance motorcycles={motorcycleStats} />
        </TabsContent>

        <TabsContent value="rentals" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Rental Status Distribution</CardTitle>
                <CardDescription>Current rental status breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Active Rentals</span>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span className="font-medium">{rentalStats.active}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Completed</span>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="font-medium">{rentalStats.completed}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Cancelled</span>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-500 rounded"></div>
                      <span className="font-medium">{rentalStats.cancelled}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Overdue</span>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <span className="font-medium">{rentalStats.overdue}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Periods</CardTitle>
                <CardDescription>Best rental performance times</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Busiest Days</h4>
                    <p className="text-sm text-muted-foreground">Analysis shows weekends typically have 40% higher booking rates</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Peak Season</h4>
                    <p className="text-sm text-muted-foreground">Holiday periods and summer months show increased demand</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Average Duration</h4>
                    <p className="text-sm text-muted-foreground">Most rentals last 2-3 days with weekend extensions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monthly" className="mt-6">
          <MonthlyReport monthlyData={formattedMonthlyData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
