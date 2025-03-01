import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { ArrowDown, ArrowUp, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";

export default function AdHero() {
  const [rounded, setRounded] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRounded(false);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className=" relative w-full h-auto">
      <div
        className="absolute inset-0 w-full  blur-md bg-gradient-to-r
          from-gray-700 via-blue-600 to-gray-600 opacity-50"
      ></div>

      {/* Card */}
      <Card
        className="relative z-10 rounded-md border border-opacity-20
          bg-gradient-to-r from-black to-gray-900 mb-10 
          cursor-pointer overflow-hidden transform transition-transform"
      >
        {/* Image Section */}
        <div className="relative h-full">
          <img
            src="https://via.placeholder.com/600x400"
            alt="Article Thumbnail"
            className={`absolute inset-0 w-full h-full object-cover transition-all ${
              rounded ? "rounded-lg" : ""
            }`}
          />
        </div>

        {/* Content Section */}
        <div>
          <CardHeader className="p-4 text-white">
            {/* User Info */}
            <div className="flex items-center gap-2 mb-4">
              <Avatar>
                {/* <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" /> */}
                <AvatarFallback>OZ</AvatarFallback>
              </Avatar>
              <p className="text-white font-medium">User Name</p>
            </div>

            {/* Title and Description */}
            <CardTitle className="text-lg font-bold text-white">
              Article Title
            </CardTitle>
            <CardDescription className="text-sm text-gray-400">
              A short description of the article goes here to provide context.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 text-gray-300">
            {/* Additional Content (Optional) */}
            <p>
              This is a placeholder for additional content or a brief excerpt of
              the article. It provides more details to entice readers to click.
            </p>
          </CardContent>

          <CardFooter className="flex flex-col md:flex-row items-center justify-between p-4">
            {/* Stats */}
            <div className="flex items-center gap-4 text-gray-400 text-sm">
              <div className="flex items-center gap-1">
                <span>100,100</span>
                <ArrowUp size={16} className="text-green-400" />
              </div>
              <div className="flex items-center gap-1">
                <span>12,21</span>
                <ArrowDown size={16} className="text-red-400" />
              </div>
              <div className="flex items-center gap-1">
                <span>231</span>
                <MessageCircle size={16} />
              </div>
            </div>

            {/* Button */}
            <Button
              className="mt-4 md:mt-0 text-sm font-semibold px-4 py-2 text-white 
                bg-blue-600 hover:bg-blue-500 transition"
            >
              اقرأ المزيد
            </Button>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
}
