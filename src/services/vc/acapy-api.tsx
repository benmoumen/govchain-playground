"server-cli-only";

import { config } from "@/config/vc";
import { FailedRequestError, UnauthorizedAccessError } from "@/lib/errors";
import type { VCIssuer } from "@/types/vc";
import { NextResponse } from "next/server";
import { clearTenantToken, getAccessToken } from "./tenant-auth";

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

/**
 * Creates an instance of the ACAPY API client for a given tenant.
 *
 * @param {VCIssuer} tenant - The tenant for which the ACAPY API client is created.
 * @returns {AcapyApiClient} - An object containing methods to make HTTP requests to the ACAPY service.
 */
export const createAcapyApi = (tenant: VCIssuer): AcapyApiClient => {
  const baseUrl = config.acapy.tenantProxyPath;

  /**
   * Makes an API call to the ACAPY service.
   *
   * @template T - The expected response type.
   * @param {string} url - The endpoint URL to call.
   * @param {string} method - The HTTP method to use (e.g., 'GET', 'POST').
   * @param {RequestInit} [options={}] - Additional options for the fetch request.
   * @param {Record<string, string>} [params] - Optional query parameters to include in the request.
   * @returns {Promise<NextResponse<T>>} - A promise that resolves to the response from the ACAPY service.
   * @throws {UnauthorizedAccessError} - If the request is unauthorized.
   * @throws {FailedRequestError} - If the request fails.
   */
  const callAcapyApi = async <T,>(
    url: string,
    method: string,
    options: RequestInit = {},
    params?: Record<string, string>
  ): Promise<NextResponse<T>> => {
    const maxRetries = 1;
    let retryCount = 0;

    // Function to make the API call
    const makeRequest = async (): Promise<NextResponse<T>> => {
      // Get the Tenant Access Token from ACAPY or DB if it already exists
      const accessToken = await getAccessToken(tenant, true);
      if (accessToken === null) {
        throw new UnauthorizedAccessError(
          `Failed to authenticate to tenant: ${tenant.shortName}.`
        );
      }

      // Set the request headers
      const headers = {
        "Content-Type": "application/json",
        accept: "application/json",
        Authorization: `Bearer ${accessToken.token}`,
        ...options.headers,
      };
      // Construct the query string
      const queryString = params
        ? `?${new URLSearchParams(params).toString()}`
        : "";
      // Make the fetch request
      const response = await fetch(baseUrl + url + queryString, {
        method,
        ...options,
        headers,
      });

      // Handle the response
      if (response.status === 401) {
        clearTenantToken(tenant.tenantId);
        // Retry the request if the token is new and the retry count is less than the max
        if (accessToken.isNewToken === false && retryCount < maxRetries) {
          retryCount++;
          return makeRequest();
        }

        throw new UnauthorizedAccessError(
          `Unauthorized access after retry: ${tenant.shortName}.`
        );
      }

      if (!response.ok) {
        throw new FailedRequestError(`Error: ${await response.text()}`);
      }

      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    };

    // Initial request with the existing token
    return makeRequest();
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
