'use client'

import { DataTable } from "@/components/ui/data-table"
import { columns } from "@/components/dashboard/columns"
import { useDashboardData } from "@/hooks/useDashboardData"
import { mockJobDashboardData } from "@/lib/mockData"

export function DashboardContent({isTest=false}: {isTest?: boolean}) {
  if (isTest) {
    return (
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={mockJobDashboardData} />
      </div>
    )
  }  
  const { data, isLoading, error } = useDashboardData()

  if (isLoading) {
    return <div className="container mx-auto py-10">Loading...</div>
  }

  if (error) {
    return <div className="container mx-auto py-10">Error loading dashboard</div>
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data || []} />
    </div>
  )
}
