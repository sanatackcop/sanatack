// import React, { useState } from "react";
// import {
//   InputOTP,
//   InputOTPSeparator,
// } from "@/components/ui/input-otp";

// const VerifyOTP: React.FC = () => {
//   const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
//   const [isVerified, setIsVerified] = useState<boolean>(false);
//   const [message, setMessage] = useState<string>("");

//   const handleInputChange = (index: number, value: string): void => {
//     if (value.length > 1) return; // Allow only single character per input
//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);
//   };

//   const verifyOtp = (): void => {
//     const enteredOtp = otp.join("");
//     const expectedOtp = "123456"; // Replace with actual OTP verification logic

//     if (enteredOtp === expectedOtp) {
//       setIsVerified(true);
//       setMessage("OTP Verified Successfully!");
//     } else {
//       setMessage("Invalid OTP. Please try again.");
//     }
//   };

//   const handleCreateAccount = (): void => {
//     if (isVerified) {
//       setMessage("Account created successfully!");
//     } else {
//       setMessage("Please verify your OTP first.");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center  p-6">
//       <h2 className="text-3xl font-extrabold text-center text-white mb-8">
//         OTP Verification
//       </h2>
//       <div className="w-full max-w-md p-6 rounded-lg shadow-md">
//         <InputOTP maxLength={6}>
//           {/* <InputOTPGroup className="flex justify-center gap-2">
//             {[0, 1, 2].map((index) => (
//               <InputOTPSlot
//                 key={index}
//                 index={index}
//                 value={otp[index]}
//                 className="w-12 h-12 border border-gray-300
//                  rounded-md text-center text-xl font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 onChange={(e:any) => handleInputChange(index, e)}
//               />
//             ))}
//           </InputOTPGroup> */}
//           <InputOTPSeparator className="mx-4 text-white text-lg">-</InputOTPSeparator>
//           {/* <InputOTPGroup className="flex justify-center gap-2">
//             {[3, 4, 5].map((index) => (
//               <InputOTPSlot
//                 key={index}
//                 index={index}
//                 value={otp[index]}
//                 className="w-12 h-12 border border-gray-300 
//                 rounded-md text-center text-xl font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 onChange={(e) => handleInputChange(index, e.target.value)}
//               />
//             ))}
//           </InputOTPGroup> */}
//         </InputOTP>

//       </div>
//     </div>
//   );
// };

// export default VerifyOTP;
