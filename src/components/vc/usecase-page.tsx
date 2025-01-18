"use client";
import { AppDownloadButtons } from "@/components/ui/app-download-buttons";
import { Card, CardContent } from "@/components/ui/card";
import CredentialForm from "@/components/vc/credential-form";
import VCConnectionCard from "@/components/vc/vc-connection-card";
import { getTenantByCase, getUseCaseMetadata } from "@/config/vc";
import { useVCContext } from "@/contexts/vc-context";
import { VCSteps, type UCMetadata, type VCIssuer } from "@/types/vc";
import type { ConnRecord } from "@/types/vc/acapyApi/acapyInterface";
import { ShieldCheck, Waypoints } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { AnimatedTabs } from "../ui/animated-tabs";

const StepConnect: React.FC<{
  issuer: VCIssuer;
  metadata: UCMetadata;
  setActiveStep: (step: number) => void;
}> = ({ issuer, metadata, setActiveStep }) => (
  <Card className="overflow-hidden rounded-3xl">
    <CardContent className="grid p-0 md:grid-cols-2">
      <div className="relative min-h-96">
        <div className="flex flex-col gap-6 items-center justify-center h-full">
          <VCConnectionCard
            issuer={issuer}
            credentialName={metadata.credentialName}
            setActiveStep={setActiveStep}
          />
        </div>
      </div>
      <div className="relative hidden bg-muted md:block">
        <Image
          src={metadata.src}
          sizes="(min-width: 768px) 50vw, 100vw"
          alt="Image"
          fill
          style={{ objectFit: "cover" }}
          className="absolute inset-0 dark:brightness-[0.8] transition-all duration-300"
        />
      </div>
    </CardContent>
  </Card>
);

const StepRequest: React.FC<{
  useCase: string;
  activeConnection: ConnRecord | null;
  issuer: VCIssuer;
  metadata: UCMetadata;
}> = ({ useCase, activeConnection, issuer, metadata }) => {
  return (
    activeConnection?.connection_id && (
      <Card className="overflow-hidden rounded-3xl">
        <CardContent className="grid p-0 md:grid-cols-3">
          <div className="relative col-span-1 hidden bg-muted md:block">
            <Image
              src={metadata.src}
              sizes="(min-width: 768px) 50vw, 100vw"
              alt="Image"
              fill
              style={{ objectFit: "cover" }}
              className="absolute inset-0 dark:brightness-[0.8] transition-all duration-300"
            />
          </div>
          <div className="relative col-span-2 p-6 md:p-8 bg-accent">
            <CredentialForm
              useCase={useCase}
              connectionId={activeConnection.connection_id}
              issuer={issuer}
              metadata={metadata}
            />
          </div>
        </CardContent>
      </Card>
    )
  );
};

const PageFooter: React.FC = () => (
  <>
    <div className="mt-8 button-title text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
      Get your Digital Wallet app ready!
    </div>
    <AppDownloadButtons />
  </>
);

const UseCasePage: React.FC = () => {
  const { useCase, activeConnection } = useVCContext();
  const metadata = getUseCaseMetadata(useCase);
  const issuer = getTenantByCase(useCase);

  const [activeStep, setActiveStep] = useState<number>(VCSteps.CONNECT);

  const tabs = [
    {
      title: "Connect to the issuer",
      value: "connect",
      content: (
        <StepConnect
          issuer={issuer}
          metadata={metadata}
          setActiveStep={setActiveStep}
        />
      ),
      icon: <Waypoints size={16} />,
    },
    {
      title: "Request your " + metadata.credentialName,
      value: "request",
      content: (
        <StepRequest
          useCase={useCase}
          activeConnection={activeConnection}
          issuer={issuer}
          metadata={metadata}
        />
      ),
      icon: <ShieldCheck size={16} />,
    },
  ];

  // log component re-rendering
  console.info(">>>>UseCasePage rendered");

  return (
    <div className="flex flex-col gap-5 items-center">
      <AnimatedTabs
        tabs={tabs}
        currentStep={activeStep}
        onStepChange={function (step: number): void {
          setActiveStep(step);
        }}
      />
      <PageFooter />
    </div>
  );
};

export default UseCasePage;
