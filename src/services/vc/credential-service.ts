import type {
  V20CredExRecord,
  V20CredExRecordDetail,
  V20CredOfferRequest,
} from "@/types/vc/acapyApi/acapyInterface";
import type { AcapyApiClient } from "./acapy-api";
import { API_PATH } from "./utils/constants";
import { fetchItem } from "./utils/fetch";

export const offerCredential = async (
  acapyApi: AcapyApiClient,
  payload: V20CredOfferRequest
): Promise<V20CredExRecord | null> => {
  const response = await acapyApi.postHttp<V20CredExRecord | null>(
    API_PATH.ISSUE_CREDENTIALS_20_SEND_OFFER,
    payload
  );

  if (!response.ok) {
    throw new Error(
      `Error while offering credential: ${await response.text()}`
    );
  }

  return response.json();
};

export const getCredential = async (
  acapyApi: AcapyApiClient,
  id: string,
  params: Record<string, string> = {}
): Promise<V20CredExRecordDetail | null> => {
  return fetchItem(acapyApi, API_PATH.ISSUE_CREDENTIAL_20_RECORDS, id, params);
};
