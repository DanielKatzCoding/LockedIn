"use client"

import { ColumnDef } from "@tanstack/react-table"
import { JobDashboard } from "@/types/dashboard"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export const columns: ColumnDef<JobDashboard>[] = [
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => {
      const value = row.getValue("company") as string

      return (
        <Input
          type="text"
          defaultValue={value}
          className="h-8 max-w-[11rem]"          
        />
      )
    }
  },
  {
    accessorKey: "jobTitle",
    header: "Job Title",
    cell: ({ row }) => {
      const value = row.getValue("jobTitle") as string

      return (
        <Input
          type="text"
          defaultValue={value}
          className="h-8 max-w-[11rem]"          
        />
      )
    }
  },
  {
    accessorKey: "applicationDate",
    header: "Application Date",
    cell: ({ row }) => {
      const value = row.getValue("applicationDate") as string

      return (
        <Input
          type="date"
          defaultValue={value}
          className="h-8 max-w-[11rem]"          
        />
      )
    },
  },
  {
    accessorKey: "jobLink",
    header: "Job Link",
    cell: ({ row }) => {
      const value = row.getValue("jobLink") as string

      return (
        <Input
          type="url"
          defaultValue={value}
          className="h-8 max-w-[11rem]"          
        />
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const value = row.getValue("status") as JobDashboard["status"]

      return (
        <select
          defaultValue={value}
          className="h-8 rounded-md border border-input bg-background px-2 text-sm"
        >
          <option value="Applied">Applied</option>
          <option value="Phone Screen">Phone Screen</option>
          <option value="Interview">Interview</option>
          <option value="Rejected">Rejected</option>
          <option value="Offer">Offer</option>
        </select>
      )
    },
  },
  {
    accessorKey: "responseDate",
    header: "Response Date",
    cell: ({ row }) => {
      const value = row.getValue("responseDate") as string

      return (
        <Input
          type="date"
          defaultValue={value}
          className="h-8 max-w-[11rem]"
        />
      )
    },
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => {
      const value = row.getValue("notes") as string

      return (
        <Textarea
          defaultValue={value}
          placeholder="Enter prompt…"
          className="min-h-[60px]"
        />
      )
    },
  },
]