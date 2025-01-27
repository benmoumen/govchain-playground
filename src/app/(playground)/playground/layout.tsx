"use client";

import { SiteHeader } from "@/components/site-header";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { BackgroundDotted } from "@/components/ui/background-dotted";
import MainMenu from "@/components/ui/main-menu";
import React from "react";

interface PlaygroundLayoutProps {
  children: React.ReactNode;
}

export default function PlaygroundLayout({ children }: PlaygroundLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader>
        <MainMenu />
      </SiteHeader>
      <div className="flex-1">
        <div className="relative h-full w-full p-16 bg-background text-foreground">
          <BackgroundDotted />
          <div className="flex w-full justify-center relative">
            <div className="w-full">{children}</div>
          </div>
        </div>
      </div>
      <TailwindIndicator />
    </div>
  );
}
