import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { JobApplicationModel, CreateJobApplicationModel } from '@/types/dashboard'
import { mockJobDashboardData } from '@/lib/mockData'
import {v4 as uuid4} from 'uuid'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/applications` : 'http://localhost:8000/api/applications'

export const useDashboardData = (
  isTest: boolean = false,
  skip: number = 0,
  limit: number = 100
) => {
  return useQuery<JobApplicationModel[]>({
    queryKey: ['dashboard', skip, limit],
    queryFn: async () => {
      if (isTest) {
        // Mock data with artificial delay
        return await new Promise((resolve) => {
          setTimeout(() => {
            resolve([...mockJobDashboardData]);
          }, 2000);
        });
      }
      console.log('Fetching dashboard data with skip', skip, 'limit', limit);
      const { data: rawData } = await axios.get<any[]>(`${API_BASE_URL}?skip=${skip}&limit=${limit}`);
      console.log('Raw data fetched from API:', rawData.length, 'records');
      return rawData;
    },
  });
};

// 2. New POST hook
export const useCreateEmptyRecord = () => {
  return useMutation({
    mutationFn: async ({newRow, isTest=false}: {newRow: CreateJobApplicationModel, isTest: boolean}) => {
      if (isTest) {
        const newRecord: JobApplicationModel = { ...newRow, id: uuid4() };
        mockJobDashboardData.push(newRecord);
        return await new Promise(_ => {
          setTimeout(() => {
            console.log("IN useCreateEmptyRecord DATA:")
            console.log(mockJobDashboardData)
            return newRecord
          }, 2000);
        });
        
      } else {
        const { data: rawData } = await axios.post<any>(
          `${API_BASE_URL}/create/empty`
        )
        console.log('Created empty record via API:', {
          rawData
        });

        return rawData;
      }
    },
  })
}

// 2. New POST hook
export const useUpdateRow = () => {
  return useMutation({
    mutationFn: async ({data, isTest=false}: {data: JobApplicationModel, isTest: boolean}) => {
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
        // Ensure date fields are pure dates (no time component) before sending to API
        const formatDate = (value: any) => {
          if (value instanceof Date) {
            return value.toISOString().split('T')[0];
          }
          if (typeof value === 'string' && value.includes('T')) {
            return value.split('T')[0];
          }
          return value;
        };
        const formatted = {
          ...data,
          applicationDate: formatDate(data.applicationDate),
          responseDate: formatDate(data.responseDate),
        };
        // Convert empty strings to null in all fields
        (Object.keys(formatted) as Array<keyof typeof formatted>).forEach((key) => {
          if ((formatted as any)[key] === '') {
            (formatted as any)[key] = null;
          }
        });
        const { data: rawData } = await axios.put<any>(
          `${API_BASE_URL}/${data.id}`,
          formatted
        );
        console.log('Updated row via API:', {
          rawData
        });

        return rawData;
      }
    }
  })
}