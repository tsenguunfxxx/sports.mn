import type {
  AppUser, Sport, Training, Registration, Payment, AppNotification,
} from "@/types";
import type {
  ProfileRow, SportRow, TrainingRow, RegistrationRow, PaymentRow, NotificationRow,
} from "@/lib/supabase/types";

const ms = (iso: string) => new Date(iso).getTime();

export function mapUser(r: ProfileRow): AppUser {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone ?? "",
    role: r.role,
    profileImage: r.profile_image ?? "",
    blocked: r.blocked,
    createdAt: ms(r.created_at),
  };
}

export function mapSport(r: SportRow): Sport {
  return {
    id: r.id,
    name: r.name,
    icon: r.icon,
    image: r.image ?? "",
    description: r.description,
    active: r.active,
    createdAt: ms(r.created_at),
  };
}

export function mapTraining(r: TrainingRow): Training {
  return {
    id: r.id,
    sportId: r.sport_id,
    title: r.title,
    description: r.description,
    coachName: r.coach_name,
    coachImage: r.coach_image ?? "",
    location: r.location,
    schedule: r.schedule,
    duration: r.duration,
    ageGroup: r.age_group,
    skillLevel: r.skill_level,
    capacity: r.capacity,
    currentParticipants: r.current_participants,
    price: Number(r.price),
    image: r.image ?? "",
    active: r.active,
    createdAt: ms(r.created_at),
  };
}

export function mapRegistration(r: RegistrationRow): Registration {
  return {
    id: r.id,
    userId: r.user_id,
    trainingId: r.training_id,
    status: r.status,
    paymentStatus: r.payment_status,
    registrationDate: ms(r.registration_date),
    trainingTitle: r.training_title ?? undefined,
    trainingImage: r.training_image ?? undefined,
    price: r.price != null ? Number(r.price) : undefined,
    userName: r.user_name ?? undefined,
    userEmail: r.user_email ?? undefined,
  };
}

export function mapPayment(r: PaymentRow): Payment {
  return {
    id: r.id,
    userId: r.user_id,
    trainingId: r.training_id,
    registrationId: r.registration_id,
    amount: Number(r.amount),
    paymentMethod: r.payment_method,
    paymentStatus: r.payment_status,
    transactionId: r.transaction_id,
    createdAt: ms(r.created_at),
    trainingTitle: r.training_title ?? undefined,
    userName: r.user_name ?? undefined,
  };
}

export function mapNotification(r: NotificationRow): AppNotification {
  return {
    id: r.id,
    userId: r.user_id,
    title: r.title,
    message: r.message,
    read: r.read,
    type: r.type,
    createdAt: ms(r.created_at),
  };
}
