import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { JobDashboard } from '@/types/dashboard'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const useDashboardData = () => {
  return useQuery<JobDashboard[]>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await axios.get<JobDashboard[]>(
        `${API_BASE_URL}/api/dashboard`
      )
      return response.data
    },
  })
}
