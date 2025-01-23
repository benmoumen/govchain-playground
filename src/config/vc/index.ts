import { InvalidParameterError } from "@/lib/errors";
import type {
  ProofUseCaseConfig,
  UCForm,
  UCMetadata,
  VCConfig,
  VCIdentifiers,
  VCTenant,
} from "@/types/vc";
import companyOwnership from "./company-ownership";
import digitalDUI from "./digital-dui";
import proofOfPersonhood from "./proof-personhood";
import { isCredentialUseCaseConfig, isProofUseCaseConfig } from "./typeGuards";

export enum CredentialUseCases {
  DIGITAL_DUI = "digitalDUI",
  COMPANY_OWNERSHIP = "companyOwnership",
}

export enum ProofUseCases {
  PERSONHOOD = "personhood",
}

export const useCaseConfig: VCConfig = {
  acapy: {
    tenantProxyPath: "https://vc-proxy.govchain.technology",
    apiPath: "api/",
    basePath: "/",
  },
  useCases: {
    // Credentials
    [CredentialUseCases.DIGITAL_DUI]: digitalDUI,
    [CredentialUseCases.COMPANY_OWNERSHIP]: companyOwnership,
    // Presentation
    [ProofUseCases.PERSONHOOD]: proofOfPersonhood,
  },
};

export function getTenantByCase(useCase: string): VCTenant {
  if (!useCaseConfig.useCases[useCase]) {
    throw new InvalidParameterError(`Invalid [useCase: ${useCase}] parameter.`);
  }
  return useCaseConfig.useCases[useCase].tenant;
}

export function getUseCaseMetadata(useCase: string): UCMetadata {
  if (!useCaseConfig.useCases[useCase]) {
    throw new InvalidParameterError(`Invalid [useCase: ${useCase}] parameter.`);
  }
  const useCaseConfigItem = useCaseConfig.useCases[useCase];
  if (!isCredentialUseCaseConfig(useCaseConfigItem)) {
    throw new InvalidParameterError(
      `[useCase: ${useCase}] is not a Credential Use Case.`
    );
  }

  return useCaseConfigItem.metadata;
}

export function getUseCaseForm(useCase: string): UCForm {
  if (!useCaseConfig.useCases[useCase]) {
    throw new InvalidParameterError(`Invalid [useCase: ${useCase}] parameter.`);
  }
  const useCaseConfigItem = useCaseConfig.useCases[useCase];
  if (!isCredentialUseCaseConfig(useCaseConfigItem)) {
    throw new InvalidParameterError(
      `[useCase: ${useCase}] is not a Credential Use Case.`
    );
  }

  return useCaseConfigItem.form;
}

export function getVCIdentifiersByCase(useCase: string): VCIdentifiers {
  if (!useCaseConfig.useCases[useCase]) {
    throw new InvalidParameterError(`Invalid [useCase: ${useCase}] parameter.`);
  }
  const useCaseConfigItem = useCaseConfig.useCases[useCase];

  if (!isCredentialUseCaseConfig(useCaseConfigItem)) {
    throw new InvalidParameterError(
      `[useCase: ${useCase}] is not a Credential Use Case.`
    );
  }

  return useCaseConfigItem.identifiers;
}

export function getProofConfigByCase(useCase: string): ProofUseCaseConfig {
  if (!useCaseConfig.useCases[useCase]) {
    throw new InvalidParameterError(`Invalid [useCase: ${useCase}] parameter.`);
  }
  const useCaseConfigItem = useCaseConfig.useCases[useCase];

  if (!isProofUseCaseConfig(useCaseConfigItem)) {
    throw new InvalidParameterError(
      `[useCase: ${useCase}] is not a Proof Use Case.`
    );
  }
  return useCaseConfigItem;
}
