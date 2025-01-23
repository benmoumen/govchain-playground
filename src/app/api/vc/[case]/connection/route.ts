import { getTenantByCase } from "@/config/vc";
import { createAcapyApi, type AcapyApiClient } from "@/services/vc/acapy-api";
import {
  createInvitation,
  getConnectionsByInvitationMsgId,
} from "@/services/vc/connection-service";
import type {
  ErrorResponse,
  InitConnectionResponse,
  VCTenant,
} from "@/types/vc";
import type {
  AttachmentDef,
  InvitationResult,
} from "@/types/vc/acapyApi/acapyInterface";
import { NextRequest, NextResponse } from "next/server";

async function handleOobInvitation(
  acapyApi: AcapyApiClient,
  tenant: VCTenant,
  attachments?: AttachmentDef[]
): Promise<NextResponse<InitConnectionResponse> | NextResponse<ErrorResponse>> {
  const conn_alias = `${tenant.shortName}_connection_${Date.now()}`;
  const result = await createInvitation(acapyApi, {
    isOob: true,
    multi: false,
    alias: conn_alias,
    my_label: tenant.shortName,
    attachments: attachments,
  });

  const invitationURL = result?.invitation_url;
  const invitationId = result?.invi_msg_id;
  if (!(invitationURL && invitationId)) {
    return NextResponse.json(
      {
        error_message:
          "Failed to create OOB invitation: " + JSON.stringify(invitationURL),
      },
      { status: 400 }
    );
  }

  const connections = await getConnectionsByInvitationMsgId(
    acapyApi,
    invitationId
  );
  const connection = connections[connections.length - 1];

  if (!connection?.connection_id) {
    return NextResponse.json(
      {
        error_message:
          "Failed to get connection by invitation id: " + invitationId,
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    invitation_url: invitationURL,
    connection_id: connection.connection_id,
  });
}

async function handleConnectionInvitation(
  acapyApi: AcapyApiClient,
  tenant: VCTenant
): Promise<NextResponse<InitConnectionResponse> | NextResponse<ErrorResponse>> {
  const conn_alias = `${tenant.shortName}_connection_${Date.now()}`;
  const result: InvitationResult | null = await createInvitation(acapyApi, {
    isOob: false,
    multi: false,
    alias: conn_alias,
    my_label: tenant.name,
  });

  if (!result?.invitation_url || !result.connection_id) {
    return NextResponse.json(
      {
        error_message:
          "Failed to create connection invitation: " + JSON.stringify(result),
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    invitation_url: result.invitation_url,
    connection_id: result.connection_id,
  });
}

async function handleInvitation(
  tenant: VCTenant,
  isOob: boolean = true,
  attachments?: AttachmentDef[]
): Promise<NextResponse<InitConnectionResponse> | NextResponse<ErrorResponse>> {
  const acapyApi = createAcapyApi(tenant);
  return isOob
    ? handleOobInvitation(acapyApi, tenant, attachments)
    : handleConnectionInvitation(acapyApi, tenant);
}

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ case: string }> }
): Promise<NextResponse<InitConnectionResponse> | NextResponse<ErrorResponse>> {
  const params = await props.params;
  const tenant = getTenantByCase(params.case);
  const { attachments } = (await request.json()) as {
    attachments?: AttachmentDef[];
  };
  return handleInvitation(tenant, true, attachments || undefined);
}
