import { InvalidParameterError } from "@/lib/errors";
import type { VCIssuer } from "@/types/vc";

export const config = {
  acapy: {
    tenantProxyPath: "https://vc-proxy.govchain.technology",
    apiPath: "api/",
    basePath: "/",
  },
  issuers: {
    digitalDUI: {
      tenantId: "59378286-b0f1-4c4a-804d-c6b0f7628a39",
      name: "Registro National de las Personas Naturales",
      shortName: "RNPN",
      apiKeyVar: "VC_ISSUER_APIKEY_RNPN",
    },
  } as { [useCase: string]: VCIssuer },
};

/**
 * @throws {InvalidParameterError} - If the useCase is not found in the config.
 */
export function getTenantByCase(useCase: string): VCIssuer {
  if (!config.issuers[useCase]) {
    throw new InvalidParameterError("Invalid [case] parameter");
  }
  return config.issuers[useCase];
}
