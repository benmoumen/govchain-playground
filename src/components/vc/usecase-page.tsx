"use client";
import { AppDownloadButtons } from "@/components/ui/app-download-buttons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CredentialForm from "@/components/vc/credential-form";
import VCConnectionCard from "@/components/vc/vc-connection-card";
import {
  getTenantByCase,
  getUseCaseForm,
  getUseCaseMetadata,
} from "@/config/vc";
import type { ConnRecord } from "@/types/vc/acapyApi/acapyInterface";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { AnimatedTabs } from "../ui/animated-tabs";

interface UseCasePageProps {
  useCase: string;
}

const UseCasePage: React.FC<UseCasePageProps> = ({ useCase }) => {
  const { credentialName, src } = getUseCaseMetadata(useCase);
  const issuer = getTenantByCase(useCase);
  const { schema, fields, defaultValues } = getUseCaseForm(useCase);
  enum steps {
    CONNECT,
    REQUEST,
    END,
  }
  const [activeStep, setActiveStep] = useState<number>(steps.CONNECT);
  const [connection] = useState<ConnRecord | null>(null);

  const PageFooter: React.FC = () => (
    <>
      <div className="button-title text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        Get your Digital Wallet app ready!
      </div>
      <AppDownloadButtons />
    </>
  );

  const StepConnect: React.FC = () => (
    <Card className="overflow-hidden">
      <CardContent className="grid p-0 md:grid-cols-2">
        <div className="relative p-6 md:p-8">
          <div className="flex flex-col gap-6 items-center">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-2xl font-bold">Connect to the issuer</h1>
            </div>

            <VCConnectionCard
              useCase={useCase}
              issuer={issuer}
              credentialName={credentialName}
            />
          </div>
        </div>
        <div className="relative hidden bg-muted md:block">
          {connection && (
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
              connection ? "blur-sm" : ""
            }`}
          />
        </div>
      </CardContent>
    </Card>
  );

  const StepRequest: React.FC = () => (
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
              connection ? "blur-sm" : ""
            }`}
          />
        </div>
        <div className="relative col-span-2 p-6 md:p-8">
          <div className="flex flex-col gap-6 items-center">
            <h1 className="text-2xl font-bold">Request a credential</h1>
            <CredentialForm
              schema={schema}
              formFields={fields}
              defaultValues={defaultValues}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const tabs = [
    {
      title: "Connect",
      value: "connect",
      content: <StepConnect />,
    },
    {
      title: "Request",
      value: "request",
      content: <StepRequest />,
    },
  ];

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
      <Button onClick={() => setActiveStep(0)}>Connect</Button>
      <Button onClick={() => setActiveStep(1)}>Request</Button>

      <PageFooter />
    </div>
  );
};

export default UseCasePage;
