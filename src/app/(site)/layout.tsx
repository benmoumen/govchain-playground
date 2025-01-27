import "@/styles/globals.css";

import { SiteHeader } from "@/components/site-header";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Button } from "@/components/ui/button";

interface SiteLayoutProps {
  children: React.ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="relative flex min-h-screen flex-col">
        <SiteHeader>
          <span className="text-xs text-muted-foreground/80">
            <span className="hidden md:inline-block">Made by</span>
            <Button variant={"link"} size={"sm"} effect={"hoverUnderline"}>
              UNCTAD Digital Government
            </Button>
          </span>
        </SiteHeader>
        {children}
      </div>
      <TailwindIndicator />
    </div>
  );
}
