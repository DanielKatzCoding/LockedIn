'use client'

import { DataTable } from "@/components/ui/data-table"
import { columns } from "@/components/dashboard/columns"
import { useDashboardData } from "@/hooks/useDashboardData"
import { mockJobDashboardData } from "@/lib/mockData"

export function DashboardContent({isTest=false}: {isTest?: boolean}) {
  if (isTest) {
    return (      
      <DataTable columns={columns} data={mockJobDashboardData} />      
    )
  }  
  const { data, isLoading, error } = useDashboardData()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error loading dashboard</div>
  }

  return (
    <DataTable columns={columns} data={data || []} />
  )
}
