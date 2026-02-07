export type JobDashboard = {
  id: string
  company: string
  jobTitle: string
  applicationDate: string
  jobLink: string
  status: "Applied" | "Phone Screen" | "Interview" | "Rejected" | "Offer" | null
  responseDate: string
  notes: string
}

export type BarFilter = {
  field: keyof JobDashboard;
  value: string;
};
