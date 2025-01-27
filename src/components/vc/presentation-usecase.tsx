"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import VCPresentationCard from "@/components/vc/vc-presentation-card";
import { VPPresentationProvider } from "@/contexts/vc-presentation-context";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import type { Fingerprint } from "lucide-react";
import { motion } from "motion/react";
import { BlurImage } from "../ui/apple-cards-carousel";

export interface CardItem {
  useCase: string;
  icon: typeof Fingerprint;
  title: string;
  description: string;
  src: string;
  colSpan?: number;
}

interface UseCaseCardProps {
  cardItem: CardItem;
}

export const UseCaseCard: React.FC<UseCaseCardProps> = ({ cardItem }) => {
  if (!cardItem) return;
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  };
  const animate = true;

  const containerClassName =
    "h-full flex justify-between flex-col aspect-square " +
    (cardItem.colSpan && cardItem.colSpan > 1
      ? "aspect-auto col-span-" + cardItem.colSpan
      : "");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div
          className={cn("relative p-[4px] group", containerClassName)}
          role="button"
          tabIndex={0}
        >
          <motion.div
            variants={animate ? variants : undefined}
            initial={animate ? "initial" : undefined}
            animate={animate ? "animate" : undefined}
            transition={
              animate
                ? {
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }
                : undefined
            }
            style={{
              backgroundSize: animate ? "400% 400%" : undefined,
            }}
            className={cn(
              "absolute inset-0 rounded-3xl z-[1] opacity-5 group-hover:opacity-50 blur-xl  transition duration-500 will-change-transform",
              " bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)]"
            )}
          />
          <motion.div
            variants={animate ? variants : undefined}
            initial={animate ? "initial" : undefined}
            animate={animate ? "animate" : undefined}
            transition={
              animate
                ? {
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }
                : undefined
            }
            style={{
              backgroundSize: animate ? "400% 400%" : undefined,
            }}
            className={cn(
              "absolute inset-0 rounded-3xl opacity-5 group-hover:opacity-50 z-[1] will-change-transform",
              "bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)]"
            )}
          />

          <BlurImage
            src={cardItem.src}
            alt={cardItem.title}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover absolute inset-0 z-0 rounded-[22px]"
          />

          <div className="relative z-10 h-full bg-black/50 p-6 flex justify-between flex-col rounded-[22px] overflow-hidden">
            <cardItem.icon className="w-8 h-8 stroke-1 " />
            <div className="flex flex-col">
              <h3 className="text-xl tracking-tight">{cardItem.title}</h3>
              <p className="text-muted-foreground max-w-xs text-base">
                {cardItem.description}
              </p>
            </div>
          </div>
        </div>
      </SheetTrigger>
      <SheetContent
        side={"bottom"}
        className="h-screen p-0"
        onInteractOutside={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onFocusOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <VisuallyHidden asChild>
            <SheetTitle>{cardItem.title}</SheetTitle>
          </VisuallyHidden>
        </SheetHeader>
        <div className="h-full overflow-y-auto">
          <VPPresentationProvider useCase={cardItem.useCase}>
            <VCPresentationCard />
          </VPPresentationProvider>
        </div>
      </SheetContent>
    </Sheet>
  );
};
