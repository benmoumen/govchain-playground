import { getTenantByCase } from "@/config/vc";
import { createAcapyApi } from "@/services/vc/acapy-api";
import { createInvitation } from "@/services/vc/connection-service";
import type {
  ErrorResponse,
  InitConnectionResponse,
  VCIssuer,
} from "@/types/vc";
import { InvitationResult } from "@/types/vc/acapyApi/acapyInterface";
import { NextRequest, NextResponse } from "next/server";

async function handleInvitation(
  tenant: VCIssuer,
  caseParam: string
): Promise<NextResponse<InitConnectionResponse> | NextResponse<ErrorResponse>> {
  const acapyApi = createAcapyApi(tenant);
  const cookieName = `conn_id_${caseParam}`;

  const result: InvitationResult | null = await createInvitation(acapyApi, {
    isOob: true,
    multi: false,
    alias: `${caseParam}_invitation_${Date.now()}`,
    my_label: tenant.shortName,
  });

  if (result?.connection_id && result.invitation_url) {
    const response = NextResponse.json({
      connection_id: result.connection_id,
      invitation_url: result.invitation_url,
    });
    response.cookies.set(cookieName, result.connection_id, { path: "/" });
    return response;
  }

  return NextResponse.json(
    { error_message: "Failed to create invitation" },
    { status: 400 }
  );
}

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ case: string }> }
): Promise<NextResponse<InitConnectionResponse> | NextResponse<ErrorResponse>> {
  const params = await props.params;
  try {
    const tenant = getTenantByCase(params.case);
    return await handleInvitation(tenant, params.case);
  } catch {
    return NextResponse.json(
      { error_message: "Invalid [case] parameter" },
      { status: 400 }
    );
  }
}
