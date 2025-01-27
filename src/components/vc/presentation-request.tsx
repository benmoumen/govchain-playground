"use client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { extractAttributesFromPresentation } from "@/lib/vc";
import type { ProofUseCaseConfig } from "@/types/vc";
import type { V20PresExRecord } from "@/types/vc/acapyApi/acapyInterface";
import { Circle, CircleCheck, CircleX, Link2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { StatusBadge } from "../ui/status-badge";

interface PresentationRequestProps {
  config: ProofUseCaseConfig;
  presentationRecord: V20PresExRecord | null;
  isVerified: boolean | null;
  delayUpdate?: number;
}

const CredDefLink: React.FC<{
  credDefId: string;
  isVerified: boolean | null;
}> = ({ credDefId, isVerified }) => {
  const icon =
    isVerified === null ? Circle : isVerified ? CircleCheck : CircleX;
  return (
    <Badge variant="secondary" className="text-xs flex-col gap-1 py-1">
      <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
        {React.createElement(icon, {
          className: cn(
            "-ml-0.5 size-4 shrink-0",
            isVerified === true && "text-emerald-600 dark:text-emerald-500",
            isVerified === false && "text-red-600 dark:text-red-500"
          ),
        })}
        {credDefId}
      </span>
      <Button size="sm" variant="link" className="opacity-50 h-auto" asChild>
        <a
          href={`https://indy.govchain.technology/browse/domain?query=${credDefId}&txn_type=102`}
          target="_blank"
          className="text-xs"
        >
          <Link2 />
          View definition on the blockchain
        </a>
      </Button>
    </Badge>
  );
};

export const PresentationRequest: React.FC<PresentationRequestProps> = ({
  config,
  presentationRecord,
  isVerified = null,
  delayUpdate = 6000,
}) => {
  const [delayedIsVerified, setDelayedIsVerified] = useState<boolean | null>(
    isVerified
  );

  useEffect(() => {
    if (isVerified === true) {
      const timer = setTimeout(() => {
        setDelayedIsVerified(isVerified);
      }, delayUpdate);
      return () => clearTimeout(timer);
    } else {
      setDelayedIsVerified(isVerified);
    }
  }, [isVerified, delayUpdate]);

  const revealedAttributes =
    delayedIsVerified && presentationRecord
      ? extractAttributesFromPresentation(presentationRecord)
      : null;

  return (
    <div className="flex flex-col gap-6 justify-center">
      <h2 className="text-2xl tracking-tight flex items-center gap-2">
        {config.proofRequest.name}
        <Badge variant="secondary" className="text-xs py-0.5">
          {config.proofRequest.version}
        </Badge>
      </h2>
      <div>
        <p className="text-muted-foreground text-base">Verifier</p>
        <h3 className="text-xl tracking-tight">{config.tenant.name}</h3>
      </div>

      {Object.entries(config.proofRequest.requested_attributes).map(
        ([key, attr]) => (
          <section key={key} className="flex flex-col gap-6 mb-4">
            <div>
              <p className="text-muted-foreground text-base mb-2">
                Requested Attributes
              </p>
              <div className="flex flex-wrap gap-2">
                {attr.names?.map((name) => (
                  <StatusBadge
                    key={name}
                    leftIcon={
                      delayedIsVerified === null
                        ? Circle
                        : delayedIsVerified
                        ? CircleCheck
                        : CircleX
                    }
                    rightIcon={undefined}
                    leftLabel={name}
                    rightLabel={revealedAttributes?.[name] || ""}
                    status={
                      delayedIsVerified === null
                        ? "default"
                        : delayedIsVerified
                        ? "success"
                        : "error"
                    }
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="text-muted-foreground text-base mb-2">
                Accepted Credentials
              </p>
              <div className="mb-2">
                {attr.restrictions?.map(
                  (restriction, index) =>
                    restriction.cred_def_id && (
                      <CredDefLink
                        key={index}
                        credDefId={restriction.cred_def_id}
                        isVerified={delayedIsVerified}
                      />
                    )
                )}
              </div>
            </div>
          </section>
        )
      )}

      {Object.keys(config.proofRequest.requested_predicates).length > 0 && (
        <section>
          <p className="text-muted-foreground text-base mb-6">
            Required Predicates
          </p>
          {Object.entries(config.proofRequest.requested_predicates).map(
            ([key, pred]) => (
              <div key={key} className="bg-muted/30 p-4 rounded-lg mb-4">
                <h4 className="font-medium mb-4">{key}</h4>
                <div className="space-y-3">
                  <p className="text-sm">
                    <span className="font-medium">Name: </span>
                    <span className="text-muted-foreground">{pred.name}</span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Condition: </span>
                    <span className="text-muted-foreground">
                      {pred.p_type} {pred.p_value}
                    </span>
                  </p>
                  <div>
                    <p className="text-sm font-medium mb-2">
                      Accepted Credentials:
                    </p>
                    {pred.restrictions?.map(
                      (restriction, index) =>
                        restriction.cred_def_id && (
                          <CredDefLink
                            key={index}
                            credDefId={restriction.cred_def_id}
                            isVerified={delayedIsVerified}
                          />
                        )
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </section>
      )}
    </div>
  );
};
