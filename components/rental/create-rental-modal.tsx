"use client";

import { useState, useEffect } from "react";
import { createRental, createCustomer } from "@/actions/rental.action";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

interface CreateRentalModalProps {
  children: React.ReactNode;
  motorcycles: any[];
  customers: any[];
}

export function CreateRentalModal({ children, motorcycles, customers }: CreateRentalModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [selectedMotorcycle, setSelectedMotorcycle] = useState<string>("");
  const [dailyRate, setDailyRate] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [plannedEndDate, setPlannedEndDate] = useState<string>("");
  const [deposit, setDeposit] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  // Update daily rate when motorcycle is selected
  useEffect(() => {
    if (selectedMotorcycle) {
      const motorcycle = motorcycles.find((m) => m.id === selectedMotorcycle);
      if (motorcycle) {
        setDailyRate(motorcycle.dailyRate.toString());
      }
    } else {
      setDailyRate("");
    }
  }, [selectedMotorcycle, motorcycles]);

  const handleRentalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      motorcycleId: selectedMotorcycle,
      customerId: selectedCustomer,
      startDate: new Date(startDate),
      plannedEndDate: new Date(plannedEndDate),
      dailyRate: parseFloat(dailyRate),
      deposit: parseFloat(deposit),
      notes: notes,
    };

    try {
      await createRental(data);
      toast.success("Rental created successfully!");
      setSelectedCustomer("");
      setSelectedMotorcycle("");
      setDailyRate("");
      setStartDate("");
      setPlannedEndDate("");
      setDeposit("");
      setNotes("");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to create rental");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      licenseNumber: formData.get("licenseNumber") as string,
    };

    try {
      const customer = await createCustomer(data);
      toast.success("Customer created successfully!");
      setSelectedCustomer(customer.id);
    } catch (error) {
      toast.error("Failed to create customer");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Rental</DialogTitle>
          <DialogDescription>Create a new rental booking for a customer</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="rental" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rental">New Rental</TabsTrigger>
            <TabsTrigger value="customer">Add Customer</TabsTrigger>
          </TabsList>

          <TabsContent value="rental">
            <form onSubmit={handleRentalSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customer">Customer</Label>
                <Select value={selectedCustomer} onValueChange={setSelectedCustomer} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} - {customer.phone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="motorcycle">Motorcycle</Label>
                <Select value={selectedMotorcycle} onValueChange={setSelectedMotorcycle} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a motorcycle" />
                  </SelectTrigger>
                  <SelectContent>
                    {motorcycles.map((motorcycle) => (
                      <SelectItem key={motorcycle.id} value={motorcycle.id}>
                        {motorcycle.brand} {motorcycle.model} ({motorcycle.plateNumber}) - Rp {Number(motorcycle.dailyRate).toLocaleString()}/hari
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" name="startDate" type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plannedEndDate">Planned End Date</Label>
                  <Input id="plannedEndDate" name="plannedEndDate" type="datetime-local" value={plannedEndDate} onChange={(e) => setPlannedEndDate(e.target.value)} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dailyRate">Daily Rate (Rp)</Label>
                  <Input id="dailyRate" name="dailyRate" type="number" min="0" step="1000" value={dailyRate} onChange={(e) => setDailyRate(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deposit">Deposit (Rp)</Label>
                  <Input id="deposit" name="deposit" type="number" min="0" step="1000" value={deposit} onChange={(e) => setDeposit(e.target.value)} placeholder="200000" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" name="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any special requirements or notes..." rows={3} />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading || !selectedCustomer || !selectedMotorcycle}>
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Create Rental
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="customer">
            <form onSubmit={handleCustomerSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" placeholder="John Doe" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" placeholder="081234567890" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="john@example.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number</Label>
                <Input id="licenseNumber" name="licenseNumber" placeholder="LIC123456789" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" name="address" placeholder="Full address..." rows={3} />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  <Plus className="h-4 w-4 mr-2" />
                  Add Customer
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
