"server-cli-only";

import type { VCIssuer } from "@/types/vc";
import prisma from "@myprisma/client";
import { NextRequest } from "next/server";
import "server-cli-only";
import { API_PATH } from "./utils/constants";
import { proxyPath } from "./utils/fetch";

export async function requestAccessToken(
  tenant: VCIssuer,
  isApiKey: boolean
): Promise<string | null> {
  // Load the Tenant Password from the .env file
  const apiKeyVar = tenant.apiKeyVar;
  const apiKey = process.env[apiKeyVar];
  if (apiKey) {
    console.log("TenantAuthProvider.useEffect: password", apiKey);
    console.log("TenantAuthProvider.useEffect: login");
  } else {
    console.error(`Missing Tenant API Key [${apiKeyVar}] in .env`, process.env);
    return null;
  }

  const payload: { api_key?: string; wallet_key?: string } = isApiKey
    ? { api_key: apiKey }
    : { wallet_key: apiKey };

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
export async function getAccessToken(
  tenant: VCIssuer,
  isApiKey: boolean
): Promise<string | null> {
  // Check if the access token already exists in the database
  const existingToken = await prisma.tenantAuth.findUnique({
    where: { tenantId: tenant.tenantId },
  });

  if (existingToken) {
    return existingToken.accessToken;
  }

  // If the token does not exist, request a new one
  const newToken = await requestAccessToken(tenant, isApiKey);
  if (newToken) {
    // Save the new token to the database
    await prisma.tenantAuth.create({
      data: {
        tenantId: tenant.tenantId,
        accessToken: newToken,
      },
    });
  }

  return newToken;
}
