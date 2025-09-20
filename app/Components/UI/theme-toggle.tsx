"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/app/Components/UI/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/app/Components/UI/dropdown-menu";

export function ThemeToggle() {
    const { setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-9 rounded-full px-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                    <div className="relative flex size-8 items-center justify-center rounded-full bg-gray-600">
                        <Sun className="absolute size-[1.2rem] rotate-0 scale-100 text-white transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute size-[1.2rem] rotate-90 scale-0 text-white transition-all dark:rotate-0 dark:scale-100" />
                    </div>
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                <DropdownMenuItem onClick={() => setTheme("light")} className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900 dark:text-gray-100 dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900 dark:text-gray-100 dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900 dark:text-gray-100 dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
} 