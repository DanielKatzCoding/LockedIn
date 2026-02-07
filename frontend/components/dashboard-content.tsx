'use client'

import { DataTable } from "@/components/ui/data-table"
import { columns } from "@/components/dashboard/columns"
import { useDashboardData } from "@/hooks/Dashboard"
import { useEffect } from "react"
import { toast } from "react-toastify"

export function DashboardContent({ isTest = false }: { isTest?: boolean }) {
  const { data, isLoading, error } = useDashboardData(isTest);

  useEffect(() => {
    if (error) {
      toast.error("Error loading dashboard data");
    }
    else if (data) {
      toast.success("Dashboard data loaded successfully!");
    }
    
    else if (isLoading) {
      toast.info("Loading dashboard data...");
    }
    
    
  }, [data, error, isLoading]);

  if (isLoading) return <div className="justify-center flex">Loading...</div>;
  if (error) return <div className="justify-center flex">Error loading dashboard</div>;

  return <DataTable columns={columns} data={data || []} />
}
