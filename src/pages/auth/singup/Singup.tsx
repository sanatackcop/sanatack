import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";
import { Loader2, Mail, Lock, User, LogIn } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth, googleProvider } from "@/lib/firebase";
import { toast } from "sonner";
import { useUserContext } from "@/context/UserContext";
import { firebaseSignInApi, LoginResult } from "@/utils/_apis/auth-apis";

const signupSchema = z.object({
  fullName: z
    .string()
    .min(2, "الاسم يجب أن يحتوي على حرفين على الأقل")
    .max(60, "الاسم طويل للغاية"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

type SignupValues = z.infer<typeof signupSchema>;

const errorMessages: Record<string, string> = {
  "auth/email-already-in-use":
    "هذا البريد مسجّل بالفعل. حاول تسجيل الدخول بدلاً من ذلك.",
  "auth/invalid-email": "البريد الإلكتروني غير صالح.",
  "auth/operation-not-allowed":
    "التسجيل بالبريد الإلكتروني غير مفعّل لهذا المشروع.",
  "auth/weak-password": "كلمة المرور ضعيفة. جرّب كلمة أقوى.",
  "auth/popup-closed-by-user": "تم إغلاق النافذة قبل إكمال العملية.",
};

const SignupPage = () => {
  const navigate = useNavigate();
  const { login } = useUserContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
  });

  const mapFirebaseError = (code?: string) => {
    if (!code) return "حدث خطأ غير متوقع. حاول مرة أخرى.";
    return errorMessages[code] || "تعذر إكمال العملية حالياً. حاول مرة أخرى.";
  };

  const persistSession = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser || !login) return;

    const idToken = await currentUser.getIdToken(true);

    if (!currentUser.email) {
      throw new Error("لا يوجد بريد إلكتروني مرتبط بحساب Google.");
    }

    const nameParts =
      currentUser.displayName
        ?.split(" ")
        .map((part) => part.trim())
        .filter(Boolean) ?? [];
    const [firstName, ...rest] = nameParts;

    const backendAuth: LoginResult = await firebaseSignInApi({
      uid: currentUser.uid,
      email: currentUser.email,
      displayName: currentUser.displayName ?? undefined,
      firstName: firstName || undefined,
      lastName: rest.length ? rest.join(" ") : undefined,
      phoneNumber: currentUser.phoneNumber ?? undefined,
      emailVerified: currentUser.emailVerified,
      idToken,
    });

    login({
      role: backendAuth.role,
      type: backendAuth.type,
      user: backendAuth.user,
      refresh_token: backendAuth.refresh_token,
    });
  };

  const handleEmailSignup = async (values: SignupValues) => {
    setIsSubmitting(true);
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      if (values.fullName) {
        await updateProfile(credential.user, { displayName: values.fullName });
        await credential.user.reload();
      }

      await persistSession();

      toast.success("تم إنشاء حسابك بنجاح!");
      navigate("/dashboard");
    } catch (error) {
      if (error instanceof FirebaseError) {
        toast.error(mapFirebaseError(error.code));
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("حدث خطأ أثناء إنشاء الحساب.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsSubmitting(true);
    try {
      await signInWithPopup(auth, googleProvider);
      await persistSession();
      toast.success("تم إنشاء الحساب باستخدام Google");
      navigate("/dashboard");
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === "auth/popup-closed-by-user") {
          toast.info(mapFirebaseError(error.code));
        } else {
          toast.error(mapFirebaseError(error.code));
        }
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("تعذر تسجيل الدخول باستخدام Google.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="">
      <Navbar />
      <main className="mx-auto flex w-full flex-col dark:bg-[#09090b] h-screen justify-center items-center backdrop-blur-sm bg-white/80">
        <section
          className="w-full max-w-xl rounded-3xl border border-gray-200 
        bg-white p-8 shadow-xl dark:border-gray-800 dark:bg-gray-900 lg:p-10"
        >
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              أنشئ حسابك بسهولة
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              بضع خطوات فقط وتصبح جاهزاً للانطلاق في رحلتك التعليمية.
            </p>
          </header>

          <form
            className="space-y-5"
            onSubmit={handleSubmit(handleEmailSignup)}
          >
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                <User className="h-4 w-4" />
                الاسم الكامل
              </label>
              <Input
                autoComplete="name"
                placeholder="مثال: أحمد علي"
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="text-xs text-red-500">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                <Mail className="h-4 w-4" />
                البريد الإلكتروني
              </label>
              <Input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                <Lock className="h-4 w-4" />
                كلمة المرور
              </label>
              <Input
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="mt-6 w-full rounded-xl bg-gray-900 py-6 text-base font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  جاري إنشاء الحساب
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <LogIn className="h-4 w-4" />
                  إنشاء حساب
                </span>
              )}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-4 text-xs font-medium uppercase text-gray-500 before:h-px before:flex-1 before:bg-gray-200 after:h-px after:flex-1 after:bg-gray-200 dark:text-gray-400 dark:before:bg-gray-800 dark:after:bg-gray-800">
            أو
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full rounded-xl border-gray-300 py-6 text-base font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            onClick={handleGoogleSignup}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                جاري المعالجة
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="h-5 w-5"
                />
                المتابعة باستخدام Google
              </span>
            )}
          </Button>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            لديك حساب بالفعل؟
            <Button
              type="button"
              variant="link"
              className="px-1 text-sm font-semibold text-gray-900 underline-offset-4 hover:underline dark:text-white"
              onClick={() => navigate("/login")}
            >
              تسجيل الدخول
            </Button>
          </p>
        </section>
      </main>
    </div>
  );
};

export default SignupPage;
