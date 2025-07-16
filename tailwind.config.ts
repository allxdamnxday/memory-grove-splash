import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sage Greens (Core Identity)
        sage: {
          deep: "#5A6051",
          primary: "#7C8471",
          light: "#A4AC96",
          mist: "#E8EDE5",
        },
        // Warm Neutrals (Foundation)
        warm: {
          white: "#FDFCF8",
          sand: "#F4F0E6",
          stone: "#E6E2D6",
          pebble: "#D4CFC0",
          primary: "#D4A574", // Warm earthy orange
          deep: "#B8935F",    // Deeper warm tone
        },
        // Text Colors
        text: {
          primary: "#3A3F36",
          secondary: "#5A5F56",
          light: "#7A7F76",
          tertiary: "#9A9F96",
        },
        // Background Colors
        background: {
          primary: "#FFFFFF",
          secondary: "#F9F8F5",
        },
        // Border Colors
        border: {
          primary: "#E6E2D6",
        },
        // Accent Colors (Use Sparingly)
        accent: {
          moss: "#5F6B3E",
          dawn: "#E8D5B7",
          earth: "#B8A088",
        },
        // Error/Alert Colors (Nature-inspired reds)
        error: {
          primary: "#D4756B", // Soft terracotta red
          deep: "#B85A50",    // Deeper clay red
          light: "#E8A59D",   // Light blush for backgrounds
        },
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "serif"],
        sans: ["Source Sans Pro", "sans-serif"],
        handwritten: ["Amatic SC", "cursive"],
      },
      fontSize: {
        // Display sizes
        "display-lg": ["56px", { lineHeight: "64px", fontWeight: "300" }],
        display: ["48px", { lineHeight: "56px", fontWeight: "300" }],
        "display-sm": ["40px", { lineHeight: "48px", fontWeight: "300" }],
        // Headlines
        h1: ["36px", { lineHeight: "44px", fontWeight: "400" }],
        h2: ["30px", { lineHeight: "38px", fontWeight: "400" }],
        h3: ["24px", { lineHeight: "32px", fontWeight: "400" }],
        // Body
        "body-lg": ["20px", { lineHeight: "32px", fontWeight: "300" }],
        body: ["18px", { lineHeight: "30px", fontWeight: "300" }],
        "body-sm": ["16px", { lineHeight: "26px", fontWeight: "400" }],
        caption: ["14px", { lineHeight: "22px", fontWeight: "400" }],
        // Mobile-specific sizes (1.2x scale)
        "mobile-xs": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "mobile-sm": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "mobile-base": ["20px", { lineHeight: "32px", fontWeight: "300" }],
        "mobile-lg": ["24px", { lineHeight: "36px", fontWeight: "400" }],
        "mobile-heading": ["28px", { lineHeight: "36px", fontWeight: "500" }],
        // Special
        handwritten: ["28px", { lineHeight: "36px", fontWeight: "700" }],
        quote: ["32px", { lineHeight: "40px", fontWeight: "700" }],
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
        "3xl": "64px",
        "4xl": "96px",
      },
      animation: {
        "fade-in": "fadeIn 300ms ease-out",
        "scale-in": "scaleIn 500ms cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-up": "slideUp 500ms cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-down": "slideDown 200ms cubic-bezier(0.4, 0, 0.2, 1)",
        "float": "float 20s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.98)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        float: {
          "0%": { transform: "translateY(0) translateX(0) rotate(0deg)" },
          "25%": { transform: "translateY(100vh) translateX(20px) rotate(90deg)" },
          "50%": { transform: "translateY(50vh) translateX(-20px) rotate(180deg)" },
          "75%": { transform: "translateY(80vh) translateX(40px) rotate(270deg)" },
          "100%": { transform: "translateY(120vh) translateX(0) rotate(360deg)" },
        },
      },
      boxShadow: {
        gentle: "0 2px 20px rgba(58, 63, 54, 0.10)",
        soft: "0 4px 30px rgba(58, 63, 54, 0.15)",
        elevated: "0 8px 40px rgba(58, 63, 54, 0.12)",
      },
      borderRadius: {
        organic: "30% 70% 70% 30% / 30% 30% 70% 70%",
      },
      minHeight: {
        touch: "44px",
        "touch-primary": "48px",
      },
      minWidth: {
        touch: "44px",
        "touch-primary": "48px",
      },
      textShadow: {
        sm: "0 1px 2px rgba(0, 0, 0, 0.2)",
        DEFAULT: "0 2px 4px rgba(0, 0, 0, 0.3)",
        md: "0 2px 4px rgba(0, 0, 0, 0.3)",
        lg: "0 4px 8px rgba(0, 0, 0, 0.4)",
        xl: "0 8px 16px rgba(0, 0, 0, 0.5)",
        "2xl": "0 16px 32px rgba(0, 0, 0, 0.6)",
        none: "none",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    function ({ addUtilities }: { addUtilities: any }) {
      const textShadows = {
        '.text-shadow-sm': {
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
        },
        '.text-shadow': {
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
        },
        '.text-shadow-md': {
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
        },
        '.text-shadow-lg': {
          textShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
        },
        '.text-shadow-xl': {
          textShadow: '0 8px 16px rgba(0, 0, 0, 0.5)',
        },
        '.text-shadow-2xl': {
          textShadow: '0 16px 32px rgba(0, 0, 0, 0.6)',
        },
        '.text-shadow-none': {
          textShadow: 'none',
        },
      }
      addUtilities(textShadows)
    },
    function ({ addUtilities }: { addUtilities: any }) {
      const organicShapes = {
        // Pebble shapes
        '.rounded-\\[30\\%_70\\%_70\\%_30\\%\\/30\\%_30\\%_70\\%_70\\%\\]': {
          borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
        },
        '.rounded-\\[40\\%_60\\%_60\\%_40\\%\\/50\\%_50\\%_50\\%_50\\%\\]': {
          borderRadius: '40% 60% 60% 40% / 50% 50% 50% 50%',
        },
        '.rounded-\\[35\\%_65\\%_65\\%_35\\%\\/40\\%_40\\%_60\\%_60\\%\\]': {
          borderRadius: '35% 65% 65% 35% / 40% 40% 60% 60%',
        },
        // Leaf shapes
        '.rounded-\\[0\\%_100\\%_100\\%_0\\%\\/50\\%_50\\%_50\\%_50\\%\\]': {
          borderRadius: '0% 100% 100% 0% / 50% 50% 50% 50%',
        },
        '.rounded-\\[80\\%_20\\%_80\\%_20\\%\\/20\\%_80\\%_20\\%_80\\%\\]': {
          borderRadius: '80% 20% 80% 20% / 20% 80% 20% 80%',
        },
        '.rounded-\\[70\\%_30\\%_70\\%_30\\%\\/30\\%_70\\%_30\\%_70\\%\\]': {
          borderRadius: '70% 30% 70% 30% / 30% 70% 30% 70%',
        },
        // Seed shapes
        '.rounded-\\[50\\%_50\\%_50\\%_50\\%\\/60\\%_60\\%_40\\%_40\\%\\]': {
          borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
        },
        '.rounded-\\[45\\%_55\\%_55\\%_45\\%\\/65\\%_65\\%_35\\%_35\\%\\]': {
          borderRadius: '45% 55% 55% 45% / 65% 65% 35% 35%',
        },
        '.rounded-\\[55\\%_45\\%_45\\%_55\\%\\/55\\%_55\\%_45\\%_45\\%\\]': {
          borderRadius: '55% 45% 45% 55% / 55% 55% 45% 45%',
        },
      }
      addUtilities(organicShapes)
    },
  ],
};
export default config;
