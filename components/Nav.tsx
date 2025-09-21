"use client";

import { Button } from "./ui/button";
import { Moon, Sun, TrendingUp, Target } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

export const Nav = () => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  return (
    <div
      className={"fixed top-0 left-0 right-0 px-4 py-2 flex items-center h-14 z-50 bg-background/80 backdrop-blur-sm border-b"}
    >
      <div className={"flex items-center gap-2"}>
        <Target className={"size-6 text-primary"} />
        <span className={"font-bold text-lg text-primary"}>EmotiClose</span>
        <span className={"text-sm text-muted-foreground hidden sm:inline"}>AI Sales Coach</span>
      </div>
      
      <div className={"ml-auto flex items-center gap-1"}>
        <Button
          variant={"ghost"}
          size={"sm"}
          className={"flex items-center gap-1.5 rounded-full"}
          onClick={() => router.push('/performance')}
        >
          <TrendingUp className={"size-4"} />
          <span className={"hidden sm:inline"}>Performance</span>
        </Button>
        <Button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          variant={"ghost"}
          size={"sm"}
          className={"flex items-center gap-1.5 rounded-full"}
        >
          <span>
            {theme === "dark" ? (
              <Sun className={"size-4"} />
            ) : (
              <Moon className={"size-4"} />
            )}
          </span>
          <span className={"hidden sm:inline"}>{theme === 'dark' ? "Light" : "Dark"}</span>
        </Button>
      </div>
    </div>
  );
};
