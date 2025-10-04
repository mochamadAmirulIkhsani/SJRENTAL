"use client";

import { useState } from "react";
import { completeRental, cancelRental } from "@/actions/rental.action";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MoreHorizontal, CheckCircle, XCircle, Phone, Calendar, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface RentalListProps {
  rentals: any[];
}

const statusColors = {
  ACTIVE: "bg-blue-100 text-blue-800 border-blue-200",
  COMPLETED: "bg-green-100 text-green-800 border-green-200",
  CANCELLED: "bg-gray-100 text-gray-800 border-gray-200",
  OVERDUE: "bg-red-100 text-red-800 border-red-200",
};

const statusLabels = {
  ACTIVE: "Active",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  OVERDUE: "Overdue",
};

export function RentalList({ rentals }: RentalListProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [completeDialog, setCompleteDialog] = useState<any>(null);
  const [totalAmount, setTotalAmount] = useState("");

  const handleComplete = async () => {
    if (!completeDialog || !totalAmount) return;

    setLoading(completeDialog.id);
    try {
      await completeRental(completeDialog.id, parseFloat(totalAmount));
      toast.success("Rental completed successfully!");
      setCompleteDialog(null);
      setTotalAmount("");
    } catch (error) {
      toast.error("Failed to complete rental");
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this rental?")) return;

    setLoading(id);
    try {
      await cancelRental(id);
      toast.success("Rental cancelled successfully!");
    } catch (error) {
      toast.error("Failed to cancel rental");
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  const calculateDays = (start: Date, end: Date) => {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (rentals.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No rentals found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rentals.map((rental) => {
          const isOverdue = rental.status === "ACTIVE" && new Date() > new Date(rental.plannedEndDate);
          const days = rental.endDate ? calculateDays(new Date(rental.startDate), new Date(rental.endDate)) : calculateDays(new Date(rental.startDate), new Date());

          return (
            <Card key={rental.id} className="relative">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{rental.customer?.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {rental.customer?.phone}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {rental.status === "ACTIVE" && (
                        <DropdownMenuItem onClick={() => setCompleteDialog(rental)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Complete Rental
                        </DropdownMenuItem>
                      )}
                      {rental.status === "ACTIVE" && (
                        <DropdownMenuItem onClick={() => handleCancel(rental.id)} className="text-red-600">
                          <XCircle className="h-4 w-4 mr-2" />
                          Cancel Rental
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Motorcycle:</span>
                    <span className="font-medium">
                      {rental.motorcycle?.brand} {rental.motorcycle?.model}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Plate:</span>
                    <span className="font-mono">{rental.motorcycle?.plateNumber}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tarif Harian:</span>
                    <span>Rp {Number(rental.dailyRate).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Deposit:</span>
                    <span>Rp {Number(rental.deposit).toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Start:</span>
                    <span>{new Date(rental.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{rental.status === "COMPLETED" ? "Returned:" : "Planned End:"}</span>
                    <span>{rental.endDate ? new Date(rental.endDate).toLocaleDateString() : new Date(rental.plannedEndDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration:</span>
                    <span>{days} day(s)</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Badge variant="outline" className={statusColors[rental.status as keyof typeof statusColors]}>
                    {statusLabels[rental.status as keyof typeof statusLabels]}
                    {isOverdue && " (Overdue)"}
                  </Badge>

                  {rental.totalAmount && (
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="font-semibold text-green-600">Rp {Number(rental.totalAmount).toLocaleString()}</p>
                    </div>
                  )}
                </div>

                {rental.notes && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-muted-foreground">{rental.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Complete Rental Dialog */}
      <Dialog open={!!completeDialog} onOpenChange={() => setCompleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Rental</DialogTitle>
            <DialogDescription>Calculate the final amount for this rental</DialogDescription>
          </DialogHeader>

          {completeDialog && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span className="font-medium">{completeDialog.customer?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Motorcycle:</span>
                  <span>
                    {completeDialog.motorcycle?.brand} {completeDialog.motorcycle?.model}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tarif Harian:</span>
                  <span>Rp {Number(completeDialog.dailyRate).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Days:</span>
                  <span>{calculateDays(new Date(completeDialog.startDate), new Date())} day(s)</span>
                </div>
                <div className="flex justify-between">
                  <span>Deposit Paid:</span>
                  <span>Rp {Number(completeDialog.deposit).toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalAmount">Total Amount (Rp)</Label>
                <Input id="totalAmount" type="number" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} placeholder="Enter total amount including deposit" required />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setCompleteDialog(null)}>
                  Cancel
                </Button>
                <Button onClick={handleComplete} disabled={!totalAmount || loading === completeDialog.id}>
                  Complete Rental
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
