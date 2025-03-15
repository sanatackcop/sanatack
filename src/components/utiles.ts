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
