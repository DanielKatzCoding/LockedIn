'use client'

import { v4 as uuid } from "uuid"
import React, { useEffect, useMemo, useCallback, useState, useRef } from "react"
import { toast } from "react-toastify"
import { ColumnDef } from "@tanstack/react-table"

import { useDashboardData } from "@/hooks/Dashboard"
import { useDataGrid } from "@/hooks/use-data-grid"
import { JobDashboard } from "@/types/dashboard"

import { DataGrid } from "./data-grid/data-grid"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Checkbox } from "@/components/ui/checkbox"
import { DataGridSkeleton, DataGridSkeletonGrid } from "./data-grid/data-grid-skeleton"
import { DataGridKeyboardShortcuts } from "./data-grid/data-grid-keyboard-shortcuts"

export function DashboardContent({ isTest = false }: { isTest?: boolean }) {
  const { data, isLoading, isError } = useDashboardData(isTest)
  const [dataState, setDataState] = useState<JobDashboard[]>([])
  const gridRef = useRef<HTMLDivElement>(null)

  // Column order for paste mapping (excluding select checkbox)
  const pasteableColumns = ['company', 'jobTitle', 'applicationDate', 'status', 'responseDate', 'notes']

  // Define columns with select checkbox
  const columns = useMemo<ColumnDef<JobDashboard>[]>(() => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: true,
      enableHiding: false,
      size: 40,
    },
    { 
      id: "company", 
      accessorKey: "company", 
      header: "Company", 
      size: 150, 
      meta: { cell: { variant: "short-text" } } 
    },
    { 
      id: "jobTitle", 
      accessorKey: "jobTitle", 
      header: "Job Title", 
      size: 180, 
      meta: { cell: { variant: "short-text" } } 
    },
    { 
      id: "applicationDate", 
      accessorKey: "applicationDate", 
      header: "Applied", 
      size: 120, 
      meta: { cell: { variant: "date" } } 
    },
    { 
      id: "status", 
      accessorKey: "status", 
      header: "Status", 
      size: 140, 
      meta: { 
        cell: { 
          variant: "select", 
          options: [
            { label: "Applied", value: "Applied" }, 
            { label: "Interview", value: "Interview" }, 
            { label: "Offer", value: "Offer" }, 
            { label: "Rejected", value: "Rejected" }
          ]
        }
      }
    },
    { 
      id: "responseDate", 
      accessorKey: "responseDate", 
      header: "Responded", 
      size: 120, 
      meta: { cell: { variant: "date" } } 
    },
    { 
      id: "notes", 
      accessorKey: "notes", 
      header: "Notes", 
      size: 500, 
      meta: { cell: { variant: "long-text" } } 
    },
  ], [])

  // Single row add handler
  const onRowAdd = useCallback(() => {
    const newRow: JobDashboard = {
      id: uuid(),
      company: "",
      jobTitle: "",
      status: "Applied",
      applicationDate: new Date().toISOString().split('T')[0],
      jobLink: "",
      responseDate: "",
      notes: ""
    }

    setDataState((prev) => [...prev, newRow])
    
    return {
      rowIndex: dataState.length,
      columnId: "company",
    }
  }, [dataState.length])

  // Multiple rows add handler
  const onRowsAdd = useCallback((count: number) => {
    const newRows: JobDashboard[] = Array.from({ length: count }, () => ({
      id: uuid(),
      company: "",
      jobTitle: "",
      status: "Applied",
      applicationDate: new Date().toISOString().split('T')[0],
      jobLink: "",
      responseDate: "",
      notes: ""
    }))
    
    setDataState((prev) => [...prev, ...newRows])
  }, [])

  // Delete rows handler
  const onRowsDelete = useCallback((rows: JobDashboard[]) => {
    setDataState((prev) => prev.filter((row) => !rows.includes(row)))
  }, [])

  // Custom paste handler that updates cells from selection point
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      // Only handle if grid or its children have focus
      const gridElement = gridRef.current
      if (!gridElement || !gridElement.contains(document.activeElement)) {
        return
      }

      // Don't interfere if user is editing a cell (activeElement is an input/textarea)
      const activeElement = document.activeElement
      if (activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA') {
        return
      }

      const text = e.clipboardData?.getData('text')
      if (!text) return

      e.preventDefault()
      e.stopPropagation()
      
      // Get row index from row element
      const rowElement = activeElement?.closest('[role="row"]')
      const rowIndex = rowElement ? parseInt(rowElement.getAttribute('data-index') || '0') : 0
      
      // Get column index from gridcell aria-colindex
      const gridCell = activeElement?.closest('[role="gridcell"]')
      const colIndex = gridCell ? parseInt(gridCell.getAttribute('aria-colindex') || '1') - 1 : 0
      
      // Parse clipboard data into 2D array
      const lines = text.split('\n').filter(line => line.trim())
      const pasteData = lines.map(line => {
        if (line.includes('\t')) {
          return line.split('\t').map(v => v.trim())
        } else {
          return line.split(/\s{2,}/).map(v => v.trim())
        }
      })
      
      // Update data starting from selected cell
      setDataState((prev) => {
        const newData = [...prev]
        
        pasteData.forEach((rowData, pasteRowOffset) => {
          const targetRowIndex = rowIndex + pasteRowOffset
          
          // Create new row if needed
          while (targetRowIndex >= newData.length) {
            newData.push({
              id: uuid(),
              company: "",
              jobTitle: "",
              status: "Applied",
              applicationDate: new Date().toISOString().split('T')[0],
              jobLink: "",
              responseDate: "",
              notes: ""
            })
          }
          
          // Update cells across columns
          rowData.forEach((cellValue, pasteColOffset) => {
            const targetColIndex = colIndex + pasteColOffset
            
            // Map column index to field name (accounting for select checkbox at index 0)
            if (targetColIndex > 0 && targetColIndex <= pasteableColumns.length) {
              const columnKey = pasteableColumns[targetColIndex - 1] as keyof JobDashboard
              newData[targetRowIndex] = {
                ...newData[targetRowIndex],
                [columnKey]: cellValue
              }
            }
          })
        })
        
        return newData
      })
      
      const cellsUpdated = pasteData.reduce((sum, row) => sum + row.length, 0)
      toast.success(`Pasted ${cellsUpdated} cell(s)`)
    }

    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [pasteableColumns])

  // DataGrid hook setup
  const { table, ...dataGridProps } = useDataGrid({
    columns,
    data: dataState,
    onDataChange: setDataState,
    enableSearch: true,
    autoFocus: true,
    onRowAdd,
    onRowsAdd,
    onRowsDelete,
    getRowId: (row) => row.id
  })

  // Load data when available
  useEffect(() => {
    if (data) {
      setDataState(data)
    }
    if (isError) {
      toast.error("Error, Unable to load data.")
    }
  }, [data, isError])

  if (isLoading) {
    return (
      <DataGridSkeleton>
        <DataGridSkeletonGrid />
      </DataGridSkeleton>
    )
  }

  if (isError) {
    return <h1>Error, Unable to load data.</h1>
  }
  
  return (    
    <TooltipProvider>
      <div ref={gridRef}>
        <DataGridKeyboardShortcuts enableSearch={!!dataGridProps.searchState} />
        <DataGrid {...dataGridProps} table={table} stretchColumns={true} />
      </div>
    </TooltipProvider>
  )
}
