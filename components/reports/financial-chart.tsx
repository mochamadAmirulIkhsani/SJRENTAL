"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FinancialChartProps {
  data: any[];
}

export function FinancialChart({ data }: FinancialChartProps) {
  // Ensure data is always an array
  const chartData = Array.isArray(data) ? data : [];

  // Generate fallback data if no data is provided
  const displayData =
    chartData.length > 0
      ? chartData
      : [
          { month: "Jan 2025", income: 15000000, expenses: 8000000 },
          { month: "Feb 2025", income: 18000000, expenses: 9500000 },
          { month: "Mar 2025", income: 22000000, expenses: 11000000 },
          { month: "Apr 2025", income: 19000000, expenses: 10200000 },
          { month: "May 2025", income: 25000000, expenses: 12500000 },
          { month: "Jun 2025", income: 28000000, expenses: 13800000 },
        ];

  // Calculate totals
  const totalIncome = displayData.reduce((sum, item) => sum + (item.income || 0), 0);
  const totalExpenses = displayData.reduce((sum, item) => sum + (item.expenses || 0), 0);
  const maxAmount = Math.max(...displayData.map((item) => Math.max(item.income || 0, item.expenses || 0)));

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">{chartData.length > 0 ? "Monthly financial trends" : "Sample financial data"}</div>

      <div className="space-y-3">
        {displayData.slice(0, 6).map((item, index) => {
          const incomePercent = maxAmount > 0 ? ((item.income || 0) / maxAmount) * 100 : 0;
          const expensePercent = maxAmount > 0 ? ((item.expenses || 0) / maxAmount) * 100 : 0;

          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>{item.month || `Month ${index + 1}`}</span>
                <span className="text-green-600">+Rp {(item.income || 0).toLocaleString()}</span>
              </div>

              {/* Income bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Income</span>
                  <span>Rp {(item.income || 0).toLocaleString()}</span>
                </div>
                <div className="w-full bg-green-100 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full transition-all duration-300" style={{ width: `${incomePercent}%` }}></div>
                </div>
              </div>

              {/* Expense bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Expenses</span>
                  <span>Rp {(item.expenses || 0).toLocaleString()}</span>
                </div>
                <div className="w-full bg-red-100 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full transition-all duration-300" style={{ width: `${expensePercent}%` }}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-4 border-t">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-green-600">Rp {totalIncome.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Total Income</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-red-600">Rp {totalExpenses.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Total Expenses</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-blue-600">{totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0}%</div>
            <div className="text-xs text-muted-foreground">Profit Margin</div>
          </div>
        </div>
      </div>
    </div>
  );
}
