/**
 * Utility functions for date formatting and calculations to prevent hydration mismatches
 */

export function formatDateForDisplay(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toISOString().split("T")[0];
}

export function calculateOverdueDays(plannedEndDate: Date | string): number {
  const endDate = typeof plannedEndDate === "string" ? new Date(plannedEndDate) : plannedEndDate;
  const now = new Date();
  const diffTime = now.getTime() - endDate.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return num.toLocaleString();
}

export function isOverdue(plannedEndDate: Date | string): boolean {
  const endDate = typeof plannedEndDate === "string" ? new Date(plannedEndDate) : plannedEndDate;
  return new Date() > endDate;
}
