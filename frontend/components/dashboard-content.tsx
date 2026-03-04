'use client'

import { v4 as uuid } from "uuid"
import React, { useEffect, useMemo, useCallback, useState, useRef, ClipboardEvent } from "react"
import { toast } from "react-toastify"
import { ColumnDef } from "@tanstack/react-table"

import { useCreateEmptyRecord, useDashboardData, useUpdateRow } from "@/hooks/Dashboard"
import { useDataGrid } from "@/hooks/use-data-grid"
import { JobDashboard } from "@/types/dashboard"

import { DataGrid } from "./data-grid/data-grid"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Checkbox } from "@/components/ui/checkbox"
import { DataGridSkeleton, DataGridSkeletonGrid } from "./data-grid/data-grid-skeleton"
import { DataGridKeyboardShortcuts } from "./data-grid/data-grid-keyboard-shortcuts"

export function DashboardContent({ isTest = false }: { isTest?: boolean }) {
  const { data: dataDashboardData, isLoading: isLoadingDashboardData, isError: isErrorDashboardData } = useDashboardData(isTest)
  const { data: dataUpdateRow, mutate: mutateUpdateRow, isPending: isPendingUpdateRow, isError: isErrorUpdateRow } = useUpdateRow()
  const { data: dataEmptyRecord, mutate: mutateEmptyRecord, isPending: isPendingEmptyRecord, isError: isErrorEmptyRecord } = useCreateEmptyRecord()
  const [dataState, setDataState] = useState<JobDashboard[]>([])
  const gridRef = useRef<HTMLDivElement>(null)

  // Column order for paste mapping (excluding select checkbox)
  const pasteableColumns = useMemo(() => ['company', 'jobTitle', 'applicationDate', 'status', 'responseDate', 'notes'], [])
  
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
      status: null,
      applicationDate: "",
      jobLink: "",
      responseDate: "",
      notes: ""
    }

    mutateEmptyRecord({ newRow, isTest })
    setDataState((prev) => [...prev, newRow])
    
    return {
      rowIndex: dataState.length,
      columnId: "company",
    }
  }, [dataState.length])

  // Delete rows handler
  const onRowsDelete = useCallback((rows: JobDashboard[]) => {
    setDataState((prev) => prev.filter((row) => !rows.includes(row)))
  }, [])

    // When triggered, dataState will be sent to the backend for saving.
  const setDataStateAndBackend = useCallback((data: JobDashboard[]) => {    
    let newRowData: JobDashboard | null = null
    for (let i = 0; i < data.length; i++) {
      if (data[i] != dataState[i]) {
        newRowData = data[i]
        break
      }
    }
    if (newRowData) {
      mutateUpdateRow({ data: newRowData, isTest: isTest })
      setDataState(data)
    }
  }, [])

  useEffect(() => {
    if (isPendingUpdateRow) {
      toast.info("Updating row...")
    } else if (isErrorUpdateRow) {
      toast.error("Failed to update row")
    } else {
      toast.success("Successfully updated row!")
    }
  }, [isErrorUpdateRow, isPendingUpdateRow, dataUpdateRow])

  useEffect(() => {
    if (isPendingEmptyRecord) {
      toast.info("Creating a new row...")
    } else if (isErrorEmptyRecord) {
      toast.error("Failed to create a new row")
    } else {
      toast.success("Successfully created a new row!")
    }
  }, [isErrorEmptyRecord, isPendingEmptyRecord, dataEmptyRecord])

  // Load data when available
  useEffect(() => {
    if (dataDashboardData) {
      setDataState(dataDashboardData)
    }
    if (isErrorDashboardData) {
      toast.error("Error, Unable to load data.")
    }
  }, [dataDashboardData, isErrorDashboardData])

  // DataGrid hook setup
  const { table, ...dataGridProps } = useDataGrid({
    columns,
    data: dataState,
    onDataChange: setDataStateAndBackend,
    enableSearch: true,
    autoFocus: true,
    onRowAdd,
    onRowsDelete,
    getRowId: (row) => row.id,
    onPaste: (updates) => {
      // Handle paste updates from the DataGrid and update backend
      const newData = [...dataState];
      const rowsToUpdate = new Map<string, JobDashboard>(); // Use map to deduplicate rows

      updates.forEach(({ rowIndex, columnId, value }) => {
        if (rowIndex < newData.length) {
          newData[rowIndex] = {
            ...newData[rowIndex],
            [columnId]: value,
          };
          // Collect unique rows that need to be updated in the backend
          rowsToUpdate.set(newData[rowIndex].id, newData[rowIndex]);
        }
      });

      // Update the state first
      setDataState(newData);

      // Then update the backend for each unique row that was modified
      Array.from(rowsToUpdate.values()).forEach(row => {
        mutateUpdateRow({ data: row, isTest });
      });
    },
  })

  const handleCopy = useCallback((e: ClipboardEvent<HTMLDivElement>) => {
    const activeElement = document.activeElement;
    // Don't override if user is highlighting text inside an input
    if (activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA') return;

    const selectedRows = table.getSelectedRowModel().rows;
    if (selectedRows.length === 0) return;

    e.preventDefault();
    e.stopPropagation();

    // Map selected rows to a TSV (Tab Separated Values) string
    const csvContent = selectedRows.map(row => {
      return pasteableColumns
        .map(key => {
          const value = row.original[key as keyof JobDashboard];
          return value !== null && value !== undefined ? String(value) : "";
        })
        .join('\t');
    }).join('\n');

    navigator.clipboard.writeText(csvContent).then(() => {
      toast.success(`Copied ${selectedRows.length} row(s) to clipboard`);
    }).catch(() => {
      toast.error("Failed to copy to clipboard");
    });
  }, [table, pasteableColumns]);

  if (isLoadingDashboardData) {
    return (
      <DataGridSkeleton>
        <DataGridSkeletonGrid />
      </DataGridSkeleton>
    )
  }

  if (isErrorDashboardData) {
    return <h1>Error, Unable to load data.</h1>
  }
  
  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    // Only handle if grid or its children have focus
    const gridElement = gridRef.current;
    if (!gridElement || !gridElement.contains(document.activeElement)) {
      return;
    }

    // Don't interfere if user is editing a cell (activeElement is an input/textarea)
    const activeElement = document.activeElement;
    if (activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA') {
      return;
    }

    // Let the DataGrid handle paste through its internal mechanism
    // This will trigger the onPaste callback we defined in useDataGrid
    if (table.options.meta?.onCellsPaste) {
      // Don't prevent default here, let DataGrid handle it internally
      table.options.meta.onCellsPaste();
    }
  };

  return (
    <TooltipProvider>
      <div ref={gridRef} onCopyCapture={handleCopy} onPaste={handlePaste}>
        <DataGridKeyboardShortcuts enableSearch={!!dataGridProps.searchState} enablePaste={true} />
        <DataGrid {...dataGridProps} table={table} stretchColumns={true} />
      </div>
    </TooltipProvider>
  )
}
