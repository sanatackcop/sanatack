import AppLayout from "@/components/layout/Applayout";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <AppLayout navbar={<Navbar />}>
      <div className="flex items-center justify-center mt-20">
        <div
          className="w-full max-w-md p-8 
        border-opacity-20 rounded-md 
   bg-gradient-to-r  text-white
  overflow-hidden transition-transform transform "
        >
          <h1
            className="text-3xl
           font-bold text-center dark:text-white  mb-6"
          >
            تسجيل الدخول
          </h1>
          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="أدخل بريدك الإلكتروني"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium "
              >
                كلمة المرور
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="أدخل كلمة المرور"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              تسجيل الدخول
            </button>
          </form>
          <p className="mt-4 text-center text-gray-600">
            ليس لديك حساب؟{" "}
            <Link
              key={"item.title"}
              to={"/singup"}
              className="text-indigo-600 hover:underline hover:text-indigo-800"
            >
              أنشئ حسابًا جديدًا
            </Link>
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Login;
