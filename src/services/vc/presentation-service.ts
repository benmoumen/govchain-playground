import type {
  V20PresCreateRequestRequest,
  V20PresExRecord,
  V20PresSendRequestRequest,
} from "@/types/vc/acapyApi/acapyInterface";
import type { AcapyApiClient } from "./acapy-api";
import { API_PATH } from "./utils/constants";
import { fetchItem } from "./utils/fetch";

export const sendPresentationRequest = async (
  acapyApi: AcapyApiClient,
  payload: V20PresSendRequestRequest
): Promise<V20PresExRecord | null> => {
  const response = await acapyApi.postHttp<V20PresExRecord | null>(
    API_PATH.PRESENT_PROOF_20_SEND_REQUEST,
    payload
  );

  if (!response.ok) {
    throw new Error(
      `Error while sending presentation request: ${await response.text()}`
    );
  }

  return response.json();
};

export const createPresentationRequest = async (
  acapyApi: AcapyApiClient,
  payload: V20PresCreateRequestRequest
): Promise<V20PresExRecord | null> => {
  const response = await acapyApi.postHttp<V20PresExRecord | null>(
    API_PATH.PRESENT_PROOF_20_CREATE_REQUEST,
    payload
  );

  if (!response.ok) {
    throw new Error(
      `Error while creating presentation request: ${await response.text()}`
    );
  }

  return response.json();
};

export const getPresentation = async (
  acapyApi: AcapyApiClient,
  id: string,
  params: Record<string, string> = {}
): Promise<V20PresExRecord | null> => {
  return fetchItem(acapyApi, API_PATH.PRESENT_PROOF_20_RECORDS, id, params);
};
