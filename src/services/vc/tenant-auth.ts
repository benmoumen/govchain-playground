"server-cli-only";

import type { VCIssuer } from "@/types/vc";
import { NextRequest } from "next/server";
import "server-cli-only";
import { API_PATH } from "./utils/constants";
import { proxyPath } from "./utils/fetch";

export async function requestAccessToken(
  tenant: VCIssuer,
  isApiKey: boolean
): Promise<string | null> {
  // Load the Tenant Password from the .env file
  const passwordVar = tenant.passwordVar;
  const password = process.env[passwordVar];
  if (password) {
    console.log("TenantAuthProvider.useEffect: password", password);
    console.log("TenantAuthProvider.useEffect: login");
  } else {
    console.error(
      "TenantAuthProvider.useEffect:",
      `Missing tenant password [${passwordVar}] in .env`,
      process.env
    );
    return null;
  }

  const payload: { api_key?: string; wallet_key?: string } = isApiKey
    ? { api_key: password }
    : { wallet_key: password };

  const url = proxyPath(
    isApiKey
      ? API_PATH.MULTITENANCY_TENANT_TOKEN(tenant.tenantId)
      : API_PATH.MULTITENANCY_WALLET_TOKEN(tenant.tenantId)
  );

  const request = new NextRequest(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const response = await fetch(request);
  if (!response.ok) {
    throw new Error(`Failed to request access token: ${response.statusText}`);
  }

  const data = await response.json();
  const newToken = data.token as string;
  return newToken;
}
