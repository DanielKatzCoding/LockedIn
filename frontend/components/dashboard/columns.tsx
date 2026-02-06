"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { JobDashboard } from "@/types/dashboard"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

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
      const initialValue = row.getValue("status") as JobDashboard["status"]
      const [status, setStatus] = useState(initialValue)

      const statusBgColor = {
        "Applied": "bg-blue-100 text-blue-800",
        "Phone Screen": "bg-yellow-100 text-yellow-800",
        "Interview": "bg-green-100 text-green-800",
        "Rejected": "bg-red-100 text-red-800",
        "Offer": "bg-purple-100 text-purple-800",
      }[status]

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className={`h-8 min-w-30 px-2 font-bold ${statusBgColor}`}>
              {status}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-background">
            <DropdownMenuItem onClick={() => setStatus("Applied")}>
              Applied
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatus("Phone Screen")}>
              Phone Screen
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatus("Interview")}>
              Interview
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatus("Rejected")}>
              Rejected
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatus("Offer")}>
              Offer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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