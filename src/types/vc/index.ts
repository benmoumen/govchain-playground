import type { VCFormFieldDefinition } from "@/components/vc/credential-form";
import type { z } from "zod";
import type { ConnRecord } from "./acapyApi/acapyInterface";

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

export interface UseCaseConfig {
  issuer: VCIssuer;
  metadata: UCMetadata;
  form: UCForm;
}

export interface VCConfig {
  acapy: {
    tenantProxyPath: string;
    apiPath: string;
    basePath: string;
  };
  useCases: Record<string, UseCaseConfig>;
}

export interface InitConnectionResponse {
  connection_id: string;
  invitation_url: string;
}

export interface ConnectionStateResponse {
  state: string;
  connection: ConnRecord;
}
export interface ErrorResponse {
  error_message: string;
}
