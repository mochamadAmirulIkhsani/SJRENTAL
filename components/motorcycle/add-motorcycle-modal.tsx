"use client";

import { useState } from "react";
import { createMotorcycle } from "@/actions/motorcycle.action";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface AddMotorcycleModalProps {
  children: React.ReactNode;
}

export function AddMotorcycleModal({ children }: AddMotorcycleModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      brand: formData.get("brand") as string,
      model: formData.get("model") as string,
      year: parseInt(formData.get("year") as string),
      color: formData.get("color") as string,
      plateNumber: formData.get("plateNumber") as string,
      engineSize: parseInt(formData.get("engineSize") as string),
      dailyRate: parseFloat(formData.get("dailyRate") as string),
      condition: formData.get("condition") as string,
    };

    try {
      await createMotorcycle(data);
      toast.success("Motorcycle added successfully!");
      e.currentTarget.reset();
      setOpen(false);
    } catch (error) {
      toast.error("Failed to add motorcycle");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Motorcycle</DialogTitle>
          <DialogDescription>Add a new motorcycle to your rental fleet</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" name="brand" placeholder="Honda, Yamaha, etc." required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input id="model" name="model" placeholder="Beat, Nmax, etc." required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input id="year" name="year" type="number" min="2000" max="2025" placeholder="2023" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input id="color" name="color" placeholder="Red, Blue, etc." required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plateNumber">Plate Number</Label>
              <Input id="plateNumber" name="plateNumber" placeholder="B1234CD" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="engineSize">Engine Size (CC)</Label>
              <Input id="engineSize" name="engineSize" type="number" min="50" max="1000" placeholder="150" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dailyRate">Daily Rate (Rp)</Label>
            <Input id="dailyRate" name="dailyRate" type="number" min="0" step="1000" placeholder="75000" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition">Condition Notes</Label>
            <Textarea id="condition" name="condition" placeholder="Excellent condition, recently serviced..." rows={3} />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Add Motorcycle
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
