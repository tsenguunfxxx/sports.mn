import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Зөв и-мэйл оруулна уу"),
  password: z.string().min(6, "Нууц үг доод тал нь 6 тэмдэгт"),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, "Нэрээ оруулна уу"),
    email: z.string().email("Зөв и-мэйл оруулна уу"),
    phone: z.string().regex(/^\d{8}$/, "8 оронтой утасны дугаар"),
    password: z.string().min(6, "Нууц үг доод тал нь 6 тэмдэгт"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Нууц үг таарахгүй байна",
    path: ["confirmPassword"],
  });
export type RegisterValues = z.infer<typeof registerSchema>;

export const forgotSchema = z.object({
  email: z.string().email("Зөв и-мэйл оруулна уу"),
});
export type ForgotValues = z.infer<typeof forgotSchema>;

export const profileSchema = z.object({
  name: z.string().min(2, "Нэрээ оруулна уу"),
  phone: z.string().regex(/^\d{8}$/, "8 оронтой утасны дугаар"),
});
export type ProfileValues = z.infer<typeof profileSchema>;

export const sportSchema = z.object({
  name: z.string().min(2, "Нэр оруулна уу"),
  icon: z.string().min(1, "Icon нэр оруулна уу"),
  description: z.string().min(5, "Тайлбар оруулна уу"),
  image: z.string().url("Зураг URL").or(z.literal("")),
  active: z.boolean().default(true),
});
export type SportValues = z.infer<typeof sportSchema>;

export const trainingSchema = z.object({
  sportId: z.string().min(1, "Спорт сонгоно уу"),
  title: z.string().min(3, "Гарчиг оруулна уу"),
  description: z.string().min(10, "Тайлбар оруулна уу"),
  coachName: z.string().min(2, "Дасгалжуулагчийн нэр"),
  coachImage: z.string().url().or(z.literal("")).optional(),
  location: z.string().min(2, "Байршил оруулна уу"),
  schedule: z.string().min(2, "Хуваарь оруулна уу"),
  duration: z.string().min(1, "Үргэлжлэх хугацаа"),
  ageGroup: z.string().min(1, "Насны бүлэг"),
  skillLevel: z.enum(["beginner", "intermediate", "advanced", "all"]),
  capacity: z.coerce.number().int().min(1, "Багтаамж 1-ээс их"),
  price: z.coerce.number().min(0, "Үнэ 0-ээс их"),
  image: z.string().url("Зураг URL").or(z.literal("")),
  active: z.boolean().default(true),
});
export type TrainingValues = z.infer<typeof trainingSchema>;

export const paymentSchema = z.object({
  cardNumber: z
    .string()
    .transform((v) => v.replace(/\s+/g, ""))
    .pipe(z.string().regex(/^\d{16}$/, "16 оронтой картын дугаар")),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "ММ/ГГ форматтай"),
  cvv: z.string().regex(/^\d{3,4}$/, "3-4 оронтой CVV"),
  cardName: z.string().min(2, "Карт эзэмшигчийн нэр"),
});
export type PaymentValues = z.infer<typeof paymentSchema>;
