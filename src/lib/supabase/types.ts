// Raw row shapes returned by Postgres (snake_case). These are mapped to the
// camelCase domain types in src/lib/mappers.ts.
export interface ProfileRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "user" | "admin";
  profile_image: string | null;
  blocked: boolean;
  created_at: string;
}

export interface SportRow {
  id: string;
  name: string;
  icon: string;
  image: string | null;
  description: string;
  active: boolean;
  created_at: string;
}

export interface TrainingRow {
  id: string;
  sport_id: string;
  title: string;
  description: string;
  coach_name: string;
  coach_image: string | null;
  location: string;
  schedule: string;
  duration: string;
  age_group: string;
  skill_level: "beginner" | "intermediate" | "advanced" | "all";
  capacity: number;
  current_participants: number;
  price: number;
  image: string | null;
  active: boolean;
  created_at: string;
}

export interface RegistrationRow {
  id: string;
  user_id: string;
  training_id: string;
  status: "pending" | "approved" | "cancelled";
  payment_status: "pending" | "paid" | "failed" | "refunded";
  registration_date: string;
  training_title: string | null;
  training_image: string | null;
  price: number | null;
  user_name: string | null;
  user_email: string | null;
}

export interface PaymentRow {
  id: string;
  user_id: string;
  training_id: string;
  registration_id: string;
  amount: number;
  payment_method: "card" | "qpay" | "bank";
  payment_status: "pending" | "paid" | "failed" | "refunded";
  transaction_id: string;
  created_at: string;
  training_title: string | null;
  user_name: string | null;
}

export interface NotificationRow {
  id: string;
  user_id: string;
  title: string;
  message: string;
  read: boolean;
  type: "info" | "success" | "warning";
  created_at: string;
}
