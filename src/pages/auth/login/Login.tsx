import React from "react";
import Navbar from "@/components/Navbar";
import { LoginForm } from "@/components/auth/login-form";

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b]">
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <Navbar />
      </div>

      <div className="pt-16 min-h-screen">
        <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-1">
          <div className="flex flex-col justify-center items-center p-6 lg:p-8">
            <div className="w-full max-w-md">
              <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-zinc-700">
                <LoginForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
