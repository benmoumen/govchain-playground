import { getTenantByCase } from "@/config/vc";
import { createAcapyApi } from "@/services/vc/acapy-api";
import { getConnection } from "@/services/vc/connection-service";
import type {
  ConnectionStateResponse,
  ErrorResponse,
  VCIssuer,
} from "@/types/vc";
import { NextRequest, NextResponse } from "next/server";

async function handleConnection(
  request: NextRequest,
  tenant: VCIssuer,
  id: string
): Promise<
  NextResponse<ConnectionStateResponse> | NextResponse<ErrorResponse>
> {
  const acapyApi = createAcapyApi(tenant);
  const connection = await getConnection(acapyApi, id);

  if (connection === null) {
    return NextResponse.json(
      { error_message: "Connection does not exist" },
      { status: 404 }
    );
  }
  if (connection.state === undefined) {
    return NextResponse.json(
      { error_message: "Connection State is undefined" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    state: connection.state,
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { case: string; id: string } }
): Promise<
  NextResponse<ConnectionStateResponse> | NextResponse<ErrorResponse>
> {
  try {
    const tenant = getTenantByCase(params.case);
    return await handleConnection(request, tenant, params.id);
  } catch {
    return NextResponse.json(
      { error_message: "Invalid [case] parameter" },
      { status: 400 }
    );
  }
}
