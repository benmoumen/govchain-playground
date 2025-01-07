"server-cli-only";

import { config } from "@/config/vc";
import { NextResponse } from "next/server";

export interface AcapyApiClient {
  getHttp: <T>(
    url: string,
    params?: Record<string, string>,
    options?: RequestInit
  ) => Promise<NextResponse<T>>;
  postHttp: <T>(
    url: string,
    data?: unknown,
    params?: Record<string, string>,
    options?: RequestInit
  ) => Promise<NextResponse<T>>;
  updateHttp: <T>(
    url: string,
    data?: unknown,
    params?: Record<string, string>,
    options?: RequestInit
  ) => Promise<NextResponse<T>>;
  putHttp: <T>(
    url: string,
    data?: unknown,
    params?: Record<string, string>,
    options?: RequestInit
  ) => Promise<NextResponse<T>>;
  patchHttp: <T>(
    url: string,
    data?: unknown,
    params?: Record<string, string>,
    options?: RequestInit
  ) => Promise<NextResponse<T>>;
  deleteHttp: <T>(
    url: string,
    data?: unknown,
    params?: Record<string, string>,
    options?: RequestInit
  ) => Promise<NextResponse<T>>;
}

export const createAcapyApi = (
  tenantAccessToken: string,
  clearTenantToken: () => void
): AcapyApiClient => {
  const baseUrl = config.acapy.tenantProxyPath;

  const callAcapyApi = async <T,>(
    url: string,
    method: string,
    options: RequestInit = {},
    params?: Record<string, string>
  ): Promise<NextResponse<T>> => {
    const headers = {
      "Content-Type": "application/json",
      accept: "application/json",
      Authorization: `Bearer ${tenantAccessToken}`,
      ...options.headers,
    };

    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    const response = await fetch(baseUrl + url + queryString, {
      method,
      ...options,
      headers,
    });

    if (response.status === 401) {
      clearTenantToken();
      throw new Error(`Unauthorized: ${await response.text()}`);
    }

    if (!response.ok) {
      throw new Error(`Error: ${await response.text()}`);
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  };

  const getHttp = async <T,>(
    url: string,
    params?: Record<string, string>,
    options: RequestInit = {}
  ): Promise<NextResponse<T>> => {
    return callAcapyApi(url, "GET", options, params);
  };

  const postHttp = async <T,>(
    url: string,
    data: unknown = {},
    params?: Record<string, string>,
    options: RequestInit = {}
  ): Promise<NextResponse<T>> => {
    return callAcapyApi(
      url,
      "POST",
      {
        ...options,
        body: JSON.stringify(data),
      },
      params
    );
  };

  const updateHttp = async <T,>(
    url: string,
    data: unknown = {},
    params?: Record<string, string>,
    options: RequestInit = {}
  ): Promise<NextResponse<T>> => {
    return callAcapyApi(
      url,
      "UPDATE",
      {
        ...options,
        body: JSON.stringify(data),
      },
      params
    );
  };

  const putHttp = async <T,>(
    url: string,
    data: unknown = {},
    params?: Record<string, string>,
    options: RequestInit = {}
  ): Promise<NextResponse<T>> => {
    return callAcapyApi(
      url,
      "PUT",
      {
        ...options,
        body: JSON.stringify(data),
      },
      params
    );
  };

  const patchHttp = async <T,>(
    url: string,
    data: unknown = {},
    params?: Record<string, string>,
    options: RequestInit = {}
  ): Promise<NextResponse<T>> => {
    return callAcapyApi(
      url,
      "PATCH",
      {
        ...options,
        body: JSON.stringify(data),
      },
      params
    );
  };

  const deleteHttp = async <T,>(
    url: string,
    data: unknown = {},
    params?: Record<string, string>,
    options: RequestInit = {}
  ): Promise<NextResponse<T>> => {
    return callAcapyApi(
      url,
      "DELETE",
      {
        ...options,
        body: JSON.stringify(data),
      },
      params
    );
  };

  return { getHttp, postHttp, updateHttp, putHttp, patchHttp, deleteHttp };
};
