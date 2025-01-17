import { getTenantByCase, getVCIdentifiersByCase } from "@/config/vc";
import { createAcapyApi } from "@/services/vc/acapy-api";
import { offerCredential } from "@/services/vc/credential-service";
import type {
  ErrorResponse,
  OfferCredentialData,
  OfferCredentialResponse,
  VCIssuer,
} from "@/types/vc";
import type { V20CredExRecord } from "@/types/vc/acapyApi/acapyInterface";
import { NextRequest, NextResponse } from "next/server";

/**
 * Sends a credential offer to a specified connection.
 *
 * @param tenant - The tenant issuing the credential.
 * @param credDefId - The credential definition ID.
 * @param data - The data required to offer the credential.
 * @returns A promise that resolves to a NextResponse containing either the credential ID or an error message.
 */
async function sendCredential(
  tenant: VCIssuer,
  credDefId: string,
  data: OfferCredentialData
): Promise<
  NextResponse<OfferCredentialResponse> | NextResponse<ErrorResponse>
> {
  const acapyApi = createAcapyApi(tenant);

  const payload = {
    auto_issue: true,
    auto_remove: false,
    connection_id: data.connection_id,
    credential_preview: {
      "@type": "issue-credential/2.0/credential-preview",
      attributes: data.attributes,
    },
    filter: {
      indy: {
        cred_def_id: credDefId,
      },
    },
    trace: false,
  };

  const result: V20CredExRecord | null = await offerCredential(
    acapyApi,
    payload
  );

  if (!result?.cred_ex_id) {
    return NextResponse.json(
      {
        error_message:
          "Failed to create connection invitation: " + JSON.stringify(result),
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    credential_id: result.cred_ex_id,
  });
}

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ case: string }> }
): Promise<
  NextResponse<OfferCredentialResponse> | NextResponse<ErrorResponse>
> {
  const params = await props.params;
  const tenant = getTenantByCase(params.case);
  const cred_def_id = getVCIdentifiersByCase(params.case).credDefId;
  const data: OfferCredentialData = await request.json();
  return await sendCredential(tenant, cred_def_id, data);
}
