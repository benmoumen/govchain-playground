/**
 * Didit Identity Verification Webhook Types
 * Based on: https://docs.didit.me/reference/webhooks
 */

export interface DidItWebhookPayload {
  session_id: string;
  status: "Not Started" | "In Progress" | "Approved" | "Declined" | "In Review" | "Abandoned";
  created_at: number;
  timestamp: number;
  workflow_id: string;
  vendor_data: string;
  metadata?: {
    user_type?: string;
    account_id?: string;
    [key: string]: unknown;
  };
  decision?: DidItDecision;
}

export interface DidItDecision {
  session_id: string;
  session_number: number;
  session_url: string;
  status: string;
  workflow_id: string;
  features: string[];
  vendor_data: string;
  metadata?: {
    user_type?: string;
    account_id?: string;
    [key: string]: unknown;
  };
  callback: string;
  id_verification?: DidItIdVerification;
  reviews?: DidItReview[];
  created_at: string;
}

export interface DidItIdVerification {
  status: string;
  document_type: string;
  document_number: string;
  personal_number: string;
  portrait_image: string;
  front_image: string;
  front_video?: string;
  back_image?: string;
  back_video?: string;
  full_front_image?: string;
  full_back_image?: string;
  date_of_birth: string;
  age: number;
  expiration_date: string;
  date_of_issue: string;
  issuing_state: string;
  issuing_state_name: string;
  first_name: string;
  last_name: string;
  full_name: string;
  gender: string;
  address: string;
  formatted_address: string;
  place_of_birth: string;
  marital_status: string;
  nationality: string;
  parsed_address?: DidItParsedAddress;
  extra_files?: string[];
  warnings?: DidItWarning[];
}

export interface DidItParsedAddress {
  id: string;
  city: string;
  label: string;
  region: string;
  street_1: string;
  street_2?: string | null;
  postal_code: string;
  raw_results: {
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
      location_type: string;
      viewport: {
        northeast: {
          lat: number;
          lng: number;
        };
        southwest: {
          lat: number;
          lng: number;
        };
      };
    };
  };
}

export interface DidItWarning {
  risk: string;
  additional_data?: unknown;
  log_type: string;
  short_description: string;
  long_description: string;
}

export interface DidItReview {
  user: string;
  new_status: string;
  comment: string;
  created_at: string;
}

export interface DidItWebhookHeaders {
  "X-Signature": string;
  "X-Timestamp": string;
}

export interface DidItWebhookResponse {
  message: string;
}
