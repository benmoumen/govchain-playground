import type { z } from "zod";
import type {
  ConnRecord,
  CredAttrSpec,
  IndyProofRequest,
  V20CredExRecord,
  V20PresExRecord,
} from "./acapyApi/acapyInterface";
import type { VCFormFieldDefinition } from "./form";

export interface VCTenant {
  tenantId: string;
  name: string;
  shortName: string;
  apiKeyVar: string;
}
export interface UCMetadata {
  credentialName: string;
  category: string;
  title: string;
  benefits: string[];
  src: string;
}

export interface UCForm {
  schema: z.AnyZodObject;
  fields: VCFormFieldDefinition[];
  defaultValues: { [key: string]: string | Date | undefined };
}

export interface VCIdentifiers {
  credDefId: string;
  schemaId: string;
}

export interface CredentialUseCaseConfig {
  tenant: VCTenant;
  metadata: UCMetadata;
  form: UCForm;
  identifiers: VCIdentifiers;
}

export interface ProofUseCaseConfig {
  tenant: VCTenant;
  proofRequest: IndyProofRequest;
}

export interface VCConfig {
  acapy: {
    tenantProxyPath: string;
    apiPath: string;
    basePath: string;
  };
  useCases: Record<string, CredentialUseCaseConfig | ProofUseCaseConfig>;
}

export enum VCSteps {
  CONNECTION,
  CREDENTIAL,
}

export interface ErrorResponse {
  error_message: string;
}

export interface InitConnectionResponse {
  connection_id: string;
  invitation_url: string;
}

export interface ConnectionStateResponse {
  state: ConnRecord["state"];
  connection: ConnRecord;
}

export interface OfferCredentialData {
  connection_id: string;
  attributes: CredAttrSpec[];
}

export interface OfferCredentialResponse {
  credential_id: string;
}

export interface CredentialStateResponse {
  state: V20CredExRecord["state"];
  credential: V20CredExRecord;
}

export interface CreatePresentationResponse {
  presentation_exchange_id: string;
}

export interface PresentationStateResponse {
  state: V20PresExRecord["state"];
  presentation: V20PresExRecord;
}
