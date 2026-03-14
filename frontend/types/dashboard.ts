export interface CreateJobApplicationModel {
  company: string | null
  jobTitle: string | null
  applicationDate: string | null
  jobLink: string | null
  status: "Applied" | "Phone Screen" | "Interview" | "Rejected" | "Offer" | null
  responseDate: string | null
  notes: string | null
}

export interface JobApplicationModel extends CreateJobApplicationModel {
  id: string
}