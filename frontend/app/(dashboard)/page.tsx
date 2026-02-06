'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DashboardContent } from '@/components/dashboard-content'
import { ReactNode } from 'react'

function Providers({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

export default function DemoPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <Providers>
        <DashboardContent isTest={true} />
      </Providers>
    </main>
  )
}