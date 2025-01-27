"use client";
import type { V20PresExRecord } from "@/types/vc/acapyApi/acapyInterface";
import type React from "react";
import { useState } from "react";
import { BackgroundLines } from "../ui/background-lines";
import { Badge } from "../ui/badge";
import { MultiStepLoader } from "../ui/multi-step-loader";

interface PresentationSteps {
  name: string;
  label: string | React.ReactNode;
  description: string | React.ReactNode;
}

interface VerificationStepsProps {
  presentation: V20PresExRecord;
  embed: boolean;
}

const VerificationSteps: React.FC<VerificationStepsProps> = ({
  presentation,
  embed,
}) => {
  const [loading] = useState(true);
  const steps: PresentationSteps[] = [
    {
      name: "request-sent",
      label: (
        <div className="flex justify-center items-center gap-2">
          Proof Request Sent
          <Badge variant={"secondary"} size={"sm"}>
            Waiting your action
          </Badge>
        </div>
      ),
      description: (
        <span>
          The verifier has sent you a <strong>proof request</strong>.
        </span>
      ),
    },
    {
      name: "presentation-received",
      label: "User Signature Verification",
      description: (
        <span>
          Verifies the wallet <strong>digital signature</strong> for credential
          ownership.
        </span>
      ),
    },
    {
      name: "presentation-received",
      label: "Trusted Issuer Validation",
      description: (
        <span>
          Verifies data from certificates signed by{" "}
          <strong>trusted issuers</strong>.
        </span>
      ),
    },
    {
      name: "presentation-received",
      label: "Selective Disclosure",
      description: (
        <span>
          Decrypts only the data the user has <strong>chosen to share</strong>.
        </span>
      ),
    },
    {
      name: "done",
      label: "Proof accepted 🎉",
      description: (
        <span>
          The verifier has <strong>accepted your proof</strong>.
        </span>
      ),
    },
  ];

  return (
    <MultiStepLoader
      embed={embed}
      loading={loading}
      loadingStates={steps.map((state) => ({
        text: state.label,
        description: state.description,
      }))}
      currentState={
        steps.findIndex(
          (state) => presentation?.state && state.name === presentation.state
        ) ?? 0
      }
      successMessage={
        <BackgroundLines>
          <></>
        </BackgroundLines>
      }
    />
  );
};

export default VerificationSteps;
