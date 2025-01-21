import { InvalidParameterError } from "@/lib/errors";
import type {
  UCForm,
  UCMetadata,
  VCConfig,
  VCIdentifiers,
  VCTenant,
} from "@/types/vc";
import companyOwnership from "./company-ownership";
import digitalDUI from "./digital-dui";

export const useCaseConfig: VCConfig = {
  acapy: {
    tenantProxyPath: "https://vc-proxy.govchain.technology",
    apiPath: "api/",
    basePath: "/",
  },
  useCases: {
    digitalDUI: digitalDUI,
    companyOwnership: companyOwnership,
  },
};

/**
 * @throws {InvalidParameterError} - If the useCase is not found in the config.
 */
export function getTenantByCase(useCase: string): VCTenant {
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

export function getVCIdentifiersByCase(useCase: string): VCIdentifiers {
  if (!useCaseConfig.useCases[useCase]) {
    throw new InvalidParameterError("Invalid [useCase] parameter");
  }
  return useCaseConfig.useCases[useCase].identifiers;
}
