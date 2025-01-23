import { getProofConfigByCase } from "@/config/vc";
import { createAcapyApi } from "@/services/vc/acapy-api";
import { createPresentationRequest } from "@/services/vc/presentation-service";
import type {
  CreatePresentationResponse,
  ErrorResponse,
  VCTenant,
} from "@/types/vc";
import type {
  IndyProofRequest,
  V20PresCreateRequestRequest,
  V20PresExRecord,
} from "@/types/vc/acapyApi/acapyInterface";
import { NextRequest, NextResponse } from "next/server";

/**
 * Creates a presentation request (connectionless).
 *
 * @param tenant - The tenant requesting the proof.
 * @param proofRequest - The proof request to be created.
 * @returns A promise that resolves to a NextResponse containing either the presentation ID or an error message.
 */
async function createPresentation(
  tenant: VCTenant,
  proofRequest: IndyProofRequest
): Promise<
  NextResponse<CreatePresentationResponse> | NextResponse<ErrorResponse>
> {
  const acapyApi = createAcapyApi(tenant);

  const payload: V20PresCreateRequestRequest = {
    auto_verify: true,
    comment: "",
    trace: false,
    presentation_request: { indy: proofRequest },
  };
  const result: V20PresExRecord | null = await createPresentationRequest(
    acapyApi,
    payload
  );

  if (!result?.pres_ex_id) {
    return NextResponse.json(
      {
        error_message:
          "Failed to create the presentation request: " +
          JSON.stringify(result),
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    presentation_exchange_id: result.pres_ex_id,
  });
}

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ case: string }> }
): Promise<
  NextResponse<CreatePresentationResponse> | NextResponse<ErrorResponse>
> {
  const params = await props.params;
  const config = getProofConfigByCase(params.case);
  const tenant = config.tenant;
  const proofRequest: IndyProofRequest = config.proofRequest;

  return await createPresentation(tenant, proofRequest);
}
