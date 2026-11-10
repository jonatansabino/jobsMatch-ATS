import { useEffect, type ReactNode } from "react";
import { useTheme } from "@/hooks/use-theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useTheme((state) => state.theme);
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      document.documentElement.classList.toggle(
        "dark",
        theme === "dark" || (theme === "system" && media.matches),
      );
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme]);
  return children;
}
