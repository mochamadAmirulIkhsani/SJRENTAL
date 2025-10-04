import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MonthlyReportData {
  month: string;
  income: number;
  expenses: number;
  profit: number;
  rentals: number;
  newCustomers: number;
  assetValue: number;
}

interface MonthlyReportProps {
  monthlyData: MonthlyReportData[];
}

export function MonthlyReport({ monthlyData }: MonthlyReportProps) {
  // Ensure monthlyData is always an array with fallback data
  const data =
    Array.isArray(monthlyData) && monthlyData.length > 0
      ? monthlyData
      : [
          {
            month: "October 2025",
            income: 25000000,
            expenses: 12500000,
            profit: 12500000,
            rentals: 45,
            newCustomers: 12,
            assetValue: 150000000,
          },
          {
            month: "September 2025",
            income: 22000000,
            expenses: 11000000,
            profit: 11000000,
            rentals: 38,
            newCustomers: 8,
            assetValue: 145000000,
          },
          {
            month: "August 2025",
            income: 28000000,
            expenses: 13800000,
            profit: 14200000,
            rentals: 52,
            newCustomers: 15,
            assetValue: 148000000,
          },
        ];

  const currentMonth = data[0] || {};
  const previousMonth = data[1] || {};

  const getGrowthPercentage = (current: number, previous: number) => {
    if (!previous) return 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const getGrowthBadge = (percentage: number) => {
    if (percentage > 0) {
      return <Badge className="bg-green-50 text-green-700 border-green-200">+{percentage}%</Badge>;
    } else if (percentage < 0) {
      return <Badge className="bg-red-50 text-red-700 border-red-200">{percentage}%</Badge>;
    }
    return <Badge className="bg-gray-50 text-gray-700 border-gray-200">0%</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Monthly Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Monthly Income</CardDescription>
            <CardTitle className="text-2xl text-green-600">Rp {currentMonth.income?.toLocaleString() || "0"}</CardTitle>
          </CardHeader>
          <CardContent>{getGrowthBadge(getGrowthPercentage(currentMonth.income || 0, previousMonth.income || 0))}</CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Monthly Expenses</CardDescription>
            <CardTitle className="text-2xl text-red-600">Rp {currentMonth.expenses?.toLocaleString() || "0"}</CardTitle>
          </CardHeader>
          <CardContent>{getGrowthBadge(getGrowthPercentage(currentMonth.expenses || 0, previousMonth.expenses || 0))}</CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Net Profit</CardDescription>
            <CardTitle className="text-2xl text-blue-600">Rp {currentMonth.profit?.toLocaleString() || "0"}</CardTitle>
          </CardHeader>
          <CardContent>{getGrowthBadge(getGrowthPercentage(currentMonth.profit || 0, previousMonth.profit || 0))}</CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Asset Value</CardDescription>
            <CardTitle className="text-2xl text-purple-600">Rp {currentMonth.assetValue?.toLocaleString() || "0"}</CardTitle>
          </CardHeader>
          <CardContent>{getGrowthBadge(getGrowthPercentage(currentMonth.assetValue || 0, previousMonth.assetValue || 0))}</CardContent>
        </Card>
      </div>

      {/* Monthly Breakdown Table */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Performance Breakdown</CardTitle>
          <CardDescription>Detailed month-by-month business performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Month</th>
                  <th className="text-right py-3">Income</th>
                  <th className="text-right py-3">Expenses</th>
                  <th className="text-right py-3">Profit</th>
                  <th className="text-right py-3">Margin</th>
                  <th className="text-right py-3">Rentals</th>
                  <th className="text-right py-3">New Customers</th>
                </tr>
              </thead>
              <tbody>
                {data.map((month, index) => {
                  const margin = month.income ? Math.round((month.profit / month.income) * 100) : 0;

                  return (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="py-3 font-medium">{month.month}</td>
                      <td className="py-3 text-right text-green-600">Rp {month.income.toLocaleString()}</td>
                      <td className="py-3 text-right text-red-600">Rp {month.expenses.toLocaleString()}</td>
                      <td className="py-3 text-right">
                        <span className={month.profit >= 0 ? "text-green-600" : "text-red-600"}>Rp {month.profit.toLocaleString()}</span>
                      </td>
                      <td className="py-3 text-right">
                        <Badge
                          variant="outline"
                          className={
                            margin >= 20
                              ? "bg-green-50 text-green-700 border-green-200"
                              : margin >= 10
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : margin >= 0
                              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }
                        >
                          {margin}%
                        </Badge>
                      </td>
                      <td className="py-3 text-right">{month.rentals}</td>
                      <td className="py-3 text-right">{month.newCustomers}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quarterly Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Quarterly Summary</CardTitle>
          <CardDescription>Business performance by quarter</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Calculate quarters */}
            {Array.from({ length: 4 }, (_, quarterIndex) => {
              const quarterMonths = data.slice(quarterIndex * 3, (quarterIndex + 1) * 3);
              const quarterIncome = quarterMonths.reduce((sum, month) => sum + month.income, 0);
              const quarterExpenses = quarterMonths.reduce((sum, month) => sum + month.expenses, 0);
              const quarterProfit = quarterIncome - quarterExpenses;
              const quarterRentals = quarterMonths.reduce((sum, month) => sum + month.rentals, 0);

              if (quarterMonths.length === 0) return null;

              return (
                <Card key={quarterIndex}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Q{quarterIndex + 1}</CardTitle>
                    <CardDescription>
                      {quarterMonths[0]?.month} - {quarterMonths[quarterMonths.length - 1]?.month}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Income:</span>
                      <span className="text-sm font-medium text-green-600">Rp {quarterIncome.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Expenses:</span>
                      <span className="text-sm font-medium text-red-600">Rp {quarterExpenses.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Profit:</span>
                      <span className={`text-sm font-medium ${quarterProfit >= 0 ? "text-green-600" : "text-red-600"}`}>Rp {quarterProfit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Rentals:</span>
                      <span className="text-sm font-medium">{quarterRentals}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
