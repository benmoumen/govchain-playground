import { getProofConfigByCase } from "@/config/vc";
import { isValidUUIDv4 } from "@/lib/utils";
import { createAcapyApi } from "@/services/vc/acapy-api";
import { getPresentation } from "@/services/vc/presentation-service";
import type {
  ErrorResponse,
  PresentationStateResponse,
  VCTenant,
} from "@/types/vc";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles the retrieval and response of a presentation based on the provided tenant and presentation ID.
 *
 * @param tenant - The VCTenant instance used to create the Acapy API.
 * @param id - The ID of the presentation to be retrieved.
 * @returns A promise that resolves to a NextResponse containing either the presentation record or an error response.
 *
 * @remarks
 * - If the presentation does not exist, a 404 response with an error message is returned.
 * - If the presentation state is undefined, a 404 response with an error message is returned.
 */
async function handlePresentation(
  tenant: VCTenant,
  id: string
): Promise<
  NextResponse<PresentationStateResponse> | NextResponse<ErrorResponse>
> {
  if (!isValidUUIDv4(id)) {
    return NextResponse.json(
      { error_message: "Invalid Presentation ID format. Must be a UUID v4" },
      { status: 400 }
    );
  }
  const acapyApi = createAcapyApi(tenant);
  const presentationRecord = await getPresentation(acapyApi, id);

  if (!presentationRecord) {
    return NextResponse.json(
      { error_message: "Presentation record does not exist" },
      { status: 404 }
    );
  }
  if (presentationRecord.state === undefined) {
    return NextResponse.json(
      {
        error_message:
          "Presentation State is undefined: " +
          JSON.stringify(presentationRecord),
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    state: presentationRecord.state,
    presentation: presentationRecord,
  });
}

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ case: string; id: string }> }
): Promise<
  NextResponse<PresentationStateResponse> | NextResponse<ErrorResponse>
> {
  const params = await props.params;
  const config = getProofConfigByCase(params.case);
  return await handlePresentation(config.tenant, params.id);
}
