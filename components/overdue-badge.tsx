"use client";

import { Badge } from "@/components/ui/badge";
import { calculateOverdueDays } from "@/lib/date-utils";
import { useEffect, useState } from "react";

interface OverdueBadgeProps {
  plannedEndDate: string | Date;
}

export function OverdueBadge({ plannedEndDate }: OverdueBadgeProps) {
  const [mounted, setMounted] = useState(false);
  const [overdueDays, setOverdueDays] = useState(0);

  useEffect(() => {
    setMounted(true);
    setOverdueDays(calculateOverdueDays(plannedEndDate));
  }, [plannedEndDate]);

  if (!mounted) {
    return <Badge variant="destructive">Overdue</Badge>;
  }

  return (
    <Badge variant="destructive">
      {overdueDays} day{overdueDays !== 1 ? "s" : ""} overdue
    </Badge>
  );
}
