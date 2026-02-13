import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { JobDashboard } from '@/types/dashboard'
import { mockJobDashboardData } from '@/lib/mockData'
import {v4 as uuid4} from 'uuid'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const useDashboardData = (isTest: boolean) => {
  return useQuery<JobDashboard[]>({
    // Add isTest to the key so the cache is distinct for test vs real data
    queryKey: ['dashboard'], 
    queryFn: async () => {
      if (isTest) {
        // 2. Wrap the mock data in a resolve call
        return await new Promise((resolve) => {
          setTimeout(() => {
            resolve([...mockJobDashboardData]);
          }, 2000); // 2000ms = 2 seconds
        });
      }
      const { data } = await axios.get<JobDashboard[]>(`${API_BASE_URL}/api/dashboard`)
      return data
    },
  })
}

// 2. New POST hook
export const useCreateEmptyRecord = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({isTest}: {isTest: boolean}) => {
      if (isTest) {
        mockJobDashboardData.push({
          id: "1",
          company: "",
          jobTitle: "",
          applicationDate: "",
          jobLink: "",
          status: null,
          responseDate: "",
          notes: ""
        })
        
      } else {
        const res = await axios.post<JobDashboard>(
          `${API_BASE_URL}/api/dashboard/create`
        )
        return res.data;
      }
      
        
    },
  })
}

// 2. New POST hook
export const useUpdateRow = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({isTest}: {isTest: boolean}) => {
      if (isTest) {
        mockJobDashboardData.push({
          id: "1",
          company: "",
          jobTitle: "",
          applicationDate: "",
          jobLink: "",
          status: null,
          responseDate: "",
          notes: ""
        })
        
      } else {
        const res = await axios.post<JobDashboard>(
          `${API_BASE_URL}/api/dashboard/create`
        )
        return res.data;
      }              
    },
  })
}