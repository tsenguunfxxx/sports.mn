export type UserRole = "user" | "admin";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  profileImage?: string;
  blocked?: boolean;
  createdAt: number;
}

export interface Sport {
  id: string;
  name: string;
  icon: string;
  image: string;
  description: string;
  active: boolean;
  createdAt: number;
}

export type SkillLevel = "beginner" | "intermediate" | "advanced" | "all";

export interface Training {
  id: string;
  sportId: string;
  title: string;
  description: string;
  coachName: string;
  coachImage?: string;
  location: string;
  schedule: string;
  duration: string;
  ageGroup: string;
  skillLevel: SkillLevel;
  capacity: number;
  currentParticipants: number;
  price: number;
  image: string;
  active: boolean;
  createdAt: number;
}

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type RegistrationStatus = "pending" | "approved" | "cancelled";

export interface Registration {
  id: string;
  userId: string;
  trainingId: string;
  status: RegistrationStatus;
  paymentStatus: PaymentStatus;
  registrationDate: number;
  trainingTitle?: string;
  trainingImage?: string;
  price?: number;
  userName?: string;
  userEmail?: string;
}

export type PaymentMethod = "card" | "qpay" | "bank";

export interface Payment {
  id: string;
  userId: string;
  trainingId: string;
  registrationId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId: string;
  createdAt: number;
  trainingTitle?: string;
  userName?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  type: "info" | "success" | "warning";
  createdAt: number;
}

export interface TrainingFilters {
  sportId?: string;
  search?: string;
  location?: string;
  coach?: string;
  minPrice?: number;
  maxPrice?: number;
  skillLevel?: SkillLevel;
}
