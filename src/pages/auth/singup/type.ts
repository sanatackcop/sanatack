import * as z from "zod";

export interface Step {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

export interface UserOption {
  key: string;
  icon: React.ComponentType<any>;
  title: string;
  desc: string;
}

export interface Feature {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
}

export interface Stat {
  number: string;
  label: string;
}

export const SignupFormSchema = z.object({
  first_name: z.string().min(1, "الاسم الأول مطلوب"),
  last_name: z.string().min(1, "اسم العائلة مطلوب"),
  phone: z.string().min(1, "رقم الهاتف مطلوب"),
  email: z.string().email("بريد إلكتروني غير صحيح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export type SignupFormData = z.infer<typeof SignupFormSchema>;



export const interests: string[] = [
    "البرمجة",
    "علوم البيانات",
    "التكنولوجيا",
    "التطوير الذاتي",
    "الكتابة",
    "العلاقات",
    "التعلم الآلي",
    "الإنتاجية",
    "السياسة",
    "العملات المشفرة",
    "علم النفس",
    "المال",
    "الأعمال",
    "بايثون",
    "الصحة",
    "العلوم",
    "الصحة النفسية",
    "الحياة",
    "تطوير البرمجيات",
    "الشركات الناشئة",
    "التصميم",
    "جافا سكريبت",
    "الذكاء الاصطناعي",
    "الثقافة",
    "هندسة البرمجيات",
    "البلوك تشين",
    "الترميز",
    "ريادة الأعمال",
    "ريأكت",
    "تجربة المستخدم",
    "التعليم",
    "التاريخ",
    "الفكاهة",
    "تطوير الويب",
    "العمل",
    "نمط الحياة",
    "المجتمع",
    "التعلم العميق",
    "التسويق",
    "الكتب",
    "الرياضة",
    "الموسيقى",
    "السفر",
    "الطبخ",
    "التصوير",
  ];