"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { navMain } from "@/data/navigation";
import React from "react";

interface PlaygroundLayoutProps {
  children: React.ReactNode;
}

export default function PlaygroundLayout({ children }: PlaygroundLayoutProps) {
  const pathname = usePathname();

  // Recursive function to find the breadcrumb path
  const findBreadcrumbs = (
    items: typeof navMain,
    currentPath: string,
    pathAccumulator: { title: string; href: string }[] = []
  ): { title: string; href: string }[] => {
    for (const item of items) {
      if (currentPath === item.url) {
        pathAccumulator.push({ title: item.title, href: item.url });
        return pathAccumulator;
      }
      if (item.items) {
        if (currentPath.startsWith(item.url)) {
          pathAccumulator.push({ title: item.title, href: item.url });
          const subPath = currentPath.substring(item.url.length);
          const subItem = item.items.find(
            (sub) => sub.url === `${item.url}${subPath}`
          );
          if (subItem) {
            pathAccumulator.push({ title: subItem.title, href: subItem.url });
          }
          return pathAccumulator;
        }
      }
    }
    return pathAccumulator;
  };

  const breadcrumbs = findBreadcrumbs(navMain, pathname);

  // Default breadcrumb if no match found
  if (breadcrumbs.length === 0) {
    breadcrumbs.push({ title: "Home", href: "/" });
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => {
                  const isLast = index === breadcrumbs.length - 1;
                  return (
                    <React.Fragment key={crumb.href}>
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={crumb.href}>
                            {crumb.title}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {index < breadcrumbs.length - 1 && (
                        <BreadcrumbSeparator className="hidden md:block" />
                      )}
                    </React.Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex flex-1 justify-end items-center gap-4 px-3">
            <ThemeToggle />
          </div>
        </header>
        <main className="flex flex-1 ">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
