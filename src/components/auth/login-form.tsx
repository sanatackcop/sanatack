import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GoogleIcon from "@/assets/google.svg";
import { z } from "zod";
import { LoginformSchema } from "../utiles";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Link } from "react-router-dom";
import { loginApi, LoginResult } from "@/utils/_apis/auth-apis";
import { useNavigate } from "react-router-dom";
import UserContext, { ContextType } from "@/context/UserContext";
import { useContext } from "react";

export function LoginForm() {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const login = userContext?.login;

  const onSubmit = async (values: z.infer<typeof LoginformSchema>) => {
    try {
      const result = (await loginApi({
        email: values.email,
        password: values.password,
      })) as unknown as LoginResult;
      if (result && login) {
        login({
          role: result.role,
          type: result.type as ContextType,
          user: result.user,
          refresh_token: result.refresh_token,
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const form = useForm<z.infer<typeof LoginformSchema>>({
    resolver: zodResolver(LoginformSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <>
      <div className="flex flex-col items-center gap-2 text-center mb-5">
        <h1 className="text-2xl font-bold text-black dark:text-white">تسجيل الدخول إلى حسابك</h1>
        <p className="text-balance text-sm text-muted-foreground text-black dark:text-white">
          أدخل بريدك الإلكتروني أدناه لتسجيل الدخول إلى حسابك
        </p>
      </div>
      <Form {...form}>
        <form
          className="flex flex-col gap-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col space-y-10">
                    <div className="relative text-right items-center space-x-4 text-black dark:text-white">
                      <FormLabel htmlFor="email">البريد الإلكتروني</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col space-y-10 text-black dark:text-white">
                    <div className="relative text-right items-center space-x-4">
                      <FormLabel htmlFor="password">كلمة المرور</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center text-black dark:text-white">
              <a
                href="#"
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                هل نسيت كلمة المرور؟
              </a>
            </div>

            <Button type="submit" className="w-full mt-2">
              تسجيل الدخول
            </Button>
            <span className="relative mt-3 mb-3 z-10 bg-background px-2 text-muted-foreground text-center text-black dark:text-white">
              أو المتابعة باستخدام
            </span>
            <Button variant="outline" className="w-full text-black dark:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                  fill="currentColor"
                />
              </svg>
              تسجيل الدخول باستخدام GitHub
            </Button>
            <Button
              variant="outline"
              className="w-full !bg-white text-black hover:!text-gray-500"
            >
              <img
                src={String(GoogleIcon)}
                alt="google icon"
                className="h-5 w-5"
              />
              تسجيل الدخول باستخدام Google
            </Button>
          </div>
          <div className="text-center text-sm flex items-center justify-center gap-2 text-black dark:text-white">
            <p>هل ليس لديك حساب؟</p>
            <a href="#" className="underline underline-offset-4">
              <Link key={"no account"} to={"/singup"}>
                إنشاء حساب
              </Link>
            </a>
          </div>
        </form>
      </Form>
    </>
  );
}
