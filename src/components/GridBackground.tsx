import React from "react";

const GridBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-screen bg-black overflow-hidden z-0">
      {/* Grid squares */}
      <div className="grid grid-cols-12 grid-rows-12 w-full h-full p-4 gap-0 relative">
        {Array.from({ length: 30 * 2 }).map((_, index) => (
          <div
            key={index}
            className="relative w-20 h-20 sm:h-14 md:h-16 lg:h-20 bg-transparent border border-gray-800
              transition-all duration-300 
              before:absolute before:inset-0 before:bg-gradient-to-tr before:from-gray-900 before:to-gray-800 
              before:opacity-20 before:blur-md 
              hover:before:opacity-40 hover:before:blur-lg
              after:absolute after:w-2 after:h-2 after:bg-gray-400 after:rounded-full
              after:opacity-0 after:transition-opacity after:duration-500
              hover:scale-110 hover:shadow-lg hover:shadow-gray-800 
              hover:after:opacity-100 hover:after:scale-150"
          />
        ))}
      </div>
    </div>
  );
};

export default GridBackground;
