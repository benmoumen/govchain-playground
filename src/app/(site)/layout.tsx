import "@/styles/globals.css";

import { SiteHeader } from "@/components/site-header";
import { TailwindIndicator } from "@/components/tailwind-indicator";

interface SiteLayoutProps {
  children: React.ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="relative flex min-h-screen flex-col">
        <SiteHeader />
        {children}
      </div>
      <TailwindIndicator />
    </div>
  );
}
