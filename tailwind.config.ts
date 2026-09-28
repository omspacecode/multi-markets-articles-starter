import type { Config } from "tailwindcss";

export default {
  content: ["./client/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Geist", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ['"Instrument Serif"', "ui-serif", "Georgia", "serif"],
        mono: ['"Geist Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        pine: {
          50: "#EEF6F2",
          100: "#D6EBE2",
          200: "#AAD4C3",
          300: "#77B7A0",
          400: "#3F917A",
          500: "#1D715D",
          600: "#115C4C",
          700: "#0F4C3F",
          800: "#0B3A30",
          900: "#072821",
        },
        coral: {
          50: "#FFF2ED",
          100: "#FFE2D8",
          200: "#FFC3B0",
          300: "#FF9C80",
          400: "#FF7753",
          500: "#FF5C39",
          600: "#E84523",
          700: "#C2351A",
        },
        sand: {
          50: "#FCFBF8",
          100: "#F7F4EE",
          200: "#EFEAE0",
          300: "#E3DCCD",
          400: "#CEC4B0",
          500: "#A89B82",
        },
        ink: {
          DEFAULT: "#16181D",
          700: "#2B2E35",
          600: "#3A3D45",
          500: "#5B5E66",
          400: "#8A8C93",
          300: "#B7B8BD",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(22, 24, 29, 0.04), 0 10px 28px -14px rgba(22, 24, 29, 0.16)",
        lift: "0 2px 6px rgba(22, 24, 29, 0.05), 0 28px 56px -28px rgba(22, 24, 29, 0.32)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "live-ping": {
          "0%": { transform: "scale(1)", opacity: "0.55" },
          "80%, 100%": { transform: "scale(2.4)", opacity: "0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both",
        "live-ping": "live-ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
