import { InvalidParameterError } from "@/lib/errors";
import type { UCConfig, UCMetadata, VCIssuer } from "@/types/vc";

export const useCaseConfig: UCConfig = {
  acapy: {
    tenantProxyPath: "https://vc-proxy.govchain.technology",
    apiPath: "api/",
    basePath: "/",
  },
  useCases: {
    digitalDUI: {
      issuer: {
        tenantId: "59378286-b0f1-4c4a-804d-c6b0f7628a39",
        name: "Registro National de las Personas Naturales",
        shortName: "RNPN",
        apiKeyVar: "VC_ISSUER_APIKEY_RNPN",
      },
      metadata: {
        category: "Identity",
        title: "Get your Digital ID.",
        src: "https://images.unsplash.com/photo-1626423962491-eb76bdc2e0be?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    },
  },
};

/**
 * @throws {InvalidParameterError} - If the useCase is not found in the config.
 */
export function getTenantByCase(useCase: string): VCIssuer {
  if (!useCaseConfig.useCases[useCase]) {
    throw new InvalidParameterError("Invalid [useCase] parameter");
  }
  return useCaseConfig.useCases[useCase].issuer;
}

export function getUseCaseMetadata(useCase: string): UCMetadata {
  if (!useCaseConfig.useCases[useCase]) {
    throw new InvalidParameterError("Invalid [useCase] parameter");
  }
  return useCaseConfig.useCases[useCase].metadata;
}
