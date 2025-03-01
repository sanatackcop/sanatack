import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Preference from "./Preference";

const Signup = () => {
  const designRef = useRef(null);
  const formRef = useRef(null);
  const [next, setNext] = useState(0);
  const [error, setError] = useState("");

  // useEffect(() => {
  //   gsap.fromTo(
  //     designRef.current,
  //     { x: -100, opacity: 0 },
  //     { x: 0, opacity: 1, duration: 1.2,  }
  //   );
  //   gsap.fromTo(
  //     formRef.current,
  //     { x: 200, opacity: 0 },
  //     { x: 0, opacity: 1, duration: 1.2,  }
  //   );
  // }, []);

  const validateSignupForm = () => {
    return true;
  };

  const validatePreference = () => {
    return true;
  };

  // const validateOTP = () => {
  //   // send api
  //   return true;
  // };

  const components = [
    { component: <SignupForm />, validator: validateSignupForm },
    { component: <Preference />, validator: validatePreference },
    // { component: <VerifyOTP />, validator: validateOTP },
  ];

  const handleNext = () => {
    setError(""); // Clear previous errors
    const isValid = components[next]?.validator();

    if (isValid && next < components.length - 1) {
      setNext((prev) => prev + 1);
    }
  };

  return (
    <div className="grid grid-cols-2 h-screen">
      {/* Right Section: Form */}
      <div
        ref={formRef}
        className="flex items-center justify-center bg-[#0C0C0C] h-full"
      >
        {/* <WhatPageTracker total={components.length} curr={next} /> */}
        <div className="w-full max-w-md pt-3 rounded-md shadow-md">
          {components[next]?.component}
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={handleNext}
              className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {next === components.length - 1 ? "انشاء الحساب" : "التالي"}
            </button>
          </div>
          {next === 0 && (
            <p className="mt-4 text-center text-gray-600">
              ليس لديك حساب؟{" "}
              <Link
                to="/login"
                className="text-indigo-600
                 hover:underline hover:text-indigo-800"
              >
                لديك حسابًا
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* Left Section: Design */}
      <div
        ref={designRef}
        className="flex items-center justify-center bg-gradient-to-br
         from-zinc-500 to-zinc-500 text-white h-full"
      ></div>
    </div>
  );
};

export default Signup;

const SignupForm = () => {
  return (
    <>
      <h1 className="text-3xl font-bold text-center text-white mb-6">
        إنشاء حساب جديد
      </h1>
      <form className="space-y-6" id="signup-form">
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
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
            className="block mb-2 text-sm font-medium text-gray-700"
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

        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            DATE OF BERTH{" "}
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

        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            fULL NAEME{" "}
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
      </form>
    </>
  );
};

// const WhatPageTracker = (total: number, curr: any) => {
//   return (
//     <>
//       {
//         // Array.from({ length: total }).map((_, index) => ()}
//       }
//     </>
//   );
// };
