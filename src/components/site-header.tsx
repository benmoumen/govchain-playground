import { Icons } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/config/site";
import Link from "next/link";

import { ReactNode } from "react";

interface SiteHeaderProps {
  children: ReactNode;
}

export function SiteHeader({ children }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 py-2 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container z-10 flex h-16 items-center gap-4 space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-3">
            <Icons.logo className="h-8" />
            <span className="inline-block text-xl font-bold font-grotesk">
              {siteConfig.name}
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <nav className="flex items-center gap-6">
            {children}
            <ThemeToggle defaultTheme={siteConfig.theme} />
          </nav>
        </div>
      </div>
    </header>
  );
}
