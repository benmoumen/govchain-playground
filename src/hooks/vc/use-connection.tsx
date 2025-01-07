import type { ConnectionStateResponse } from "@/types/vc";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import useSWR from "swr";

const useConnection = (caseParam: string) => {
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [invitationUrl, setInvitationUrl] = useState<string | null>(null);
  const [shouldPoll, setShouldPoll] = useState<boolean>(false);
  const cookieName = `conn_id_${caseParam}`;
  const [cookies] = useCookies([cookieName]);

  const fetcher = async (url: string) => {
    const resp = await fetch(url);
    if (resp.ok) {
      const data = await resp.json();
      setInvitationUrl(data.invitation_url || null);
      const connId = cookies[cookieName];
      if (connId) {
        setConnectionId(connId);
      }
    }
  };

  const { data, error } = useSWR(
    shouldPoll && connectionId
      ? `/api/vc/${caseParam}/connection/${connectionId}`
      : null,
    fetcher,
    { refreshInterval: 3000 }
  ) as {
    data: ConnectionStateResponse | undefined;
    error: string | undefined;
  };

  useEffect(() => {
    if (connectionId) {
      setShouldPoll(true);
    }
  }, [connectionId]);

  useEffect(() => {
    if (data?.state === "active") {
      setShouldPoll(false);
    }
  }, [data]);

  const stopPolling = () => {
    setShouldPoll(false);
  };

  const initiateConnection = async () => {
    const resp = await fetch(`/api/vc/${caseParam}/connection`, {
      method: "POST",
      cache: "no-store",
    });
    if (resp.ok) {
      const data = await resp.json();
      setInvitationUrl(data.invitation_url || null);
      const connId = cookies[cookieName];
      if (connId) {
        setConnectionId(connId);
      }
    }
  };

  return {
    isActiveConnection: data?.state === "active",
    isLoading: !error && !data && !!connectionId,
    error: !!error,
    initiateConnection,
    connectionId,
    invitationUrl,
    stopPolling,
  };
};

export default useConnection;
