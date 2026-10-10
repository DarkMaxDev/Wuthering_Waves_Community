import type { Config } from "tailwindcss";

// Tema Eclipse: los nombres se mantienen y los valores se invierten a modo oscuro.
// ink = texto principal (claro) · mist = bordes · fog = superficies sutiles
// night = fondo de la página · panel = fondo de tarjetas
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#f2f3f5",
        graphite: "#c9cdd3",
        slate2: "#9aa0a8",
        mist: "#2a2c30",
        fog: "#1e1f23",
        night: "#0d0e10",
        panel: "#16171a",
        platinum: { DEFAULT: "#3a3d43", dark: "#7d838c", light: "#34373c" },
        red: { 700: "#f87171" }, // errores legibles sobre fondo oscuro
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      // Solo transform/opacity: baratas para el navegador
      keyframes: {
        rise: { "0%": { opacity: "0", transform: "translateY(14px)" }, "100%": { opacity: "1", transform: "none" } },
        ring: { "0%": { transform: "scale(0.4)", opacity: "0.6" }, "100%": { transform: "scale(1.6)", opacity: "0" } },
        drift: { "0%, 100%": { transform: "translate3d(0,0,0)" }, "50%": { transform: "translate3d(24px,-18px,0)" } },
      },
      animation: {
        rise: "rise 0.7s cubic-bezier(0.2,0.7,0.2,1) both",
        ring: "ring 6s ease-out infinite",
        drift: "drift 16s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;