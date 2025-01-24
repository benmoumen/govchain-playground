import { Badge } from "@/components/ui/badge";
import type { ProofUseCaseConfig } from "@/types/vc";
import { Link2 } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

interface PresentationConfigProps {
  config: ProofUseCaseConfig;
}

const CredDefLink: React.FC<{ credDefId: string }> = ({ credDefId }) => (
  <Badge variant="secondary" className="text-xs flex-col gap-1 py-1">
    {credDefId}
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

export const PresentationConfig: React.FC<PresentationConfigProps> = ({
  config,
}) => {
  return (
    <div className="flex flex-col gap-6">
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
                  <Badge key={name}>{name}</Badge>
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
