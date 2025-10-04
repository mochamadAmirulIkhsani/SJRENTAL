import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getFinancialSummary, getRecentTransactions } from "@/actions/financial.action";
import { getActiveRentals, getOverdueRentals } from "@/actions/rental.action";
import { DashboardStats } from "@/components/dashboard-stats";
import { AiAssistantChat } from "@/components/ai-assistant-chat";
import { OverdueBadge } from "@/components/overdue-badge";
import { formatDateForDisplay, formatCurrency } from "@/lib/date-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Calendar, Phone } from "lucide-react";

export default async function DashPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const [summary, transactions, activeRentals, overdueRentals] = await Promise.all([getFinancialSummary(), getRecentTransactions(), getActiveRentals(), getOverdueRentals()]);

  return (
    <div className="space-y-8 p-4">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your motorcycle rental business overview.</p>
      </div>

      <DashboardStats summary={summary} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AI Assistant */}
        <div>
          <AiAssistantChat />
        </div>

        {/* Active Rentals */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Active Rentals ({activeRentals.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeRentals.length === 0 ? (
                <p className="text-muted-foreground">No active rentals</p>
              ) : (
                <div className="space-y-3">
                  {activeRentals.slice(0, 5).map((rental) => (
                    <div key={rental.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{rental.customer?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {rental.motorcycle?.brand} {rental.motorcycle?.model} ({rental.motorcycle?.plateNumber})
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Rp {Number(rental.dailyRate).toLocaleString()}/hari</p>
                        <p className="text-xs text-muted-foreground">Since {formatDateForDisplay(rental.startDate)}</p>
                      </div>
                    </div>
                  ))}
                  {activeRentals.length > 5 && <p className="text-sm text-muted-foreground text-center">+{activeRentals.length - 5} more rentals</p>}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Overdue Rentals */}
          {overdueRentals.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  Overdue Rentals ({overdueRentals.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {overdueRentals.map((rental) => (
                    <div key={rental.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                      <div>
                        <p className="font-medium text-red-800">{rental.customer?.name}</p>
                        <p className="text-sm text-red-600">
                          {rental.motorcycle?.plateNumber} • {rental.customer?.phone}
                        </p>
                      </div>
                      <div className="text-right">
                        <OverdueBadge plannedEndDate={rental.plannedEndDate} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Recent Income</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.income.length === 0 ? (
              <p className="text-muted-foreground">No recent income</p>
            ) : (
              <div className="space-y-3">
                {transactions.income.slice(0, 5).map((income) => (
                  <div key={income.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{income.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDateForDisplay(income.date)} • {income.category}
                      </p>
                    </div>
                    <p className="font-medium text-green-600">+Rp {formatCurrency(Number(income.amount))}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.expenses.length === 0 ? (
              <p className="text-muted-foreground">No recent expenses</p>
            ) : (
              <div className="space-y-3">
                {transactions.expenses.slice(0, 5).map((expense) => (
                  <div key={expense.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDateForDisplay(expense.date)} • {expense.category}
                      </p>
                    </div>
                    <p className="font-medium text-red-600">-Rp {formatCurrency(Number(expense.amount))}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
