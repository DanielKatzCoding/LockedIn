'use client'

import { v4 as uuid } from "uuid"
import React, { useEffect, useMemo, useCallback, useState, useRef, ClipboardEvent } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"
import { ColumnDef } from "@tanstack/react-table"

import { useCreateEmptyRecord, useDashboardData, useUpdateRow } from "@/hooks/Dashboard"
import { useDataGrid } from "@/hooks/use-data-grid"
import { CreateJobApplicationModel, JobApplicationModel } from "@/types/dashboard"

import { DataGrid } from "./data-grid/data-grid"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Checkbox } from "@/components/ui/checkbox"
import { DataGridSkeleton, DataGridSkeletonGrid } from "./data-grid/data-grid-skeleton"
import { DataGridKeyboardShortcuts } from "./data-grid/data-grid-keyboard-shortcuts"

export function DashboardContent({ isTest = false }: { isTest?: boolean }) {
  const [page, setPage] = useState(0);
  const pageSize = 20; // items per page
  const { data: dataDashboardData, isLoading: isLoadingDashboardData, isError: isErrorDashboardData } = useDashboardData(isTest, page * pageSize, pageSize)
  const { data: dataUpdateRow, mutateAsync: mutateUpdateRow, isPending: isPendingUpdateRow, isError: isErrorUpdateRow } = useUpdateRow()
  const { data: dataEmptyRecord, mutateAsync: mutateEmptyRecord, isPending: isPendingEmptyRecord, isError: isErrorEmptyRecord } = useCreateEmptyRecord()
  const [dataState, setDataState] = useState<JobApplicationModel[]>([])
  const gridRef = useRef<HTMLDivElement>(null)

  // Column order for paste mapping (excluding select checkbox)
  const statusOptions = React.useMemo(() => {
    const raw = process.env.NEXT_PUBLIC_STATUS_TYPES?.trim() ?? '';
    // Try JSON first
    let list: string[] = [];
    if (raw.startsWith('[')) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.every(v => typeof v === 'string')) {
          list = parsed;
        }
      } catch {}
    }
    if (list.length === 0) {
      // CSV fallback
      list = raw.replace(/[\[\]"]/g, '').split(',').map(s => s.trim()).filter(Boolean);
    }
    return list.map(v => ({ label: v, value: v }));
  }, []);

  const pasteableColumns = useMemo(() => ['company', 'jobTitle', 'jobLink', 'applicationDate', 'status', 'responseDate', 'notes'], [])
  
  // Define columns with select checkbox
  const columns = useMemo<ColumnDef<JobApplicationModel>[]>(() => [
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
      id: "jobLink",
      accessorKey: "jobLink",
      header: "Job Link",
      size: 200,
      meta: { cell: { variant: "url" } }
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
          options: statusOptions
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
  const onRowAdd = useCallback(async () => {
    const newRow: CreateJobApplicationModel = {
      company: null,
      jobTitle: null,
      status: null,
      applicationDate: null,
      jobLink: null,
      responseDate: null,
      notes: null
    }

    console.log('Adding new row via mutateEmptyRecord with', newRow);
    const res = await mutateEmptyRecord({ newRow, isTest });
    console.log('Received response from empty record creation:', res);
    setDataState(prev => [...prev, res as JobApplicationModel]);
    console.log('Row added to state:', res);
    
    return {
      rowIndex: dataState.length,
      columnId: "company",
    }
  }, [dataState.length])

  // Delete rows handler
  const onRowsDelete = useCallback((rows: JobApplicationModel[]) => {
    console.log('Deleting rows:', rows);
    setDataState((prev) => prev.filter((row) => !rows.includes(row)))
  }, [])

    // When triggered, dataState will be sent to the backend for saving.
  const setDataStateAndBackend = useCallback(async (data: JobApplicationModel[]) => {
    // Convert empty strings to null for any column before processing
    const sanitizedData = data.map((row) => {
      const newRow = { ...row } as any;
      Object.keys(newRow).forEach((key) => {
        // Convert empty strings to null
        if (newRow[key] === "") {
          newRow[key] = null;
        }
        // If value is a Date object, convert to ISO date string
        if (newRow[key] instanceof Date) {
          newRow[key] = newRow[key].toISOString().split('T')[0];
        }
        // If a string contains a full datetime, strip time component
        if (typeof newRow[key] === "string" && newRow[key].includes("T")) {
          newRow[key] = newRow[key].split("T")[0];
        }
      });
      return newRow as JobApplicationModel;
    });
    console.log('setDataStateAndBackend called with data length', sanitizedData.length);
    // Find all rows that have changed
    const changedRows: JobApplicationModel[] = [];
    for (let i = 0; i < sanitizedData.length; i++) {
      // Compare objects by serializing them to JSON for deep comparison
      if (JSON.stringify(sanitizedData[i]) !== JSON.stringify(dataState[i])) {
        changedRows.push(sanitizedData[i]);
      }
    }

    // Update all changed rows in the backend
    changedRows.forEach(async (row) => {
      console.log(row);
      console.log(sanitizedData);
      await mutateUpdateRow({ data: row, isTest: isTest });
    });

    setDataState(sanitizedData);
  }, [dataState, isTest, mutateUpdateRow]);

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
    // onPaste: (updates) => {
    //   // The DataGrid will handle updating the state and calling onDataChange (setDataStateAndBackend)
    //   // So we don't need to do anything here except let it propagate
    //   // setDataStateAndBackend will be called automatically through onDataUpdate
    // },
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
          const value = row.original[key as keyof JobApplicationModel];
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
        <div className="flex items-center justify-center space-x-4 mt-4">
          <Button variant="outline" onClick={() => setPage(p => Math.max(p - 1, 0))} disabled={page === 0}>
            Previous
          </Button>
          <span>Page {page + 1}</span>
          <Button variant="outline" onClick={() => setPage(p => p + 1)} disabled={dataDashboardData && dataDashboardData.length < pageSize}>
            Next
          </Button>
        </div>
      </div>
    </TooltipProvider>
  )
}
