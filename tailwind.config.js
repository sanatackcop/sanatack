/** @type {import('tailwindcss').Config} */

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        rubik: ["Rubik", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      animation: {
        crown: "fade-in 0.7s ease-out",
        leftSquare: "leftSquare 2s ease-in-out infinite",
        rightSquare: "rightSquare 2s ease-in-out infinite",
        shine: "shine 5s linear infinite",
        scroll: "scroll 10s linear infinite",
        "star-movement-bottom":
          "star-movement-bottom linear infinite alternate",
        "star-movement-top": "star-movement-top linear infinite alternate",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        leftSquare: {
          "0%, 100%": {
            transform: "translateX(-40px) rotate(45deg)",
          },
          "50%": {
            transform: "translateX(0) rotate(45deg)",
          },
        },
        rightSquare: {
          "0%, 100%": {
            transform: "translateX(40px) rotate(45deg)",
          },
          "50%": {
            transform: "translateX(0) rotate(45deg)",
          },
        },
        "star-movement-bottom": {
          "0%": {
            transform: "translate(0%, 0%)",
            opacity: "1",
          },
          "100%": {
            transform: "translate(-100%, 0%)",
            opacity: "0",
          },
        },
        "star-movement-top": {
          "0%": {
            transform: "translate(0%, 0%)",
            opacity: "1",
          },
          "100%": {
            transform: "translate(100%, 0%)",
            opacity: "0",
          },
        },
        shine: {
          "0%": {
            "background-position": "100%",
          },
          "100%": {
            "background-position": "-100%",
          },
        },
        scroll: {
          from: {
            transform: "translateX(0%)",
          },
          to: {
            transform: "translateX(100%)",
          },
        },
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
    },
  },

  plugins: [require("tailwindcss-animate")],
};
