import { getTenantByCase } from "@/config/vc";
import { createAcapyApi } from "@/services/vc/acapy-api";
import {
  createInvitation,
  getConnectionsByInvitationMsgId,
} from "@/services/vc/connection-service";
import type {
  ErrorResponse,
  InitConnectionResponse,
  VCIssuer,
} from "@/types/vc";
import { InvitationRecord } from "@/types/vc/acapyApi/acapyInterface";
import { NextRequest, NextResponse } from "next/server";

async function handleInvitation(
  tenant: VCIssuer,
  caseParam: string
): Promise<NextResponse<InitConnectionResponse> | NextResponse<ErrorResponse>> {
  const acapyApi = createAcapyApi(tenant);
  const cookieName = `conn_id_${caseParam}`;

  const conn_alias = `${caseParam}_connection_${Date.now()}`;
  // create an invitation
  const result: InvitationRecord | null = await createInvitation(acapyApi, {
    isOob: true,
    multi: false,
    alias: conn_alias,
    my_label: tenant.shortName,
  });

  if (result?.invitation_url && result.invi_msg_id) {
    // fetch the connection by the invitation message id
    // this is necessary to get the connection_id
    const connections = await getConnectionsByInvitationMsgId(
      acapyApi,
      result.invi_msg_id
    );
    // pick the last connection (normally there should be only one)
    const connection = connections[connections.length - 1];
    if (!connection || !connection.connection_id) {
      return NextResponse.json(
        {
          error_message: "Failed to get connection by invitation message id",
        },
        { status: 400 }
      );
    }

    const response = NextResponse.json({
      invitation_url: result.invitation_url,
      connection_id: connection.connection_id,
    });

    response.cookies.set(cookieName, connection.connection_id, { path: "/" });
    return response;
  }

  return NextResponse.json(
    {
      error_message:
        "Failed to create invitation. Result was:" + JSON.stringify(result),
    },
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
