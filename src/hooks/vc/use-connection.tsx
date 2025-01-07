import type {
  ConnectionStateResponse,
  ErrorResponse,
  InitConnectionResponse,
} from "@/types/vc";
import type { NextResponse } from "next/server";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import useSWR from "swr";

const maxPolls = 50;
const pollInterval = 3000;

const useConnection = (caseParam: string) => {
  const cookieName = `conn_id_${caseParam}`;
  const [cookies] = useCookies([cookieName]);
  const [generatingInvitation, setGeneratingInvitation] =
    useState<boolean>(false);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [invitationUrl, setInvitationUrl] = useState<string | null>(null);
  const [isActiveConnection, setIsActiveConnection] = useState<boolean>(false);
  const [shouldPoll, setShouldPoll] = useState<boolean>(false);
  const [pollCount, setPollCount] = useState<number>(0);

  const fetcher = async (url: string) => {
    setPollCount((prevCount) => prevCount + 1);
    const resp = await fetch(url);
    return await resp.json();
  };

  // poll connection state
  const { data, error } = useSWR(
    connectionId && shouldPoll && pollCount < maxPolls
      ? `/api/vc/${caseParam}/connection/${connectionId}`
      : null,
    fetcher,
    { refreshInterval: pollInterval }
  ) as {
    data: ConnectionStateResponse | undefined;
    error: string | undefined;
  };

  // initiate connection
  const initiateConnection = async (force = false) => {
    if (!force) {
      console.info("Checking for existing connection...");
      const existingConnId = cookies[cookieName];
      if (existingConnId) {
        setConnectionId(existingConnId);
        return;
      }
    }
    console.info("Initiating connection...");

    setGeneratingInvitation(true);
    // reset state
    resetState();
    // initiate connection
    const resp = (await fetch(`/api/vc/${caseParam}/connection`, {
      method: "POST",
      cache: "no-store",
    })) as NextResponse<InitConnectionResponse> | NextResponse<ErrorResponse>;
    if (resp.ok) {
      const res = (await resp.json()) as InitConnectionResponse;
      setInvitationUrl(res.invitation_url);
      setConnectionId(res.connection_id);
      setShouldPoll(true);
    } else {
      console.error("Failed to initiate connection:", await resp.text());
    }
    setGeneratingInvitation(false);
  };

  const resetState = () => {
    setConnectionId(null);
    setInvitationUrl(null);
    setIsActiveConnection(false);
    setShouldPoll(false);
    setPollCount(0);
  };

  useEffect(() => {
    // init polling
    if (connectionId && !isActiveConnection) {
      setShouldPoll(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionId]);

  useEffect(() => {
    // stop polling after max polls
    if (pollCount >= maxPolls) {
      setShouldPoll(false);
    }
  }, [pollCount]);

  useEffect(() => {
    // update state when connection is active
    if (data?.state === "active" || data?.state === "response") {
      setIsActiveConnection(true);
      setShouldPoll(false);
    }
  }, [data]);

  return {
    isActiveConnection,
    isLoading: !error && !data && !!connectionId,
    error: !!error,
    initiateConnection,
    connectionId,
    invitationUrl,
    generatingInvitation,
  };
};

export default useConnection;
