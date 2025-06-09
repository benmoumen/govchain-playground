/**
 * Types for minimal Didit KYC implementation
 */

export interface KYCSession {
  id: string;
  sessionId?: string; // Didit session ID
  sessionToken?: string; // Didit session token
  verificationUrl?: string; // Didit verification URL
  userData: UserKYCData;
  status:
    | "pending"
    | "created"
    | "in_progress"
    | "completed"
    | "failed"
    | "error";
  createdAt: Date;
  updatedAt: Date;
  diditData?: Record<string, unknown>; // Raw Didit webhook/API data
  error?: string; // Error message if failed
}

export interface UserKYCData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phoneNumber?: string;
  country?: string;
}

// Didit API types
export interface DidItSessionRequest {
  workflow_id: string;
  vendor_data?: string;
  callback?: string;
  contact_details?: {
    email: string;
    phone_number?: string;
  };
  expected_details?: {
    first_name: string;
    last_name: string;
    date_of_birth: string;
    country?: string;
  };
}

export interface DidItSessionResponse {
  session_id: string;
  session_token: string;
  url: string;
  workflow_id: string;
  vendor_data?: string;
}
