import Navbar from "@/components/Navbar";
import { LoginForm } from "@/components/auth/login-form";

const SignupPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      <div
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-zinc-50 via-white to-blue-50
       dark:from-zinc-900 dark:via-zinc-800 dark:to-blue-900/20 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-700"
      >
        <Navbar />
      </div>

      <div className="pt-16 min-h-screen bg-white dark:bg-zinc-900">
        <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-1">
          <div className="flex flex-col justify-center items-center p-6 lg:p-8 bg-white dark:bg-[#09090b]">
            <div className="w-full max-w-md">
              <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 shadow-xl border border-zinc-200 dark:border-zinc-700">
                <LoginForm useSignup />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
