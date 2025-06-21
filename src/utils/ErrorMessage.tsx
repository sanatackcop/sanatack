import { Search } from "lucide-react";
import React from "react";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ShowErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  // onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
        <Search className="w-10 h-10 text-slate-400 dark:text-slate-500" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
        لم يتم العثور على دورات
      </h3>
      <p className="text-slate-600 dark:text-slate-400 text-center max-w-md">
        {message}{" "}
      </p>
      {/* <button
        onClick={() => {
          setSearchQuery("");
          setSelectedFilter("all");
        }}
        className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
      >
        إعادة تعيين البحث
      </button> */}
    </div>
  );
};

export default ShowErrorMessage;
