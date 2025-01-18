"use client";
import { getActiveConnectionCookieName } from "@/lib/vc";
import type {
  ConnectionStateResponse,
  ErrorResponse,
  InitConnectionResponse,
} from "@/types/vc";
import type { ConnRecord } from "@/types/vc/acapyApi/acapyInterface";
import type { NextResponse } from "next/server";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useCookies } from "react-cookie";
import useSWR from "swr";

interface VCContextType {
  useCase: string;
  activeConnection: ConnRecord | null;
  isPolling: boolean;
  error: boolean;
  initiateConnection: (force?: boolean) => Promise<void>;
  connectionId: string | null | undefined;
  invitationUrl: string | null;
  generatingInvitation: boolean;
}

const VCContext = createContext<VCContextType | undefined>(undefined);

export const VCProvider: React.FC<{
  useCase: string;
  children: React.ReactNode;
}> = ({ useCase, children }) => {
  const cookieName = getActiveConnectionCookieName(useCase);
  const [cookies] = useCookies([cookieName]);
  const [generatingInvitation, setGeneratingInvitation] =
    useState<boolean>(false);
  const [connectionId, setConnectionId] = useState<string | null | undefined>(
    undefined
  );
  const [invitationUrl, setInvitationUrl] = useState<string | null>(null);
  const [activeConnection, setActiveConnection] = useState<ConnRecord | null>(
    null
  );
  const [shouldPoll, setShouldPoll] = useState<boolean>(false);
  const [pollCount, setPollCount] = useState<number>(0);

  const maxPolls = 50;
  const pollInterval = 3000;

  const fetcher = async (url: string) => {
    setPollCount((prevCount) => prevCount + 1);
    const resp = await fetch(url);
    return await resp.json();
  };

  // poll connection state
  const { data, error } = useSWR(
    shouldPoll ? `/api/vc/${useCase}/connection/${connectionId}` : null,
    fetcher,
    { refreshInterval: pollInterval }
  ) as {
    data: ConnectionStateResponse | undefined;
    error: string | undefined;
  };

  // initiate connection
  const initiateConnection = useCallback(
    async (force = false) => {
      if (!force) {
        console.info("Checking for active connection...");
        const activeConnId = cookies[cookieName];
        if (activeConnId) {
          // check if connection is active (one time check, no polling)
          console.info("Active connection found:", activeConnId);
          console.info("Fetching connection...");
          const resp = (await fetch(
            `/api/vc/${useCase}/connection/${activeConnId}`
          )) as
            | NextResponse<ConnectionStateResponse>
            | NextResponse<ErrorResponse>;
          if (resp.ok) {
            const res = (await resp.json()) as ConnectionStateResponse;
            if (isConnectionActive(res.state)) {
              console.info("Connection loaded!");
              updateActiveConnection(res.connection);
              return;
            }
            console.info("Connection is not active.");
            // connection is not active => generate new invitation
          } else {
            console.error(
              "Connection not found or Error occured:",
              await resp.text()
            );
          }
        }
        // no existing connection
        setConnectionId(null);
      }
      console.info("Generating new invitation...");

      setGeneratingInvitation(true);
      setShouldPoll(false);
      setPollCount(0);
      // initiate connection
      const resp = (await fetch(`/api/vc/${useCase}/connection`, {
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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const isConnectionActive = (state?: string) => {
    return state === "active" || state === "response";
  };

  const updateActiveConnection = (connection: ConnRecord) => {
    setActiveConnection(connection);
    setShouldPoll(false);
  };

  useEffect(() => {
    // init polling
    if (connectionId && activeConnection === null) {
      setShouldPoll(true);
    }
  }, [connectionId, activeConnection]);

  useEffect(() => {
    // stop polling after max polls
    if (pollCount >= maxPolls) {
      setShouldPoll(false);
    }
  }, [pollCount]);

  useEffect(() => {
    // update state when connection is active
    if (data && isConnectionActive(data.state)) {
      updateActiveConnection(data.connection);
    }
  }, [data]);

  const value = useMemo(
    () => ({
      useCase,
      activeConnection,
      isPolling: shouldPoll,
      error: !!error,
      initiateConnection,
      connectionId,
      invitationUrl,
      generatingInvitation,
    }),
    [
      useCase,
      activeConnection,
      shouldPoll,
      error,
      initiateConnection,
      connectionId,
      invitationUrl,
      generatingInvitation,
    ]
  );

  return <VCContext.Provider value={value}>{children}</VCContext.Provider>;
};

export const useVCContext = () => {
  const context = useContext(VCContext);
  if (!context) {
    throw new Error("useVCContext must be used within a VCProvider");
  }
  return context;
};
