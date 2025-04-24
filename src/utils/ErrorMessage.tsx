import React from "react";

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

const ShowErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
}) => {
  return (
    <div className="my-20 py-10 text-center bg-[#111111] text-white border-[#282D3D] rounded-md m-4">
      {message}
      <div>
        {" "}
        <button onClick={onRetry} className="ml-2 text-white-500 underline">
          إعادة المحاولة
        </button>
      </div>
    </div>
  );
};

export default ShowErrorMessage;
