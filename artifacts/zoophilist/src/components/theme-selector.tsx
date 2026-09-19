import { useState, useEffect } from "react";
import { Palette, Check, Sun, Moon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export type ThemeOption = "emerald" | "white" | "teal" | "amber" | "sapphire" | "amethyst" | "rose";

interface ThemeMeta {
  id: ThemeOption;
  name: string;
  color: string;
  desc: string;
  mode: "light" | "dark";
}

const THEMES: ThemeMeta[] = [
  { id: "white", name: "Pure White", color: "#ffffff", desc: "Crisp & modern light theme", mode: "light" },
  { id: "emerald", name: "Emerald Nature", color: "#22c55e", desc: "Zoophilist signature green (Dark)", mode: "dark" },
  { id: "teal", name: "Ocean Teal", color: "#14b8a6", desc: "Crisp aqua marine (Dark)", mode: "dark" },
  { id: "amber", name: "Golden Honey", color: "#f59e0b", desc: "Warm amber & sunset (Dark)", mode: "dark" },
  { id: "sapphire", name: "Royal Sapphire", color: "#3b82f6", desc: "Sleek blue midnight (Dark)", mode: "dark" },
  { id: "amethyst", name: "Royal Amethyst", color: "#a855f7", desc: "Luxury velvet purple (Dark)", mode: "dark" },
  { id: "rose", name: "Coral Rose", color: "#f43f5e", desc: "Vibrant berry pink (Dark)", mode: "dark" },
];

export function ThemeSelector({ className }: { className?: string }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeOption>("emerald");

  useEffect(() => {
    const saved = (localStorage.getItem("zoophilist_custom_theme") as ThemeOption) || "emerald";
    setCurrentTheme(saved);
    applyTheme(saved);
  }, []);

  const applyTheme = (theme: ThemeOption) => {
    setCurrentTheme(theme);
    localStorage.setItem("zoophilist_custom_theme", theme);
    const root = document.documentElement;

    if (theme === "white") {
      root.setAttribute("data-theme", "white");
      root.classList.add("light-theme");
      root.classList.remove("dark");
    } else if (theme === "emerald") {
      root.removeAttribute("data-theme");
      root.classList.remove("light-theme");
      root.classList.add("dark");
    } else {
      root.setAttribute("data-theme", theme);
      root.classList.remove("light-theme");
      root.classList.add("dark");
    }
  };

  const isWhite = currentTheme === "white";
  const activeMeta = THEMES.find((t) => t.id === currentTheme) || THEMES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          id="theme-selector-trigger"
          type="button"
          className={`flex items-center gap-2 h-9 px-3 rounded-full transition-all text-xs font-medium cursor-pointer shadow-sm ${
            isWhite
              ? "bg-black/5 hover:bg-black/10 border border-black/10 text-slate-800"
              : "bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white"
          } ${className || ""}`}
          title="Change Theme Palette"
        >
          {isWhite ? (
            <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          ) : (
            <span
              className="w-3 h-3 rounded-full shrink-0 shadow-sm border border-white/20"
              style={{ backgroundColor: activeMeta.color }}
            />
          )}
          <span className="hidden sm:inline font-semibold">
            {isWhite ? "White Theme" : activeMeta.name.split(" ")[0]}
          </span>
          <Palette className="w-3.5 h-3.5 opacity-60 ml-0.5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-2 bg-card/95 backdrop-blur-2xl border border-border shadow-2xl rounded-xl z-50">
        <DropdownMenuLabel className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground px-2 py-1 flex items-center justify-between">
          <span>Appearance</span>
          <span className="text-[10px] font-normal lowercase text-muted-foreground">
            {isWhite ? "light mode" : "dark mode"}
          </span>
        </DropdownMenuLabel>

        {/* Quick Light vs Dark Mode Toggle Bar */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-muted/60 rounded-lg my-1.5">
          <button
            type="button"
            onClick={() => applyTheme("white")}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              isWhite
                ? "bg-background text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>White</span>
          </button>
          <button
            type="button"
            onClick={() => applyTheme(currentTheme === "white" ? "emerald" : currentTheme)}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              !isWhite
                ? "bg-background text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-primary" />
            <span>Dark</span>
          </button>
        </div>

        <DropdownMenuSeparator className="bg-border/60 my-1.5" />
        <div className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
          Color Palettes
        </div>

        <div className="space-y-0.5">
          {THEMES.map((theme) => {
            const isSelected = currentTheme === theme.id;
            return (
              <DropdownMenuItem
                key={theme.id}
                onClick={() => applyTheme(theme.id)}
                className="flex items-center justify-between px-2.5 py-2 cursor-pointer rounded-lg hover:bg-muted/70 transition-colors focus:bg-muted/70"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm border border-border"
                    style={{ backgroundColor: theme.color }}
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
                      {theme.name}
                      {theme.id === "white" && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-600 font-bold">
                          Light
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{theme.desc}</span>
                  </div>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
