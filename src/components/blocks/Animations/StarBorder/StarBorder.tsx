/*
  jsrepo 1.41.3
  Installed from [https://reactbits.dev/ts/tailwind/](https://reactbits.dev/ts/tailwind/)
  3-4-2025
*/

import React from "react";

type StarBorderProps<T extends React.ElementType> =
  React.ComponentPropsWithoutRef<T> & {
    as?: T;
    className?: string;
    children?: React.ReactNode;
    color?: string;
    speed?: React.CSSProperties["animationDuration"];
    inputClassName?: string;
    size?: "sm" | "md" | "lg";
  };

const StarBorder = <T extends React.ElementType = "button">({
  as,
  className = "",
  inputClassName = "",
  color = "white",
  speed = "6s",
  size = "md",
  children,
  ...rest
}: StarBorderProps<T>) => {
  const Component = as || "button";

  // Size variants
  const sizeClasses = {
    sm: "text-sm py-2 px-4",
    md: "text-base py-3 px-6",
    lg: "text-lg py-4 px-8",
  };

  return (
    <Component
      className={`relative inline-block py-[1px] overflow-hidden rounded-xl ${className}`}
      {...rest}
    >
      <div
        className="absolute w-[300%] h-[50%] opacity-70 bottom-[-11px] right-[-250%] rounded-xl animate-star-movement-bottom z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      ></div>
      <div
        className="absolute w-[300%] h-[50%] opacity-70 top-[-10px] left-[-250%] rounded-xl animate-star-movement-top z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      ></div>
      <div
        className={`relative z-1  
        text-white text-center rounded-xl ${sizeClasses[size]} ${inputClassName}`}
      >
        {children}
      </div>
    </Component>
  );
};

export default StarBorder;
