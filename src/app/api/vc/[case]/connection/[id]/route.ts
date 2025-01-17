import { getTenantByCase } from "@/config/vc";
import { createLongLivingCookieOptions } from "@/lib/utils";
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
  caseParam: string,
  tenant: VCIssuer,
  id: string
): Promise<
  NextResponse<ConnectionStateResponse> | NextResponse<ErrorResponse>
> {
  const acapyApi = createAcapyApi(tenant);
  const connection = await getConnection(acapyApi, id);
  // cookie to store the connection id if it is active
  const cookieName = `active_conn_id_${caseParam}`;

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
