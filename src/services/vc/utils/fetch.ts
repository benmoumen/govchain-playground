"server-cli-only";

import { config } from "@/config/vc";
import { NextResponse } from "next/server";
import { type AcapyApiClient } from "../acapy-api";

export async function fetchItem<T>(
  acapyApi: AcapyApiClient,
  url: string,
  id: string | undefined,
  params: Record<string, string> = {}
): Promise<T | object | null> {
  let dataUrl = url;
  if (id) {
    // Normalize if the caller supplies a trailing slash or not
    dataUrl = `${dataUrl.replace(/\/$/, "")}/${id}`;
  }
  console.log(` > fetchItem(${dataUrl})`);
  let result = null;

  const response: NextResponse = await acapyApi.getHttp(dataUrl, params);
  const data = await response.json();

  if (data?.result) {
    // Some acapy resource item calls put things under "result"
    result = data.result;
  } else {
    result = data;
  }
  console.log(result);

  console.log(`< fetchItem(${dataUrl})`);

  return result;
}

export async function fetchList<T>(
  acapyApi: AcapyApiClient,
  url: string,
  params: Record<string, string> = {},
  options?: RequestInit
): Promise<T[]> {
  return fetchListFromAPI<T>(acapyApi, url, params, options);
}

export async function fetchListFromAPI<T>(
  api: AcapyApiClient,
  url: string,
  params: Record<string, string> = {},
  options?: RequestInit
): Promise<T[]> {
  console.log(`> fetchList(${url})`);

  params = { ...params };
  const response: NextResponse = await api.getHttp(url, params, options);
  const data = (await response.json()) as { results?: T[]; result?: T[] };
  const list = data.results || data.result || [];

  console.log(`< fetchList(${url})`);

  return list;
}

export function proxyPath(p: string) {
  let pp = config.acapy.tenantProxyPath;
  if (pp.endsWith("/")) {
    pp = pp.slice(0, -1);
  }
  if (!p.startsWith("/")) {
    p = `/${p}`;
  }

  return `${pp}${p}`;
}
