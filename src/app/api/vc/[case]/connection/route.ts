import { getTenantByCase } from "@/config/vc";
import { createAcapyApi, type AcapyApiClient } from "@/services/vc/acapy-api";
import {
  createInvitation,
  getConnectionsByInvitationMsgId,
} from "@/services/vc/connection-service";
import type {
  ErrorResponse,
  InitConnectionResponse,
  VCIssuer,
} from "@/types/vc";
import type { InvitationResult } from "@/types/vc/acapyApi/acapyInterface";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles the creation of an out-of-band (OOB) connection invitation (recommended way).
 *
 * @param acapyApi - The ACA-PY API client instance.
 * @param tenant - The Verifiable Credentials issuer information.
 * @param caseParam - The case parameter used to create a unique connection alias.
 *
 * @returns A Promise that resolves to either:
 * - A successful response containing the invitation URL and connection ID.
 * - An error response with status 400 if the invitation creation fails.
 *
 * @throws Will return a 400 response if the invitation creation fails or required fields are missing.
 */
async function handleOobInvitation(
  acapyApi: AcapyApiClient,
  tenant: VCIssuer,
  caseParam: string
): Promise<NextResponse<InitConnectionResponse> | NextResponse<ErrorResponse>> {
  const conn_alias = `${caseParam}_connection_${Date.now()}`;
  const result = await createInvitation(acapyApi, {
    isOob: true,
    multi: false,
    alias: conn_alias,
    my_label: tenant.shortName,
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

/**
 * Handles the creation of a connection invitation following the Connections Protocol (deprecated).
 *
 * @param acapyApi - The ACA-PY API client instance
 * @param tenant - The Verifiable Credentials issuer information
 * @param caseParam - The case parameter used to create a unique connection alias
 *
 * @returns A Promise that resolves to either:
 * - A successful response containing the invitation URL and connection ID
 * - An error response with status 400 if the invitation creation fails
 *
 * @throws Will return a 400 response if the invitation creation fails or required fields are missing
 */
async function handleConnectionInvitation(
  acapyApi: AcapyApiClient,
  tenant: VCIssuer,
  caseParam: string
): Promise<NextResponse<InitConnectionResponse> | NextResponse<ErrorResponse>> {
  const conn_alias = `${caseParam}_connection_${Date.now()}`;
  const result: InvitationResult | null = await createInvitation(acapyApi, {
    isOob: false,
    multi: false,
    alias: conn_alias,
    my_label: tenant.shortName,
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

/**
 * Handles the creation of a connection invitation.
 * @param tenant - The credential issuer information.
 * @param caseParam - The case identifier for the connection.
 * @param isOob - Flag indicating whether to create an out-of-band invitation (recommended).
 * @returns A Promise that resolves to a NextResponse containing either the InitConnectionResponse or ErrorResponse.
 */
async function handleInvitation(
  tenant: VCIssuer,
  caseParam: string,
  isOob: boolean
): Promise<NextResponse<InitConnectionResponse> | NextResponse<ErrorResponse>> {
  const acapyApi = createAcapyApi(tenant);
  return isOob
    ? handleOobInvitation(acapyApi, tenant, caseParam)
    : handleConnectionInvitation(acapyApi, tenant, caseParam);
}

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ case: string }> }
): Promise<NextResponse<InitConnectionResponse> | NextResponse<ErrorResponse>> {
  const params = await props.params;
  try {
    const tenant = getTenantByCase(params.case);
    const isOob = true; // Use out-of-band invitation (recommended)
    return await handleInvitation(tenant, params.case, isOob);
  } catch {
    return NextResponse.json(
      { error_message: "Invalid [case] parameter" },
      { status: 400 }
    );
  }
}
