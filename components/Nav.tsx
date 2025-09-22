"use client";

import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Moon, Sun, Phone, Settings, BarChart3, Database, User, Zap } from "lucide-react";
import Github from "./logos/GitHub";
import pkg from "@/package.json";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const Nav = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only render theme-dependent content after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <Phone className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">
              AI Sales Agent
            </span>
          </a>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="hidden md:flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                <Zap className="w-3 h-3 mr-1" />
                Live
              </Badge>
              <span className="text-sm text-muted-foreground">
                Voice-Powered Sales Assistant
              </span>
            </div>
          </div>
          
          <nav className="flex items-center space-x-1">
            <Button variant="ghost" size="sm">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:ml-2 sm:inline">Analytics</span>
            </Button>
            <Button variant="ghost" size="sm">
              <Database className="h-4 w-4" />
              <span className="hidden sm:ml-2 sm:inline">CRM</span>
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:ml-2 sm:inline">Settings</span>
            </Button>
            <Button
              onClick={() => {
                window.open(pkg.homepage, "_blank", "noopener noreferrer");
              }}
              variant={"ghost"}
              size="sm"
            >
              <Github className={"size-4"} />
              <span className="hidden sm:ml-2 sm:inline">GitHub</span>
            </Button>
            <Button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              variant={"ghost"}
              size="sm"
            >
              {!mounted ? (
                <Moon className={"size-4"} />
              ) : theme === "dark" ? (
                <Sun className={"size-4"} />
              ) : (
                <Moon className={"size-4"} />
              )}
              <span className="hidden sm:ml-2 sm:inline">
                {!mounted ? "Dark" : theme === 'dark' ? "Light" : "Dark"}
              </span>
            </Button>
          </nav>
        </div>
      </div>
    </nav>
  );
};
