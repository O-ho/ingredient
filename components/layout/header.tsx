"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-bg-surface backdrop-blur">
      <div className="px-10  h-16 flex items-center justify-between">
        {/* Logo / Title */}
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-text">MSP Admin</h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-bg-elevated border border-border text-text hover:bg-hover transition-colors"
            aria-label="테마 전환"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
