import { Badge } from "@/components/ui/badge";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
//import { headers } from "next/headers";
import React from "react";

export default async function MainMenu() {
  //const headerList = await headers();
  //const pathname = headerList.get("x-current-path");
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Digital Proofs</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-72">
              <ListItem
                href="/playground/verifiable-credentials/obtain"
                title="Obtain Credentials"
              >
                Collect your digital proofs.
              </ListItem>
              <ListItem
                href="/playground/verifiable-credentials/prove"
                title="Present your Proofs"
              >
                Prove your identity and ownership.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        {/* <NavigationMenuLink
          asChild
          className={navigationMenuTriggerStyle()}
          active={pathname === "/playground/ai-assistant"}
        >
          <Link href="/playground/ai-assistant">AI Assistant</Link>
        </NavigationMenuLink> */}
        <NavigationMenuItem className={navigationMenuTriggerStyle()}>
          <TextWithBadge title="AI Assistant" badge="Soon" disabled />
        </NavigationMenuItem>
        <NavigationMenuItem className={navigationMenuTriggerStyle()}>
          <TextWithBadge title="Tokenized Companies" badge="Soon" disabled />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const TextWithBadge: React.FC<{
  title: string;
  badge: string;
  disabled: boolean;
}> = ({ title, badge, disabled }) => (
  <div
    className={cn(
      "flex items-center justify-center gap-2",
      disabled && "opacity-50"
    )}
  >
    <span className="text-sm font-medium">{title}</span>
    <Badge variant="secondary" size={"xs"}>
      {badge}
    </Badge>
  </div>
);

const ListItem = React.forwardRef<
  React.ComponentRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string; active?: boolean }
>(({ className, title, children, active, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            active && "bg-accent text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
