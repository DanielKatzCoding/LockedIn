import { DashboardContent } from '@/components/dashboard-content'
import { Providers } from '@/components/providers'
import AddRecord from '@/components/add-record'

export default function DemoPage() {
  return (
    <main className="min-h-screen flex p-20 justify-center">
      <Providers>
        <div className="w-full">          
          <AddRecord />
          <DashboardContent isTest={true} />        
        </div>
      </Providers>
    </main>
  )
}