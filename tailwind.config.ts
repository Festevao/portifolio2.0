import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        'black-to-light': 'linear-gradient(to right, #000000 0%, #4d4d4d 5%, #ffffff 30%, #ffffff 70%, #4d4d4d 95%, #000000 100%)',
        'light-to-black': 'linear-gradient(to right, #ffffff 0%, #4d4d4d 30%, #000000 50%, #4d4d4d 70%, #ffffff 100%)',
      },
    },
  },
  plugins: [],
};
export default config;
