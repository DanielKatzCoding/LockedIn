import { DashboardContent } from '@/components/dashboard-content'
import { Providers } from '@/components/providers'

export default function DemoPage() {
  return (
    <main className="min-h-screen flex p-20 justify-center">
      <Providers>
        <DashboardContent isTest={true} />
      </Providers>
    </main>
  )
}