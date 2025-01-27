import { Icons } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-[60] py-2 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container z-10 flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-3">
            <Icons.logo className="h-8" />
            <span className="inline-block text-xl font-bold font-grotesk">
              {siteConfig.name}
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <span className="text-xs text-muted-foreground/80">
              <span className="hidden md:inline-block">Made by</span>
              <Button variant={"link"} size={"sm"} effect={"hoverUnderline"}>
                UNCTAD Digital Government
              </Button>
            </span>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
