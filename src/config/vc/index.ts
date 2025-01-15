import { InvalidParameterError } from "@/lib/errors";
import type { UCForm, UCMetadata, VCConfig, VCIssuer } from "@/types/vc";
import digitalDUI from "./digital-dui";

export const useCaseConfig: VCConfig = {
  acapy: {
    tenantProxyPath: "https://vc-proxy.govchain.technology",
    apiPath: "api/",
    basePath: "/",
  },
  useCases: {
    digitalDUI: digitalDUI,
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

export function getUseCaseForm(useCase: string): UCForm {
  if (!useCaseConfig.useCases[useCase]) {
    throw new InvalidParameterError("Invalid [useCase] parameter");
  }
  return useCaseConfig.useCases[useCase].form;
}
