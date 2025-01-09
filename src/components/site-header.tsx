import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/config/site";
import { Button } from "./ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-[60] py-2 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container z-10 flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <span className="text-xs text-muted-foreground/80">
              Made by
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
