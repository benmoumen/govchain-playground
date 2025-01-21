import { Card, Carousel } from "@/components/ui/apple-cards-carousel";
import { Badge } from "@/components/ui/badge";
import UseCasePage from "@/components/vc/usecase-page";
import { VCProvider } from "@/contexts/vc-context";

export default function RequestVCPage() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full py-10 lg:py-20">
      <div className="container mx-auto">
        <div className="flex flex-col gap-10">
          <div className="flex gap-4 flex-col items-start">
            <div>
              <Badge variant={"secondary"} className="uppercase">
                Verifiable Credentials
              </Badge>
            </div>
            <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left">
              Collect your digital proofs
            </h2>
            <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground  text-left">
              Get credentials and use them as digital proofs.
            </p>
          </div>
        </div>
        <Carousel items={cards} />
      </div>
    </div>
  );
}

const data = [
  {
    category: "Identity",
    title: "Get your Digital ID.",
    src: "https://images.unsplash.com/photo-1626423962491-eb76bdc2e0be?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: (
      <VCProvider useCase="digitalDUI">
        <UseCasePage />
      </VCProvider>
    ),
  },
  {
    category: "Business",
    title: "Get your Shareholder Credential.",
    src: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=4000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: (
      <VCProvider useCase="companyOwnership">
        <UseCasePage />
      </VCProvider>
    ),
  },
  {
    category: "Education",
    title: "Receive your Diploma.",
    src: "https://images.unsplash.com/photo-1627556704263-b486db44a463?q=80&w=2496&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <></>,
  },
  {
    category: "Health",
    title: "Get your Vaccination Pass.",
    src: "https://images.unsplash.com/photo-1623964783162-8fc658548501?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <></>,
  },
];
