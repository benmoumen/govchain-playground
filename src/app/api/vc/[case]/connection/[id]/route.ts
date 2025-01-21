import { getTenantByCase } from "@/config/vc";
import { createLongLivingCookieOptions, isValidUUIDv4 } from "@/lib/utils";
import { getActiveConnectionCookieName } from "@/lib/vc";
import { createAcapyApi } from "@/services/vc/acapy-api";
import { getConnection } from "@/services/vc/connection-service";
import type {
  ConnectionStateResponse,
  ErrorResponse,
  VCTenant,
} from "@/types/vc";
import { NextRequest, NextResponse } from "next/server";

async function handleConnection(
  request: NextRequest,
  caseParam: string,
  tenant: VCTenant,
  id: string
): Promise<
  NextResponse<ConnectionStateResponse> | NextResponse<ErrorResponse>
> {
  if (!isValidUUIDv4(id)) {
    return NextResponse.json(
      { error_message: "Invalid connection ID format. Must be a UUID v4" },
      { status: 400 }
    );
  }
  const acapyApi = createAcapyApi(tenant);
  const connection = await getConnection(acapyApi, id);
  // cookie to store the connection id if it is active
  const cookieName = getActiveConnectionCookieName(tenant.tenantId);

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

  const response = NextResponse.json({
    state: connection.state,
    connection: connection,
  });

  if (connection.state === "active" || connection.state === "response") {
    response.cookies.set(createLongLivingCookieOptions(cookieName, id));
  }

  return response;
}

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ case: string; id: string }> }
): Promise<
  NextResponse<ConnectionStateResponse> | NextResponse<ErrorResponse>
> {
  const params = await props.params;
  const tenant = getTenantByCase(params.case);
  return await handleConnection(request, params.case, tenant, params.id);
}
