export type RequestStatus = "draft" | "submitted" | "in_review" | "approved" | "rejected" | "scheduled" | "completed";

export interface Request {
  id: string;
  user_id: string;
  training_id: string;
  session_id?: string;
  status: RequestStatus;
  justification?: string;
  submitted_at?: string;
  created_at: string;
  updated_at: string;
  trainings?: {
    title: string;
    cost?: number;
    category?: string;
  };
  profiles?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  };
  approval_steps?: Array<{
    id: string;
    step_order: number;
    status: string;
    approver_id?: string;
    approved_at?: string;
    comments?: string;
  }>;
}
