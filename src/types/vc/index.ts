export interface VCIssuer {
  tenantId: string;
  name: string;
  shortName: string;
  apiKeyVar: string;
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
