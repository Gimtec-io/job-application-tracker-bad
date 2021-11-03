export type ApplicationStatus = {
  // not using specific types for ids
  id: string;
  content: string;
}

export type Comment = {
  id: string;
  content: string;
  createdAt: string;
  applicationId: string;
}

export type Application = {
  id: string;
  company: string;
  position: string;
  link?: string;
  description?: string;
  status: ApplicationStatus;
  createdAt: string;
  comments?: Comment[];
  slug: string;
}