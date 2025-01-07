"server-cli-only";

import {
  ConnRecord,
  type InvitationRecord,
  type InvitationResult,
} from "@/types/vc/acapyApi/acapyInterface";
import type { AcapyApiClient } from "./acapy-api";
import { API_PATH } from "./utils/constants";
import { fetchItem } from "./utils/fetch";

export const getConnection = async (
  acapyApi: AcapyApiClient,
  id: string,
  params: Record<string, string> = {}
): Promise<ConnRecord | null> => {
  return fetchItem(acapyApi, API_PATH.CONNECTIONS, id, params);
};

export const getInvitation = async (
  acapyApi: AcapyApiClient,
  id: string,
  params: Record<string, string> = {}
): Promise<InvitationRecord | null> => {
  return fetchItem(acapyApi, API_PATH.CONNECTIONS_INVITATION(id), "", params);
};

/**
 * Creates an invitation using the provided ACA-Py API client and parameters.
 *
 * @param acapyApi - The ACA-Py API client instance.
 * @param params - The parameters for creating the invitation.
 * @param params.isOob - Indicates if the invitation is out-of-band.
 * @param params.multi - Indicates if the invitation supports multiple connections.
 * @param params.alias - The alias for the invitation. Alias is used to identify the invitation.
 * @param params.my_label - The label for the invitation (only OOB invitations).
 * @param params.goal - (Optional) The goal of the invitation.
 * @param params.goal_code - (Optional) The goal code object containing a code string.
 * @returns A promise that resolves to an `InvitationResult` object or null.
 */
export async function createInvitation(
  acapyApi: AcapyApiClient,
  params: {
    isOob: boolean;
    multi: boolean;
    alias: string;
    my_label: string;
    goal?: string;
    goal_code?: {
      code: string;
    };
  }
): Promise<InvitationResult | null> {
  const code = params.goal_code ? params.goal_code.code : "";
  const result = params.isOob
    ? await createOobInvitation(acapyApi, params.multi, {
        accept: ["didcomm/aip1", "didcomm/aip2;env=rfc19"],
        alias: params.alias,
        goal: params.goal,
        goal_code: code,
        handshake_protocols: [
          "https://didcomm.org/didexchange/1.0",
          "https://didcomm.org/connections/1.0",
        ],
        my_label: params.my_label,
        protocol_version: "1.1",
        use_public_did: false,
      })
    : await createConnectionInvitation(acapyApi, params.alias, params.multi);

  return result;
}

const createConnectionInvitation = async (
  acapyApi: AcapyApiClient,
  alias: string,
  multiUse: boolean
): Promise<InvitationResult> => {
  const response = await acapyApi.postHttp<InvitationResult | null>(
    API_PATH.CONNECTIONS_CREATE_INVITATION,
    {},
    { alias, multi_use: multiUse ? "1" : "0" }
  );

  if (!response.ok) {
    throw new Error(`Error: ${await response.text()}`);
  }

  return response.json();
};

const createOobInvitation = async (
  acapyApi: AcapyApiClient,
  multiUse: boolean,
  payload = {}
): Promise<InvitationResult | null> => {
  const response = await acapyApi.postHttp<InvitationResult | null>(
    API_PATH.OUT_OF_BAND_CREATE,
    payload,
    { multi_use: multiUse ? "1" : "0" }
  );

  if (!response.ok) {
    throw new Error(`Error: ${await response.text()}`);
  }

  return response.json();
};
