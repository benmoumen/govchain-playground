export interface VCIssuer {
  tenantId: string;
  name: string;
  shortName: string;
  apiKeyVar: string;
}
export interface UCMetadata {
  category: string;
  title: string;
  src: string;
}

export interface UCConfig {
  acapy: {
    tenantProxyPath: string;
    apiPath: string;
    basePath: string;
  };
  useCases: Record<
    string,
    {
      issuer: VCIssuer;
      metadata: UCMetadata;
    }
  >;
}

export interface InitConnectionResponse {
  connection_id: string;
  invitation_url: string;
}

export interface ConnectionStateResponse {
  state: string;
}
export interface ErrorResponse {
  error_message: string;
}
