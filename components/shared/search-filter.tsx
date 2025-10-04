"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X } from "lucide-react";

interface SearchFilterProps {
  searchPlaceholder?: string;
  statusOptions?: { value: string; label: string }[];
  showStatusFilter?: boolean;
}

export function SearchFilter({ searchPlaceholder = "Search...", statusOptions = [], showStatusFilter = true }: SearchFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "all");

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }

    if (status && status !== "all") {
      params.set("status", status);
    } else {
      params.delete("status");
    }

    // Reset to page 1 when filtering
    params.delete("page");

    router.push(`?${params.toString()}`);
  }, [search, status, router, searchParams]);

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
  };

  const hasFilters = search || (status && status !== "all");

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input placeholder={searchPlaceholder} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      {showStatusFilter && statusOptions.length > 0 && (
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {hasFilters && (
        <Button variant="outline" onClick={clearFilters} className="whitespace-nowrap">
          <X className="h-4 w-4 mr-2" />
          Clear
        </Button>
      )}
    </div>
  );
}
