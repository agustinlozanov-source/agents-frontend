"use client";

import { useEffect, useState } from "react";
import { formatRelativeTime, formatDate } from "@/lib/utils";

interface RelativeTimeProps {
  date: string | Date;
  className?: string;
}

/**
 * Renders a relative time string (e.g. "hace 5 minutos") only on the client
 * to avoid React hydration mismatches. On the server it renders a static date.
 */
export function RelativeTime({ date, className }: RelativeTimeProps) {
  const [label, setLabel] = useState<string>(formatDate(date, "dd/MM/yyyy"));

  useEffect(() => {
    setLabel(formatRelativeTime(date));

    // Update every minute
    const interval = setInterval(() => {
      setLabel(formatRelativeTime(date));
    }, 60_000);

    return () => clearInterval(interval);
  }, [date]);

  return <span className={className}>{label}</span>;
}
