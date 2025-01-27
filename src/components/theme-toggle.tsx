"use client";

import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface ThemeToggleProps {
  defaultTheme: "light" | "dark";
  className?: string;
}

export function ThemeToggle({ defaultTheme, className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  let isDark = defaultTheme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <ThemeToggleInternal
        isDark={isDark}
        handleThemeToggle={() => {}}
        className={className}
      />
    );
  }

  isDark = resolvedTheme === "dark";

  const handleThemeToggle = () => {
    const newTheme = isDark ? "light" : "dark";
    setTheme(newTheme);
  };

  return (
    <ThemeToggleInternal
      isDark={isDark}
      handleThemeToggle={handleThemeToggle}
      className={className}
    />
  );
}

interface ThemeToggleInternalProps {
  isDark: boolean;
  handleThemeToggle: () => void;
  className?: string;
}

function ThemeToggleInternal({
  isDark,
  handleThemeToggle,
  className,
}: ThemeToggleInternalProps) {
  return (
    <div
      className={cn(
        "flex w-16 h-8 p-1 rounded-full cursor-pointer",
        "transition-colors duration-300 ease-in-out",
        isDark
          ? "bg-zinc-950 border border-zinc-800"
          : "bg-white border border-zinc-200",
        className
      )}
      onClick={handleThemeToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleThemeToggle()}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      <div className="flex justify-between items-center w-full">
        <div
          className={cn(
            "flex justify-center items-center w-6 h-6 rounded-full",
            "transition-all duration-300 ease-in-out",
            isDark
              ? "transform translate-x-0 bg-zinc-800"
              : "transform translate-x-8 bg-gray-200"
          )}
        >
          {isDark ? (
            <Moon className="w-4 h-4 text-white" strokeWidth={1.5} />
          ) : (
            <Sun className="w-4 h-4 text-gray-700" strokeWidth={1.5} />
          )}
        </div>
        <div
          className={cn(
            "flex justify-center items-center w-6 h-6 rounded-full",
            "transition-all duration-300 ease-in-out",
            isDark ? "bg-transparent" : "transform -translate-x-8"
          )}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
          ) : (
            <Moon className="w-4 h-4 text-black" strokeWidth={1.5} />
          )}
        </div>
      </div>
    </div>
  );
}
