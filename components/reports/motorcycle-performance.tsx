import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MotorcyclePerformanceProps {
  motorcycles: any[];
}

export function MotorcyclePerformance({ motorcycles }: MotorcyclePerformanceProps) {
  const sortedByRevenue = [...motorcycles].sort((a, b) => b.revenue - a.revenue);
  const sortedByRentals = [...motorcycles].sort((a, b) => b.rentals - a.rentals);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Top Revenue Generators</CardTitle>
          <CardDescription>Motorcycles generating the most revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedByRevenue.slice(0, 5).map((motorcycle, index) => (
              <div key={motorcycle.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm">{index + 1}</div>
                  <div>
                    <p className="font-medium">
                      {motorcycle.brand} {motorcycle.model}
                    </p>
                    <p className="text-sm text-muted-foreground">{motorcycle.plateNumber}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">Rp {motorcycle.revenue.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">
                    {motorcycle.rentals} rental{motorcycle.rentals !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Most Popular Motorcycles</CardTitle>
          <CardDescription>Motorcycles with highest rental frequency</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedByRentals.slice(0, 5).map((motorcycle, index) => (
              <div key={motorcycle.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-medium text-sm">{index + 1}</div>
                  <div>
                    <p className="font-medium">
                      {motorcycle.brand} {motorcycle.model}
                    </p>
                    <p className="text-sm text-muted-foreground">{motorcycle.plateNumber}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-purple-600">
                    {motorcycle.rentals} rental{motorcycle.rentals !== 1 ? "s" : ""}
                  </p>
                  <Badge
                    variant="outline"
                    className={
                      motorcycle.status === "AVAILABLE"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : motorcycle.status === "RENTED"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : motorcycle.status === "MAINTENANCE"
                        ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }
                  >
                    {motorcycle.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Fleet Overview</CardTitle>
          <CardDescription>Complete motorcycle performance breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Motorcycle</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-right py-2">Daily Rate</th>
                  <th className="text-right py-2">Rentals</th>
                  <th className="text-right py-2">Revenue</th>
                  <th className="text-right py-2">Utilization</th>
                </tr>
              </thead>
              <tbody>
                {motorcycles.map((motorcycle) => (
                  <tr key={motorcycle.id} className="border-b">
                    <td className="py-2">
                      <div>
                        <p className="font-medium">
                          {motorcycle.brand} {motorcycle.model}
                        </p>
                        <p className="text-xs text-muted-foreground">{motorcycle.plateNumber}</p>
                      </div>
                    </td>
                    <td className="py-2">
                      <Badge
                        variant="outline"
                        className={
                          motorcycle.status === "AVAILABLE"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : motorcycle.status === "RENTED"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : motorcycle.status === "MAINTENANCE"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }
                      >
                        {motorcycle.status}
                      </Badge>
                    </td>
                    <td className="py-2 text-right">Rp {Number(motorcycle.dailyRate).toLocaleString()}</td>
                    <td className="py-2 text-right">{motorcycle.rentals}</td>
                    <td className="py-2 text-right">Rp {motorcycle.revenue.toLocaleString()}</td>
                    <td className="py-2 text-right">
                      {motorcycle.rentals > 0 ? <span className="text-green-600">{Math.round((motorcycle.rentals / Math.max(1, sortedByRentals[0]?.rentals || 1)) * 100)}%</span> : <span className="text-gray-400">0%</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
