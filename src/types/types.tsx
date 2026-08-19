export type WorkerStatus = "Available" | "Working" | "On Leave";

export type Worker = {
  id: number;
  full_name: string;
  email: string;
  specialty: string;
  project_count: string;
  project: string | null;
  status: WorkerStatus;
  lastActivity: string;
};