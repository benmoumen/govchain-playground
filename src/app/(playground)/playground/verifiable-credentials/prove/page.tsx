"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import VCPresentationCard from "@/components/vc/vc-presentation-card";
import { ProofUseCases } from "@/config/vc";
import { VPPresentationProvider } from "@/contexts/vc-presentation-context";
import { cn } from "@/lib/utils";
import { Briefcase, Building, Calendar, Fingerprint } from "lucide-react";
import { motion } from "motion/react";

interface ProofUseCaseCardProps {
  cardItem: CardItem;
}

interface CardItem {
  useCase: string;
  icon: typeof Fingerprint;
  title: string;
  description: string;
  colSpan?: number;
}

const UCCards: CardItem[] = [
  {
    useCase: ProofUseCases.PERSONHOOD,
    icon: Fingerprint,
    title: "Proof of Personhood",
    description:
      "Present your digital ID to prove your identity and gain access to services.",
    colSpan: 2,
  },
  {
    useCase: ProofUseCases.PERSONHOOD,
    icon: Calendar,
    title: "Age Verification (18+)",
    description: "Confirm your age with verifiable credentials.",
  },
  {
    useCase: ProofUseCases.PERSONHOOD,
    icon: Briefcase,
    title: "Majority Shareholder Proof",
    description: "Verify your status as a majority shareholder.",
  },
  {
    useCase: ProofUseCases.PERSONHOOD,
    icon: Building,
    title: "Company Ownership Proof",
    description: "Present verifiable credentials to prove company ownership.",
    colSpan: 2,
  },
];

const ProofUseCaseCard: React.FC<ProofUseCaseCardProps> = ({ cardItem }) => {
  "use client";
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
      ? "lg:aspect-auto lg:col-span-" + cardItem.colSpan
      : "");

  return (
    <Dialog modal={true}>
      <DialogTrigger asChild>
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
              "absolute inset-0 rounded-3xl z-[1] opacity-20 group-hover:opacity-100 blur-xl  transition duration-500 will-change-transform",
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
              "absolute inset-0 rounded-3xl opacity-5 group-hover:opacity-100 z-[1] will-change-transform",
              "bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)]"
            )}
          />

          <div className="relative z-10 h-full bg-muted p-6 flex justify-between flex-col rounded-[22px]">
            <cardItem.icon className="w-8 h-8 stroke-1 " />
            <div className="flex flex-col">
              <h3 className="text-xl tracking-tight">{cardItem.title}</h3>
              <p className="text-muted-foreground max-w-xs text-base">
                {cardItem.description}
              </p>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent
        className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-[min(1024px,80vw)] [&>button:last-child]:top-3.5"
        onInteractOutside={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onFocusOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b border-border px-6 py-4 text-base">
            {cardItem.title}
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto">
          <VPPresentationProvider useCase={cardItem.useCase}>
            <VCPresentationCard />
          </VPPresentationProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function PresentVCPage() {
  return (
    <div className="w-full py-10 lg:py-20">
      <div className="container mx-auto">
        <div className="flex flex-col gap-10">
          <div className="flex gap-4 flex-col items-start">
            <div>
              <Badge variant={"secondary"} className="uppercase">
                Proof
              </Badge>
            </div>
            <div className="flex gap-2 flex-col">
              <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left">
                Present your proof
              </h2>
              <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground text-left">
                Use your digital wallet to prove your identity and ownership.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {UCCards.map((cardItem, index) => (
              <ProofUseCaseCard key={index} cardItem={cardItem} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
