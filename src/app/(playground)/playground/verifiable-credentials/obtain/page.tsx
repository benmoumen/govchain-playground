"use client";
import { Card, Carousel } from "@/components/ui/apple-cards-carousel";
import { Badge } from "@/components/ui/badge";
import UseCasePage from "@/components/vc/usecase-page";
import { CredentialUseCases } from "@/config/vc";
import { VCProvider } from "@/contexts/vc-context";
import { CookiesProvider } from "react-cookie";

export default function RequestVCPage() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <CookiesProvider>
      <div className="w-full py-10 lg:py-20">
        <div className="container mx-auto">
          <div className="flex flex-col gap-10">
            <div className="flex gap-4 flex-col items-start">
              <div>
                <Badge variant={"outline"} size={"xs"} className="uppercase">
                  Verifiable Credential
                </Badge>
              </div>
              <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left">
                Collect your digital proofs
              </h2>
              <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground text-left">
                Get credentials and use them as digital proofs.
              </p>
            </div>
          </div>
        </div>
        <Carousel items={cards} />
      </div>
    </CookiesProvider>
  );
}

const data = [
  {
    category: "Identity",
    title: "Get your Digital ID.",
    src: "/img/photo-wallet-scan.jpg",
    content: (
      <VCProvider useCase={CredentialUseCases.DIGITAL_DUI}>
        <UseCasePage />
      </VCProvider>
    ),
  },
  {
    category: "Business",
    title: "Get your Shareholder Credential.",
    src: "/img/photo-handshake.jpg",
    content: (
      <VCProvider useCase={CredentialUseCases.COMPANY_OWNERSHIP}>
        <UseCasePage />
      </VCProvider>
    ),
  },
  {
    category: "Education",
    title: "Receive your Diploma.",
    src: "/img/photo-graduation.jpg",
    content: <></>,
  },
  {
    category: "Health",
    title: "Get your Vaccination Pass.",
    src: "/img/photo-vaccine.jpg",
    content: <></>,
  },
];
