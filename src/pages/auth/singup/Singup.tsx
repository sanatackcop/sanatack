import { useRef, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import LogoLight from "@/assets/logo.svg";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import Storage from "@/lib/Storage";
import UserContext from "@/context/UserContext";
import {
  sendEmailOtpApi,
  signupApi,
  verifyOtpApi,
} from "@/utils/_apis/auth-apis";
import { Input } from "@/components/ui/input";

const SignupFormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type SignupFormData = z.infer<typeof SignupFormSchema>;

const Signup = () => {
  const navigate = useNavigate();
  const formRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));

  const userContext = useContext(UserContext);
  const auth = userContext?.auth;
  const login = userContext?.login;

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () =>
      window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignupFormData) => {
    setError(null);
    try {
      const result = await signupApi({
        first_name: values.first_name,
        last_name: values.last_name,
        phone: values.phone,
        email: values.email,
        password: values.password,
      });
      if (result && login) {
        login({
          role: result.role,
          type: result.type,
          user: result.user,
          refresh_token: result.refresh_token,
        });
        setStep(1);
        await sendEmailOtp();
      }
    } catch (err) {
      console.error("Signup failed", err);
      setError("Signup failed. Please try again.");
    }
  };

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const verifyOtp = async () => {
    try {
      const result = await verifyOtpApi({
        otp: otp.join(""),
        user_id: auth!.user.id,
      });
      if (result.isVerify === true) {
        setMessage("Verify Successfully.");
        const authStorage = Storage.get("auth");
        if (authStorage && authStorage.user) {
          authStorage.user.isVerify = true;
          Storage.set("auth", authStorage);
        }
        navigate("/dashboard");
      } else {
        setMessage("OTP verification failed. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred during OTP verification.");
    }
  };

  const sendEmailOtp = async () => {
    try {
      const result = await sendEmailOtpApi({
        user_id: auth!.user.id,
        email: auth!.user.email,
      });
      if (result) {
        setMessage("OTP has been sent to your email.");
      } else {
        setMessage("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred while sending OTP.");
    }
  };

  const renderSignupForm = () => (
    <div className="w-full max-w-xs">
      <h1 className="text-2xl font-bold text-center mb-4">إنشاء حساب جديد</h1>
      <p className="text-sm text-center text-muted-foreground mb-6">
        أدخل التفاصيل أدناه لإنشاء حساب جديد
      </p>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}
      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="first_name">الاسم الأول</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="last_name">اسم العائلة</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="phone">رقم الهاتف</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="password">كلمة المرور</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            className="w-full py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-indigo-700"
          >
            التالي
          </Button>
        </form>
      </Form>
    </div>
  );

  const renderOTPVerification = () => (
    <div className="flex flex-col items-center justify-center p-6">
      <h2 className="text-3xl font-extrabold text-center text-white mb-8">
        OTP Verification
      </h2>
      <p className="text-white mb-4">{message}</p>
      <div className="w-full max-w-md p-6 flex flex-col items-center justify-center rounded-lg shadow-md">
        <InputOTP
          maxLength={6}
          value={otp.join("")}
          onChange={(val: string) => setOtp(val.split(""))}
        >
          <InputOTPGroup className="flex justify-center gap-2">
            {[0, 1, 2].map((index) => (
              <InputOTPSlot
                key={index}
                index={index}
                defaultValue={otp[index]}
                className="w-12 h-12 border border-gray-300 rounded-md text-center text-xl font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e: any) => handleInputChange(index, e.value)}
              />
            ))}
          </InputOTPGroup>
          <InputOTPSeparator className="mx-4 text-white text-lg">
            -
          </InputOTPSeparator>
          <InputOTPGroup className="flex justify-center gap-2">
            {[3, 4, 5].map((index) => (
              <InputOTPSlot
                key={index}
                index={index}
                defaultValue={otp[index]}
                className="w-12 h-12 border border-gray-300 rounded-md text-center text-xl font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e: any) => handleInputChange(index, e.value)}
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>
      <div className="flex gap-4 mt-4">
        <Button
          onClick={verifyOtp}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Verify OTP
        </Button>
        <Button
          onClick={sendEmailOtp}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Resend OTP
        </Button>
      </div>
    </div>
  );

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex items-center justify-center rounded-md bg-primary text-primary-foreground">
              <img
                className="w-[120px] md:w-[180px] cursor-pointer"
                src={String(LogoLight)}
                alt="logo"
              />
            </div>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center" ref={formRef}>
          {step === 0 ? renderSignupForm() : renderOTPVerification()}
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="https://img.freepik.com/free-vector/blue-gradient-background-limbo-studio-setup_107791-32108.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default Signup;
