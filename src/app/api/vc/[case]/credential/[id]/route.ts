import { getTenantByCase } from "@/config/vc";
import { createAcapyApi } from "@/services/vc/acapy-api";
import { getCredential } from "@/services/vc/credential-service";
import type { ErrorResponse, VCIssuer } from "@/types/vc";
import type { V20CredExRecord } from "@/types/vc/acapyApi/acapyInterface";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles the retrieval and response of a credential based on the provided tenant and credential ID.
 *
 * @param tenant - The VCIssuer tenant instance used to create the Acapy API.
 * @param id - The ID of the credential to be retrieved.
 * @returns A promise that resolves to a NextResponse containing either the credential record or an error response.
 *
 * @remarks
 * - If the credential does not exist, a 404 response with an error message is returned.
 * - If the credential state is undefined, a 404 response with an error message is returned.
 */
async function handleCredential(
  tenant: VCIssuer,
  id: string
): Promise<NextResponse<V20CredExRecord> | NextResponse<ErrorResponse>> {
  const acapyApi = createAcapyApi(tenant);
  const credential = await getCredential(acapyApi, id);

  const credentialRecord = credential?.cred_ex_record;

  if (!credentialRecord) {
    return NextResponse.json(
      { error_message: "Credential does not exist" },
      { status: 404 }
    );
  }
  if (credentialRecord.state === undefined) {
    return NextResponse.json(
      {
        error_message:
          "Credential State is undefined: " + JSON.stringify(credential),
      },
      { status: 404 }
    );
  }

  return NextResponse.json(credentialRecord);
}

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ case: string; id: string }> }
): Promise<NextResponse<V20CredExRecord> | NextResponse<ErrorResponse>> {
  const params = await props.params;
  const tenant = getTenantByCase(params.case);
  return await handleCredential(tenant, params.id);
}
