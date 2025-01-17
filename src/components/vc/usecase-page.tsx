"use client";
import { AppDownloadButtons } from "@/components/ui/app-download-buttons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CredentialForm from "@/components/vc/credential-form";
import VCConnectionCard from "@/components/vc/vc-connection-card";
import { getTenantByCase, getUseCaseMetadata } from "@/config/vc";
import { useVCContext } from "@/contexts/vc-context";
import type { VCIssuer } from "@/types/vc";
import type { ConnRecord } from "@/types/vc/acapyApi/acapyInterface";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { AnimatedTabs } from "../ui/animated-tabs";

enum steps {
  CONNECT,
  REQUEST,
  END,
}

const UseCasePage: React.FC = () => {
  const { useCase, activeConnection } = useVCContext();
  const { credentialName, src } = getUseCaseMetadata(useCase);
  const issuer = getTenantByCase(useCase);

  const [activeStep, setActiveStep] = useState<number>(steps.CONNECT);

  const tabs = [
    {
      title: "Connect",
      value: "connect",
      content:
        activeStep === steps.CONNECT ? (
          <StepConnect
            src={src}
            issuer={issuer}
            credentialName={credentialName}
            activeConnection={activeConnection}
            setActiveStep={setActiveStep}
          />
        ) : null,
    },
    {
      title: "Request",
      value: "request",
      content:
        activeStep === steps.REQUEST ? (
          <StepRequest
            useCase={useCase}
            activeConnection={activeConnection}
            src={src}
          />
        ) : null,
    },
  ];

  // log component re-rendering
  console.info(">>>>UseCasePage rendered");

  return (
    <div className="flex flex-col gap-6 items-center">
      <div className="h-[20rem] md:h-[40rem] [perspective:1000px] relative b flex flex-col max-w-5xl mx-auto w-full  items-start justify-start">
        <AnimatedTabs
          tabs={tabs}
          currentStep={activeStep}
          onStepChange={function (step: number): void {
            console.info("onStepChange", step);
          }}
        />
      </div>
      <PageFooter />
    </div>
  );
};

export default UseCasePage;

const PageFooter: React.FC = () => (
  <>
    <div className="button-title text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
      Get your Digital Wallet app ready!
    </div>
    <AppDownloadButtons />
  </>
);

const StepConnect: React.FC<{
  src: string;
  issuer: VCIssuer;
  credentialName: string;
  activeConnection: ConnRecord | null;
  setActiveStep: (step: number) => void;
}> = ({ src, issuer, credentialName, activeConnection, setActiveStep }) => (
  <Card className="overflow-hidden">
    <CardContent className="grid p-0 md:grid-cols-2">
      <div className="relative p-6 md:p-8">
        <div className="flex flex-col gap-6 items-center">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold">Connect to the issuer</h1>
          </div>

          <VCConnectionCard issuer={issuer} credentialName={credentialName} />
        </div>
      </div>
      <div className="relative hidden bg-muted md:block">
        {activeConnection && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <Button
              effect={"expandIcon"}
              icon={ChevronRight}
              iconPlacement="left"
              variant={"secondary"}
              onClick={() => setActiveStep(steps.REQUEST)}
            >
              {" "}
              Request your {credentialName}
            </Button>
          </div>
        )}

        <Image
          src={src}
          sizes="(min-width: 768px) 50vw, 100vw"
          alt="Image"
          fill
          style={{ objectFit: "cover" }}
          className={`absolute inset-0 dark:brightness-[0.8] transition-all duration-300 ${
            activeConnection ? "blur-sm" : ""
          }`}
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
              className={`absolute inset-0 dark:brightness-[0.8] transition-all duration-300 ${
                activeConnection ? "blur-sm" : ""
              }`}
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
