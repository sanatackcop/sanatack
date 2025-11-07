import { z } from "zod";

export const LoginformSchema = z.object({
  password: z
    .string()
    .min(8, { message: "يجب أن تكون كلمة المرور 8 أحرف على الأقل." })
    .regex(/[A-Z]/, {
      message: "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل.",
    })
    .regex(/[a-z]/, {
      message: "يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل.",
    })
    .regex(/[0-9]/, {
      message: "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل.",
    })
    .regex(/[^a-zA-Z0-9]/, {
      message: "يجب أن تحتوي كلمة المرور على رمز خاص واحد على الأقل.",
    }),
  email: z
    .string()
    .email({ message: "البريد الإلكتروني غير صالح." })
    .min(5, { message: "يجب أن يكون البريد الإلكتروني 5 أحرف على الأقل." }),
});

export const SignupFormSchema = z.object({
  first_name: z
    .string()
    .min(3, { message: "يجب أن يكون الاسم 3 أحرف على الأقل." })
    .max(50, { message: "يجب ألا يتجاوز الاسم 50 حرفًا." }),
  last_name: z
    .string()
    .min(3, { message: "يجب أن يكون الاسم 3 أحرف على الأقل." })
    .max(50, { message: "يجب ألا يتجاوز الاسم 50 حرفًا." }),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, {
    message: "يجب أن يكون رقم الهاتف صالحًا ويحتوي على 10-15 رقمًا فقط.",
  }),
  email: z
    .string()
    .email({ message: "البريد الإلكتروني غير صالح." })
    .min(5, { message: "يجب أن يكون البريد الإلكتروني 5 أحرف على الأقل." }),
  password: z
    .string()
    .min(8, { message: "يجب أن تكون كلمة المرور 8 أحرف على الأقل." })
    .regex(/[A-Z]/, {
      message: "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل.",
    })
    .regex(/[a-z]/, {
      message: "يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل.",
    })
    .regex(/[0-9]/, {
      message: "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل.",
    })
    .regex(/[^a-zA-Z0-9]/, {
      message: "يجب أن تحتوي كلمة المرور على رمز خاص واحد على الأقل.",
    }),
});

export function formatRelativeDate(
  dateString: string | number | Date,
  lang: "ar" | "en" = "en"
): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = (now.getTime() - date.getTime()) / 1000;

  const minutes = Math.floor(diffInSeconds / 60);
  const hours = Math.floor(diffInSeconds / 3600);
  const days = Math.floor(diffInSeconds / 86400);

  if (diffInSeconds < 60) return lang === "en" ? "just now" : "الآن";

  if (diffInSeconds < 3600) {
    if (lang === "en")
      return `${minutes} ${minutes === 1 ? "minute ago" : "minutes ago"}`;
    else
      return minutes === 1
        ? "منذ دقيقة"
        : minutes === 2
        ? "منذ دقيقتين"
        : minutes < 11
        ? `منذ ${minutes} دقائق`
        : `منذ ${minutes} دقيقة`;
  }

  if (diffInSeconds < 86400) {
    if (lang === "en")
      return `${hours} ${hours === 1 ? "hour ago" : "hours ago"}`;
    else
      return hours === 1
        ? "منذ ساعة"
        : hours === 2
        ? "منذ ساعتين"
        : hours < 11
        ? `منذ ${hours} ساعات`
        : `منذ ${hours} ساعة`;
  }

  if (diffInSeconds < 30 * 86400) {
    if (lang === "en") return `${days} ${days === 1 ? "day ago" : "days ago"}`;
    else
      return days === 1
        ? "منذ يوم"
        : days === 2
        ? "منذ يومين"
        : days < 11
        ? `منذ ${days} أيام`
        : `منذ ${days} يوم`;
  }

  return date.toLocaleDateString(lang === "ar" ? "ar" : "en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
