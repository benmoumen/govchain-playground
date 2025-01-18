"use client";
import { AppDownloadButtons } from "@/components/ui/app-download-buttons";
import { Card, CardContent } from "@/components/ui/card";
import CredentialForm from "@/components/vc/credential-form";
import VCConnectionCard from "@/components/vc/vc-connection-card";
import { getTenantByCase, getUseCaseMetadata } from "@/config/vc";
import { useVCContext } from "@/contexts/vc-context";
import { VCSteps, type VCIssuer } from "@/types/vc";
import type { ConnRecord } from "@/types/vc/acapyApi/acapyInterface";
import { ShieldCheck, Waypoints } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { AnimatedTabs } from "../ui/animated-tabs";

const StepConnect: React.FC<{
  src: string;
  issuer: VCIssuer;
  credentialName: string;
  setActiveStep: (step: number) => void;
}> = ({ src, issuer, credentialName, setActiveStep }) => (
  <Card className="overflow-hidden">
    <CardContent className="grid p-0 md:grid-cols-2">
      <div className="relative min-h-96">
        <div className="flex flex-col gap-6 items-center justify-center h-full">
          <VCConnectionCard
            issuer={issuer}
            credentialName={credentialName}
            setActiveStep={setActiveStep}
          />
        </div>
      </div>
      <div className="relative hidden bg-muted md:block">
        <Image
          src={src}
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
  src: string;
}> = ({ useCase, activeConnection, src }) => {
  return (
    activeConnection?.connection_id && (
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-3">
          <div className="relative col-span-1 hidden bg-muted md:block">
            <Image
              src={src}
              sizes="(min-width: 768px) 50vw, 100vw"
              alt="Image"
              fill
              style={{ objectFit: "cover" }}
              className="absolute inset-0 dark:brightness-[0.8] transition-all duration-300"
            />
          </div>
          <div className="relative col-span-2 p-6 md:p-8">
            <div className="flex flex-col gap-6 items-center">
              <h1 className="text-2xl font-bold">Request a credential</h1>
              <CredentialForm
                useCase={useCase}
                connectionId={activeConnection.connection_id}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  );
};

const PageFooter: React.FC = () => (
  <>
    <div className="button-title text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
      Get your Digital Wallet app ready!
    </div>
    <AppDownloadButtons />
  </>
);

const UseCasePage: React.FC = () => {
  const { useCase, activeConnection } = useVCContext();
  const { credentialName, src } = getUseCaseMetadata(useCase);
  const issuer = getTenantByCase(useCase);

  const [activeStep, setActiveStep] = useState<number>(VCSteps.CONNECT);

  const tabs = [
    {
      title: "Connect to the issuer",
      value: "connect",
      content: (
        <StepConnect
          src={src}
          issuer={issuer}
          credentialName={credentialName}
          setActiveStep={setActiveStep}
        />
      ),
      icon: <Waypoints size={16} />,
    },
    {
      title: "Request your " + credentialName,
      value: "request",
      content: (
        <StepRequest
          useCase={useCase}
          activeConnection={activeConnection}
          src={src}
        />
      ),
      icon: <ShieldCheck size={16} />,
    },
  ];

  // log component re-rendering
  console.info(">>>>UseCasePage rendered");

  return (
    <div className="flex flex-col gap-6 items-center">
      <div className="min-h-[20rem] md:min-h-[40rem] h-full [perspective:1000px] relative b flex flex-col max-w-5xl mx-auto w-full items-center">
        <AnimatedTabs
          tabs={tabs}
          currentStep={activeStep}
          onStepChange={function (step: number): void {
            setActiveStep(step);
          }}
        />
      </div>
      <PageFooter />
    </div>
  );
};

export default UseCasePage;
