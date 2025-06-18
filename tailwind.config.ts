import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  future: {
    // disable oklch color syntax
    respectDefaultRingColor: true,
    disableColorOpacityUtilitiesByDefault: true,
  },
  plugins: [],
};
export default config;
