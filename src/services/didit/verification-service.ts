import type { DidItDecision, DidItIdVerification } from "@/types/didit/webhook";

/**
 * Service for handling Didit identity verification data
 */
export class DidItVerificationService {
  
  /**
   * Process approved verification and extract relevant data
   */
  static processApprovedVerification(decision: DidItDecision) {
    if (!decision.id_verification) {
      throw new Error("No ID verification data available");
    }

    const idData = decision.id_verification;
    
    return {
      sessionId: decision.session_id,
      workflowId: decision.workflow_id,
      personalInfo: this.extractPersonalInfo(idData),
      documentInfo: this.extractDocumentInfo(idData),
      verificationMetadata: {
        status: idData.status,
        sessionUrl: decision.session_url,
        features: decision.features,
        warnings: idData.warnings || [],
        createdAt: decision.created_at
      }
    };
  }

  /**
   * Extract personal information from ID verification
   */
  private static extractPersonalInfo(idData: DidItIdVerification) {
    return {
      firstName: idData.first_name,
      lastName: idData.last_name,
      fullName: idData.full_name,
      dateOfBirth: idData.date_of_birth,
      age: idData.age,
      gender: idData.gender,
      placeOfBirth: idData.place_of_birth,
      maritalStatus: idData.marital_status,
      nationality: idData.nationality,
      address: {
        raw: idData.address,
        formatted: idData.formatted_address,
        parsed: idData.parsed_address
      }
    };
  }

  /**
   * Extract document information from ID verification
   */
  private static extractDocumentInfo(idData: DidItIdVerification) {
    return {
      type: idData.document_type,
      number: idData.document_number,
      personalNumber: idData.personal_number,
      issuingState: idData.issuing_state,
      issuingStateName: idData.issuing_state_name,
      dateOfIssue: idData.date_of_issue,
      expirationDate: idData.expiration_date,
      images: {
        portrait: idData.portrait_image,
        front: idData.front_image,
        back: idData.back_image,
        fullFront: idData.full_front_image,
        fullBack: idData.full_back_image
      },
      videos: {
        front: idData.front_video,
        back: idData.back_video
      },
      extraFiles: idData.extra_files || []
    };
  }

  /**
   * Validate if the verification meets minimum requirements
   */
  static validateVerification(decision: DidItDecision): boolean {
    if (!decision.id_verification) {
      return false;
    }

    const required = [
      decision.id_verification.first_name,
      decision.id_verification.last_name,
      decision.id_verification.date_of_birth,
      decision.id_verification.document_type,
      decision.id_verification.document_number
    ];

    return required.every(field => field && field.trim().length > 0);
  }

  /**
   * Check if verification has any critical warnings
   */
  static hasCriticalWarnings(decision: DidItDecision): boolean {
    if (!decision.id_verification?.warnings) {
      return false;
    }

    const criticalWarnings = [
      "DOCUMENT_EXPIRED",
      "DOCUMENT_FAKE",
      "FACE_MISMATCH",
      "LIVENESS_FAILED"
    ];

    return decision.id_verification.warnings.some(warning =>
      criticalWarnings.includes(warning.risk)
    );
  }

  /**
   * Format verification data for credential issuance
   */
  static formatForCredential(decision: DidItDecision) {
    const processed = this.processApprovedVerification(decision);
    
    return {
      // Standard credential attributes
      "Full Name": processed.personalInfo.fullName,
      "First Name": processed.personalInfo.firstName,
      "Last Name": processed.personalInfo.lastName,
      "Date of Birth": processed.personalInfo.dateOfBirth,
      "Age": processed.personalInfo.age.toString(),
      "Gender": processed.personalInfo.gender,
      "Nationality": processed.personalInfo.nationality,
      "Place of Birth": processed.personalInfo.placeOfBirth,
      "Address": processed.personalInfo.address.formatted,
      
      // Document information
      "Document Type": processed.documentInfo.type,
      "Document Number": processed.documentInfo.number,
      "Personal Number": processed.documentInfo.personalNumber,
      "Issuing State": processed.documentInfo.issuingStateName,
      "Date of Issue": processed.documentInfo.dateOfIssue,
      "Date of Expiry": processed.documentInfo.expirationDate,
      
      // Verification metadata
      "Verification Status": processed.verificationMetadata.status,
      "Session ID": processed.sessionId,
      "Workflow ID": processed.workflowId,
      "Verified At": processed.verificationMetadata.createdAt
    };
  }
}
