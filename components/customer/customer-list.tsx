"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, CreditCard, Calendar } from "lucide-react";
import Link from "next/link";

interface CustomerListProps {
  customers: any[];
}

export function CustomerList({ customers }: CustomerListProps) {
  if (customers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No customers found. Add your first customer to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {customers.map((customer) => (
        <Card key={customer.id} className="relative hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-lg">{customer.name}</h3>
                <div className="flex items-center gap-4 mt-1">
                  <Badge variant="outline">
                    {customer._count.rentals} rental{customer._count.rentals !== 1 ? "s" : ""}
                  </Badge>
                  {customer._count.rentals > 0 && <Badge variant="secondary">Active Customer</Badge>}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{customer.phone}</span>
              </div>

              {customer.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{customer.email}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono text-xs">{customer.licenseNumber}</span>
              </div>

              {customer.address && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground line-clamp-2">{customer.address}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Joined {new Date(customer.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t">
              <div className="flex justify-between items-center">
                <div className="text-sm">
                  {customer._count.rentals > 0 ? (
                    <span className="text-green-600 font-medium">
                      {customer._count.rentals} completed rental{customer._count.rentals !== 1 ? "s" : ""}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">No rentals yet</span>
                  )}
                </div>

                <Link href={`/dashboard/customers/${customer.id}`}>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
