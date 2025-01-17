import { getTenantByCase } from "@/config/vc";
import { createAcapyApi } from "@/services/vc/acapy-api";
import { getCredential } from "@/services/vc/credential-service";
import type { ErrorResponse, VCIssuer } from "@/types/vc";
import type { V20CredExRecord } from "@/types/vc/acapyApi/acapyInterface";
import { NextRequest, NextResponse } from "next/server";

async function handleCredential(
  tenant: VCIssuer,
  id: string
): Promise<NextResponse<V20CredExRecord> | NextResponse<ErrorResponse>> {
  const acapyApi = createAcapyApi(tenant);
  const credential = await getCredential(acapyApi, id);

  if (credential === null) {
    return NextResponse.json(
      { error_message: "Credential does not exist" },
      { status: 404 }
    );
  }
  if (credential.state === undefined) {
    return NextResponse.json(
      { error_message: "Credential State is undefined" },
      { status: 404 }
    );
  }

  return NextResponse.json(credential);
}

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ case: string; id: string }> }
): Promise<NextResponse<V20CredExRecord> | NextResponse<ErrorResponse>> {
  const params = await props.params;
  try {
    const tenant = getTenantByCase(params.case);
    return await handleCredential(tenant, params.id);
  } catch {
    return NextResponse.json(
      { error_message: "Invalid [case] parameter" },
      { status: 400 }
    );
  }
}
