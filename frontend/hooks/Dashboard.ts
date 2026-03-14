import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { JobDashboard } from '@/types/dashboard'
import { mockJobDashboardData } from '@/lib/mockData'
import {v4 as uuid4} from 'uuid'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const useDashboardData = (isTest: boolean=false) => {
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
  return useMutation({
    mutationFn: async ({newRow, isTest=false}: {newRow: JobDashboard, isTest: boolean}) => {
      if (isTest) {
        mockJobDashboardData.push(newRow)

        return await new Promise(_ => {
          setTimeout(() => {         
            console.log("IN useCreateEmptyRecord DATA:")
            console.log(mockJobDashboardData)   
            return newRow
          }, 2000); // 2000ms = 2 seconds
        });
        
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
  return useMutation({
    mutationFn: async ({data, isTest=false}: {data: JobDashboard, isTest: boolean}) => {
      if (isTest) {
        for (let i  = 0; i < mockJobDashboardData.length; i++) {
          if (mockJobDashboardData[i].id === data.id) {
            mockJobDashboardData[i] = data
            break
          }
        }
        return await new Promise(_ => {
          setTimeout(() => {
            console.log("IN useUpdateRow DATA:")
            console.log(mockJobDashboardData)
            return data
          }, 2000);
        })
      } else {
        const res = await axios.post<JobDashboard>(
          `${API_BASE_URL}/api/dashboard/${data.id}`,
          data
        )
        return res.data;
      }              
    },
  })
}