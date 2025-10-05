"use client";

import { useState, useEffect } from "react";
import { updateMotorcycleStatus, deleteMotorcycle, updateMotorcycle } from "@/actions/motorcycle.action";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Edit, Trash2, Settings } from "lucide-react";
import { toast } from "sonner";

interface Motorcycle {
  id: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  plateNumber: string;
  engineSize: number;
  dailyRate: number;
  condition?: string;
  status: "AVAILABLE" | "RENTED" | "MAINTENANCE" | "OUT_OF_SERVICE";
  _count?: {
    rentals: number;
  };
}

interface MotorcycleListProps {
  motorcycles: Motorcycle[];
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
  const [editingMotorcycle, setEditingMotorcycle] = useState<Motorcycle | null>(null);
  const [statusChangeMotorcycle, setStatusChangeMotorcycle] = useState<Motorcycle | null>(null);
  const [editForm, setEditForm] = useState({
    brand: "",
    model: "",
    year: "",
    color: "",
    plateNumber: "",
    engineSize: "",
    dailyRate: "",
    condition: "",
  });

  const handleStatusChange = async (id: string, status: Motorcycle["status"]) => {
    setLoading(id);
    try {
      await updateMotorcycleStatus(id, status);
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

  const handleEditSave = async () => {
    if (!editingMotorcycle) return;

    // Validate required fields
    if (!editForm.brand || !editForm.model || !editForm.year || !editForm.color || !editForm.plateNumber || !editForm.engineSize || !editForm.dailyRate) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(editingMotorcycle.id);
    try {
      const updateData = {
        brand: editForm.brand,
        model: editForm.model,
        year: parseInt(editForm.year),
        color: editForm.color,
        plateNumber: editForm.plateNumber,
        engineSize: parseInt(editForm.engineSize),
        dailyRate: parseFloat(editForm.dailyRate),
        condition: editForm.condition || undefined,
      };

      await updateMotorcycle(editingMotorcycle.id, updateData);
      toast.success("Motorcycle updated successfully!");
      setEditingMotorcycle(null);
    } catch (error) {
      toast.error("Failed to update motorcycle");
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  const handleStatusChangeAndClose = async (id: string | undefined, status: Motorcycle["status"]) => {
    if (!id) return;
    await handleStatusChange(id, status);
    setStatusChangeMotorcycle(null);
  };

  // Initialize edit form when editing motorcycle changes
  useEffect(() => {
    if (editingMotorcycle) {
      setEditForm({
        brand: editingMotorcycle.brand || "",
        model: editingMotorcycle.model || "",
        year: editingMotorcycle.year?.toString() || "",
        color: editingMotorcycle.color || "",
        plateNumber: editingMotorcycle.plateNumber || "",
        engineSize: editingMotorcycle.engineSize?.toString() || "",
        dailyRate: editingMotorcycle.dailyRate?.toString() || "",
        condition: editingMotorcycle.condition || "",
      });
    }
  }, [editingMotorcycle]);

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
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setEditingMotorcycle(motorcycle)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusChangeMotorcycle(motorcycle)}>
                    <Settings className="h-4 w-4 mr-2" />
                    Change Status
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(motorcycle.id)} className="text-red-600" disabled={loading === motorcycle.id}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={statusColors[motorcycle.status as keyof typeof statusColors]}>
                  {statusLabels[motorcycle.status as keyof typeof statusLabels]}
                </Badge>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>Plate: {motorcycle.plateNumber}</p>
                <p>Engine: {motorcycle.engineSize}cc</p>
                <p className="font-medium text-primary text-base">Rp {motorcycle.dailyRate?.toLocaleString("id-ID")}/day</p>
              </div>

              {motorcycle.condition && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-muted-foreground">{motorcycle.condition}</p>
                </div>
              )}

              {(motorcycle._count?.rentals ?? 0) > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-blue-600">{motorcycle._count?.rentals} active rental(s)</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Edit Details Modal */}
      <Dialog open={!!editingMotorcycle} onOpenChange={() => setEditingMotorcycle(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Motorcycle Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="brand">Brand</Label>
                <Input id="brand" value={editForm.brand} onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })} placeholder="Honda, Yamaha, etc." />
              </div>
              <div>
                <Label htmlFor="model">Model</Label>
                <Input id="model" value={editForm.model} onChange={(e) => setEditForm({ ...editForm, model: e.target.value })} placeholder="Vario, Beat, etc." />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="year">Year</Label>
                <Input id="year" type="number" value={editForm.year} onChange={(e) => setEditForm({ ...editForm, year: e.target.value })} placeholder="2020" />
              </div>
              <div>
                <Label htmlFor="color">Color</Label>
                <Input id="color" value={editForm.color} onChange={(e) => setEditForm({ ...editForm, color: e.target.value })} placeholder="Red, Blue, etc." />
              </div>
            </div>
            <div>
              <Label htmlFor="plateNumber">Plate Number</Label>
              <Input id="plateNumber" value={editForm.plateNumber} onChange={(e) => setEditForm({ ...editForm, plateNumber: e.target.value })} placeholder="B 1234 ABC" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="engineSize">Engine Size (cc)</Label>
                <Input id="engineSize" type="number" value={editForm.engineSize} onChange={(e) => setEditForm({ ...editForm, engineSize: e.target.value })} placeholder="150" />
              </div>
              <div>
                <Label htmlFor="dailyRate">Daily Rate (Rp)</Label>
                <Input id="dailyRate" type="number" value={editForm.dailyRate} onChange={(e) => setEditForm({ ...editForm, dailyRate: e.target.value })} placeholder="75000" />
              </div>
            </div>
            <div>
              <Label htmlFor="condition">Condition Notes</Label>
              <Input id="condition" value={editForm.condition} onChange={(e) => setEditForm({ ...editForm, condition: e.target.value })} placeholder="Any notes about condition..." />
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setEditingMotorcycle(null)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={() => handleEditSave()} className="flex-1">
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Status Change Modal */}
      <Dialog open={!!statusChangeMotorcycle} onOpenChange={() => setStatusChangeMotorcycle(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Change Motorcycle Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Current Status</Label>
              <p className="text-sm text-muted-foreground">{statusChangeMotorcycle && statusLabels[statusChangeMotorcycle.status as keyof typeof statusLabels]}</p>
            </div>
            <div className="space-y-2">
              <Label>Change to:</Label>
              <div className="grid gap-2">
                <Button variant="outline" onClick={() => handleStatusChangeAndClose(statusChangeMotorcycle?.id, "AVAILABLE")} className="justify-start" disabled={statusChangeMotorcycle?.status === "AVAILABLE"}>
                  Available
                </Button>
                <Button variant="outline" onClick={() => handleStatusChangeAndClose(statusChangeMotorcycle?.id, "RENTED")} className="justify-start" disabled={statusChangeMotorcycle?.status === "RENTED"}>
                  Rented
                </Button>
                <Button variant="outline" onClick={() => handleStatusChangeAndClose(statusChangeMotorcycle?.id, "MAINTENANCE")} className="justify-start" disabled={statusChangeMotorcycle?.status === "MAINTENANCE"}>
                  Maintenance
                </Button>
                <Button variant="outline" onClick={() => handleStatusChangeAndClose(statusChangeMotorcycle?.id, "OUT_OF_SERVICE")} className="justify-start" disabled={statusChangeMotorcycle?.status === "OUT_OF_SERVICE"}>
                  Out of Service
                </Button>
              </div>
            </div>
            <div className="pt-4">
              <Button variant="outline" onClick={() => setStatusChangeMotorcycle(null)} className="w-full">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
