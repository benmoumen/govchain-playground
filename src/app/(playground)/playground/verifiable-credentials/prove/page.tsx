"use client";
import { Badge } from "@/components/ui/badge";
import {
  UseCaseCard,
  type CardItem,
} from "@/components/vc/presentation-usecase";

import { ProofUseCases } from "@/config/vc";

import { Briefcase, Building, Calendar, Fingerprint } from "lucide-react";

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

export default function PresentVCPage() {
  return (
    <div className="w-full py-10 lg:py-20">
      <div className="container mx-auto">
        <div className="flex flex-col gap-10">
          <div className="flex gap-4 flex-col items-start">
            <div>
              <Badge variant={"outline"} size={"xs"} className="uppercase">
                Verifiable Presentation
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
              <UseCaseCard key={index} cardItem={cardItem} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
