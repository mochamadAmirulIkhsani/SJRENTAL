"use client";

import { useState } from "react";
import { updateMotorcycleStatus, deleteMotorcycle } from "@/actions/motorcycle.action";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Settings } from "lucide-react";
import { toast } from "sonner";

interface MotorcycleListProps {
  motorcycles: any[];
}

const statusColors = {
  AVAILABLE: "bg-green-100 text-green-800 border-green-200",
  RENTED: "bg-blue-100 text-blue-800 border-blue-200",
  MAINTENANCE: "bg-yellow-100 text-yellow-800 border-yellow-200",
  OUT_OF_SERVICE: "bg-red-100 text-red-800 border-red-200",
};

const statusLabels = {
  AVAILABLE: "Available",
  RENTED: "Rented",
  MAINTENANCE: "Maintenance",
  OUT_OF_SERVICE: "Out of Service",
};

export function MotorcycleList({ motorcycles }: MotorcycleListProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleStatusChange = async (id: string, status: string) => {
    setLoading(id);
    try {
      await updateMotorcycleStatus(id, status as any);
      toast.success("Motorcycle status updated successfully!");
    } catch (error) {
      toast.error("Failed to update motorcycle status");
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this motorcycle?")) return;

    setLoading(id);
    try {
      await deleteMotorcycle(id);
      toast.success("Motorcycle deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete motorcycle. Check if it has active rentals.");
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  if (motorcycles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No motorcycles found. Add your first motorcycle to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {motorcycles.map((motorcycle) => (
        <Card key={motorcycle.id} className="relative">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-lg">
                  {motorcycle.brand} {motorcycle.model}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {motorcycle.year} • {motorcycle.color}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Details
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Change Status
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(motorcycle.id)} className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Plate Number:</span>
                <span className="font-mono">{motorcycle.plateNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Engine:</span>
                <span>{motorcycle.engineSize}cc</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Daily Rate:</span>
                <span className="font-semibold">Rp {Number(motorcycle.dailyRate).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Badge variant="outline" className={statusColors[motorcycle.status as keyof typeof statusColors]}>
                {statusLabels[motorcycle.status as keyof typeof statusLabels]}
              </Badge>

              <div className="flex gap-1">
                {motorcycle.status !== "AVAILABLE" && (
                  <Button size="sm" variant="outline" onClick={() => handleStatusChange(motorcycle.id, "AVAILABLE")} disabled={loading === motorcycle.id}>
                    Set Available
                  </Button>
                )}
                {motorcycle.status !== "MAINTENANCE" && (
                  <Button size="sm" variant="outline" onClick={() => handleStatusChange(motorcycle.id, "MAINTENANCE")} disabled={loading === motorcycle.id}>
                    Maintenance
                  </Button>
                )}
              </div>
            </div>

            {motorcycle.condition && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs text-muted-foreground">{motorcycle.condition}</p>
              </div>
            )}

            {motorcycle._count?.rentals > 0 && (
              <div className="mt-2">
                <p className="text-xs text-blue-600">{motorcycle._count.rentals} active rental(s)</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
