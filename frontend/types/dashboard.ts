export interface CreateJobApplicationModel {
  company: string | null
  jobTitle: string | null
  applicationDate: string | null
  jobLink: string | null
  status: string | null // status values are provided dynamically via NEXT_PUBLIC_STATUS_TYPES env var
  responseDate: string | null
  notes: string | null
}

export interface JobApplicationModel extends CreateJobApplicationModel {
  id: string
}