import type {
  CredentialStateResponse,
  ErrorResponse,
  OfferCredentialData,
  OfferCredentialResponse,
} from "@/types/vc";
import type {
  CredAttrSpec,
  V20CredExRecord,
} from "@/types/vc/acapyApi/acapyInterface";
import type { NextResponse } from "next/server";
import { useEffect, useState } from "react";
import useSWR from "swr";

const maxPolls = 50;
const pollInterval = 3000;

const useCredential = (caseParam: string) => {
  const [sendingOffer, setSendingOffer] = useState<boolean>(false);
  const [credentialId, setCredentialId] = useState<string | null | undefined>(
    undefined
  );
  const [credential, setCredential] = useState<V20CredExRecord | null>(null);
  const [shouldPoll, setShouldPoll] = useState<boolean>(false);
  const [pollCount, setPollCount] = useState<number>(0);

  const fetcher = async (url: string) => {
    setPollCount((prevCount) => prevCount + 1);
    const resp = await fetch(url);
    return await resp.json();
  };

  // poll credential state
  const { data, error } = useSWR(
    shouldPoll ? `/api/vc/${caseParam}/credential/${credentialId}` : null,
    fetcher,
    { refreshInterval: pollInterval }
  ) as {
    data: CredentialStateResponse | undefined;
    error: string | undefined;
  };

  // send credential offer
  const sendCredentialOffer = async (
    connectionId: string,
    attributes: CredAttrSpec[]
  ) => {
    console.info("Sending credential offer...");

    setSendingOffer(true);
    setShouldPoll(false);
    setPollCount(0);

    const data: OfferCredentialData = {
      connection_id: connectionId,
      attributes,
    };
    const resp = (await fetch(`/api/vc/${caseParam}/credential`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })) as NextResponse<OfferCredentialResponse> | NextResponse<ErrorResponse>;

    if (resp.ok) {
      const res = (await resp.json()) as OfferCredentialResponse;
      setCredentialId(res.credential_id);
      setShouldPoll(true);
    } else {
      console.error("Failed to send credential offer:", await resp.text());
    }
    setSendingOffer(false);
  };

  const isCredentialIssued = (state?: string) => {
    return state === "credential_issued";
  };

  const updateCredential = (credential: V20CredExRecord) => {
    setCredential(credential);
    setShouldPoll(false);
  };

  useEffect(() => {
    // init polling
    if (credentialId && credential === null) {
      setShouldPoll(true);
    }
  }, [credentialId, credential]);

  useEffect(() => {
    // stop polling after max polls
    if (pollCount >= maxPolls) {
      setShouldPoll(false);
    }
  }, [pollCount]);

  useEffect(() => {
    // update state when credential is issued
    if (data && isCredentialIssued(data.state)) {
      updateCredential(data.credential);
    }
  }, [data]);

  return {
    credential,
    isPolling: shouldPoll,
    error: !!error,
    sendCredentialOffer,
    credentialId,
    sendingOffer,
  };
};

export default useCredential;
