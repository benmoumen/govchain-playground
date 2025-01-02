"use client";
import { Card, Carousel } from "@/components/ui/apple-cards-carousel";
import BusinessCredentialForm from "@/components/vc-use-cases/business-credential-form";
import DigitalIdentityCredentialForm from "@/components/vc-use-cases/digital-identity-credential-form";

export default function RequestVCPage() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full py-20">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Get your verifiable credentials.
      </h2>
      <Carousel items={cards} />
    </div>
  );
}

const data = [
  {
    category: "Identity",
    title: "Get your Digital ID.",
    src: "https://images.unsplash.com/photo-1626423962491-eb76bdc2e0be?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DigitalIdentityCredentialForm />,
  },
  {
    category: "Business",
    title: "Get your Shareholder Certificate.",
    src: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=4000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <BusinessCredentialForm />,
  },
  {
    category: "Education",
    title: "Receive your Diploma.",
    src: "https://images.unsplash.com/photo-1627556704263-b486db44a463?q=80&w=2496&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DigitalIdentityCredentialForm />,
  },
  {
    category: "Health",
    title: "Get your Vaccination Pass.",
    src: "https://images.unsplash.com/photo-1623964783162-8fc658548501?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DigitalIdentityCredentialForm />,
  },
];
