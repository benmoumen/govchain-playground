import type { z } from "zod";
import type {
  ConnRecord,
  CredAttrSpec,
  V20CredExRecord,
} from "./acapyApi/acapyInterface";
import type { VCFormFieldDefinition } from "./form";

export interface VCIssuer {
  tenantId: string;
  name: string;
  shortName: string;
  apiKeyVar: string;
}
export interface UCMetadata {
  credentialName: string;
  category: string;
  title: string;
  src: string;
}

export interface UCForm {
  schema: z.AnyZodObject;
  fields: VCFormFieldDefinition[];
  defaultValues: { [key: string]: string | undefined };
}

export interface VCIdentifiers {
  credDefId: string;
  schemaId: string;
}

export interface UseCaseConfig {
  issuer: VCIssuer;
  metadata: UCMetadata;
  form: UCForm;
  identifiers: VCIdentifiers;
}

export interface VCConfig {
  acapy: {
    tenantProxyPath: string;
    apiPath: string;
    basePath: string;
  };
  useCases: Record<string, UseCaseConfig>;
}

export interface ErrorResponse {
  error_message: string;
}

export interface InitConnectionResponse {
  connection_id: string;
  invitation_url: string;
}

export interface ConnectionStateResponse {
  state: string;
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
