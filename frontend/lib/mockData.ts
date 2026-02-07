import { JobDashboard } from "@/types/dashboard"

export const mockJobDashboardData: JobDashboard[] = [
  {
    id: "1",
    company: "Google",
    jobTitle: "Senior Frontend Engineer",
    applicationDate: "2024-01-15",
    jobLink: "https://google.com/careers/job1",
    status: "Interview",
    responseDate: "2024-01-20",
    notes: "Passed first round, scheduled for technical interview"
  },
  {
    id: "2",
    company: "Microsoft",
    jobTitle: "Full Stack Developer",
    applicationDate: "2024-01-10",
    jobLink: "https://microsoft.com/careers/job2",
    status: "Applied",
    responseDate: "",
    notes: "Waiting for initial response"
  },
  {
    id: "3",
    company: "Apple",
    jobTitle: "iOS Engineer",
    applicationDate: "2024-01-05",
    jobLink: "https://apple.com/careers/job3",
    status: "Phone Screen",
    responseDate: "2024-01-12",
    notes: "Phone screen scheduled for Jan 25th"
  },
  {
    id: "4",
    company: "Amazon",
    jobTitle: "Backend Engineer",
    applicationDate: "2024-01-08",
    jobLink: "https://amazon.com/careers/job4",
    status: "Rejected",
    responseDate: "2024-01-18",
    notes: "Not selected after initial screening"
  },
  {
    id: "5",
    company: "Meta",
    jobTitle: "React Engineer",
    applicationDate: "2024-01-12",
    jobLink: "https://meta.com/careers/job5",
    status: "Offer",
    responseDate: "2024-01-25",
    notes: "Offer received - salary $180k + benefits"
  },
  {
    id: "6",
    company: "Netflix",
    jobTitle: "Senior Software Engineer",
    applicationDate: "2024-01-20",
    jobLink: "https://netflix.com/careers/job6",
    status: "Applied",
    responseDate: "",
    notes: "Premium position, high competition expected"
  },
  {
    id: "7",
    company: "Tesla",
    jobTitle: "Full Stack Engineer",
    applicationDate: "2024-01-18",
    jobLink: "https://tesla.com/careers/job7",
    status: "Interview",
    responseDate: "2024-01-22",
    notes: "System design interview coming up"
  },
  {
    id: "8",
    company: "Stripe",
    jobTitle: "Platform Engineer",
    applicationDate: "2024-01-22",
    jobLink: "https://stripe.com/careers/job8",
    status: "Phone Screen",
    responseDate: "2024-01-28",
    notes: "Initial conversation with recruiter"
  }
]

export const mockEmptyDashboard: JobDashboard[] = []

export const mockSingleEntry: JobDashboard[] = [
  {
    id: "1",
    company: "Example Corp",
    jobTitle: "Developer",
    applicationDate: "2024-01-15",
    jobLink: "https://example.com/job",
    status: "Applied",
    responseDate: "",
    notes: "Test entry"
  }
]
