"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bike, DollarSign, TrendingUp, Users, AlertTriangle } from "lucide-react";
import type { FinancialSummary } from "@/types/financial";

interface DashboardStatsProps {
  summary: FinancialSummary;
}

export function DashboardStats({ summary }: DashboardStatsProps) {
  const stats = [
    {
      title: "Total Income",
      value: `Rp ${summary.totalIncome.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Expenses",
      value: `Rp ${summary.totalExpenses.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "Net Profit",
      value: `Rp ${summary.netProfit.toLocaleString()}`,
      icon: DollarSign,
      color: summary.netProfit >= 0 ? "text-green-600" : "text-red-600",
      bgColor: summary.netProfit >= 0 ? "bg-green-100" : "bg-red-100",
    },
    {
      title: "Total Assets",
      value: `Rp ${summary.totalAssets.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Rentals",
      value: summary.activeRentals.toString(),
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Available Motorcycles",
      value: summary.availableMotorcycles.toString(),
      icon: Bike,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`p-2 rounded-md ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
