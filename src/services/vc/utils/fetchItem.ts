"server-cli-only";

import type { NextResponse } from "next/server";
import type { AcapyApiClient } from "../acapy-api";

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
