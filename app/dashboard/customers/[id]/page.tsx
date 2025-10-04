import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, CreditCard, Calendar, ArrowLeft, User } from "lucide-react";
import Link from "next/link";

interface CustomerPageProps {
  params: {
    id: string;
  };
}

export default async function CustomerPage({ params }: CustomerPageProps) {
  const customer = await prisma.customer.findUnique({
    where: { id: params.id },
    include: {
      rentals: {
        include: {
          motorcycle: {
            select: {
              brand: true,
              model: true,
              plateNumber: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!customer) {
    notFound();
  }

  const totalRentals = customer.rentals.length;
  const activeRentals = customer.rentals.filter((r) => r.status === "ACTIVE").length;
  const completedRentals = customer.rentals.filter((r) => r.status === "COMPLETED").length;
  const totalSpent = customer.rentals.filter((r) => r.totalAmount).reduce((sum, r) => sum + Number(r.totalAmount), 0);

  return (
    <div className="space-y-8 p-4">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/customers">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Customers
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{customer.name}</h1>
          <p className="text-muted-foreground">Customer Profile & Rental History</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer Information */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.phone}</span>
                </div>

                {customer.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{customer.email}</span>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono text-sm">{customer.licenseNumber}</span>
                </div>

                {customer.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <span className="text-sm">{customer.address}</span>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Member since {new Date(customer.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="pt-4 border-t space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{totalRentals}</div>
                    <div className="text-xs text-muted-foreground">Total Rentals</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{completedRentals}</div>
                    <div className="text-xs text-muted-foreground">Completed</div>
                  </div>
                </div>

                {activeRentals > 0 && (
                  <div className="text-center">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {activeRentals} Active Rental{activeRentals !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                )}

                {totalSpent > 0 && (
                  <div className="text-center pt-2">
                    <div className="text-lg font-semibold text-green-600">Rp {totalSpent.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Total Spent</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rental History */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Rental History</CardTitle>
              <CardDescription>Complete rental history for this customer</CardDescription>
            </CardHeader>
            <CardContent>
              {customer.rentals.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No rental history found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {customer.rentals.map((rental) => (
                    <div key={rental.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">
                            {rental.motorcycle.brand} {rental.motorcycle.model}
                          </h4>
                          <p className="text-sm text-muted-foreground">{rental.motorcycle.plateNumber}</p>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            rental.status === "ACTIVE"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : rental.status === "COMPLETED"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : rental.status === "OVERDUE"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-gray-50 text-gray-700 border-gray-200"
                          }
                        >
                          {rental.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Start Date:</span>
                          <div>{new Date(rental.startDate).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">{rental.status === "COMPLETED" ? "End Date:" : "Planned End:"}</span>
                          <div>{rental.endDate ? new Date(rental.endDate).toLocaleDateString() : new Date(rental.plannedEndDate).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Daily Rate:</span>
                          <div>Rp {Number(rental.dailyRate).toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">{rental.totalAmount ? "Total:" : "Deposit:"}</span>
                          <div className="font-medium">Rp {Number(rental.totalAmount || rental.deposit).toLocaleString()}</div>
                        </div>
                      </div>

                      {rental.notes && (
                        <div className="pt-2 border-t">
                          <p className="text-sm text-muted-foreground">{rental.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
