import { getTenantByCase } from "@/config/vc";
import { createAcapyApi } from "@/services/vc/acapy-api";
import {
  createInvitation,
  getConnection,
} from "@/services/vc/connection-service";
import type { VCIssuer } from "@/types/vc";
import { InvitationResult } from "@/types/vc/acapyApi/acapyInterface";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { case: string } }
): Promise<
  | NextResponse<{
      connection_id: string;
      invitation_url?: string;
      state?: string;
    }>
  | NextResponse<{ message: string }>
> {
  let tenant: VCIssuer;
  try {
    tenant = getTenantByCase(params.case);
  } catch {
    return NextResponse.json(
      { message: "Invalid [case] parameter" },
      { status: 400 }
    );
  }

  // Initialize the ACA-Py API client
  const acapyApi = createAcapyApi(tenant);

  // Check if the connection already exists
  const tenantId = tenant.tenantId;
  const cookieName = `conn_id_${tenantId}`;
  const connId = request.cookies.get(cookieName)?.value;

  if (connId) {
    // If the connection already exists, return the connection state
    const connection = await getConnection(acapyApi, connId);
    return NextResponse.json({
      connection_id: connId,
      state: connection?.state,
    });
  } else {
    // If the connection does not exist, create a new invitation
    const result: InvitationResult | null = await createInvitation(acapyApi, {
      isOob: true,
      multi: false,
      alias: params.case + "_invitation_" + Date.now(),
      my_label: tenant.shortName,
    });
    if (result?.connection_id && result.invitation_url) {
      // Return the connection ID and invitation URL
      const res = NextResponse.json({
        connection_id: result.connection_id,
        invitation_url: result.invitation_url,
      });
      // Set the connection ID in a cookie
      res.cookies.set(cookieName, result.connection_id, { path: "/" });
      return res;
    } else {
      // Return an error message if the invitation failed
      return NextResponse.json(
        { message: "Failed to create invitation" },
        { status: 400 }
      );
    }
  }
}
