"use client";
import type {
  ConnectionStateResponse,
  ErrorResponse,
  InitConnectionResponse,
  PresentationStateResponse,
} from "@/types/vc";
import type {
  AttachmentDef,
  V20PresExRecord,
} from "@/types/vc/acapyApi/acapyInterface";
import type { NextResponse } from "next/server";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import useSWR from "swr";

interface VCPresentationContextType {
  useCase: string;
  isPollingConnection: boolean;
  isPollingPresentation: boolean;
  generatingInvitation: boolean;
  error: boolean;
  invitationUrl: string | null;
  presentationExchangeId: string | null;
  createPresentation: () => Promise<void>;
  presentationRecord: V20PresExRecord | null;
  isPresentationVerified: boolean | null;
}

const VCPresentationContext = createContext<
  VCPresentationContextType | undefined
>(undefined);

export const VPPresentationProvider: React.FC<{
  useCase: string;
  children: React.ReactNode;
}> = ({ useCase, children }) => {
  const [generatingInvitation, setGeneratingInvitation] = useState(false);
  const [connectionId, setConnectionId] = useState<string | null | undefined>();
  const [presentationExchangeId, setPresentationExchangeId] = useState<
    string | null
  >(null);
  const [invitationUrl, setInvitationUrl] = useState<string | null>(null);
  const [shouldPollConnection, setShouldPollConnection] = useState(false);
  const [shouldPollPresentation, setShouldPollPresentation] = useState(false);
  const [pollConnCount, setPollConnCount] = useState(0);
  const [pollPresCount, setPollPresCount] = useState(0);
  const [presentationRecord, setPresentationRecord] =
    useState<V20PresExRecord | null>(null);
  const [isPresentationVerified, setIsPresentationVerified] = useState<
    boolean | null
  >(null);

  const maxPolls = 50;
  const pollInterval = 3000;

  const connectionFetcher = async (url: string) => {
    setPollConnCount((prev) => prev + 1);
    const resp = await fetch(url);
    return resp.json();
  };

  const presentationFetcher = async (url: string) => {
    setPollPresCount((prev) => prev + 1);
    const resp = await fetch(url);
    return resp.json();
  };

  const { data: connectionData, error: connectionError } = useSWR(
    shouldPollConnection && connectionId
      ? `/api/vc/${useCase}/connection/${connectionId}`
      : null,
    connectionFetcher,
    { refreshInterval: pollInterval }
  ) as {
    data: ConnectionStateResponse | undefined;
    error: string | undefined;
  };

  const { data: presentationData, error: presentationError } = useSWR(
    shouldPollPresentation && presentationExchangeId
      ? `/api/vc/${useCase}/presentation/${presentationExchangeId}`
      : null,
    presentationFetcher,
    { refreshInterval: pollInterval }
  ) as {
    data: PresentationStateResponse | undefined;
    error: string | undefined;
  };

  const isConnectionActive = (state?: string) =>
    state === "active" || state === "response";
  const isPresentationDone = (state?: PresentationStateResponse["state"]) =>
    state === "done";

  const createPresentation = useCallback(async () => {
    try {
      // 1) Create presentation request
      const presResp = await fetch(`/api/vc/${useCase}/presentation`, {
        method: "POST",
        cache: "no-store",
      });
      if (!presResp.ok) {
        console.error("Failed to create presentation:", await presResp.text());
        return;
      }
      const { presentation_exchange_id } = await presResp.json();
      setPresentationExchangeId(presentation_exchange_id);

      // 2) Generate new invitation
      setGeneratingInvitation(true);
      setShouldPollConnection(false);
      setShouldPollPresentation(false);
      setPollConnCount(0);
      setPollPresCount(0);

      const resp = (await fetch(`/api/vc/${useCase}/connection`, {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attachments: [
            {
              id: presentation_exchange_id,
              type: "present-proof",
            },
          ] as AttachmentDef[],
        }),
      })) as NextResponse<InitConnectionResponse> | NextResponse<ErrorResponse>;

      if (resp.ok) {
        const res = (await resp.json()) as InitConnectionResponse;
        setInvitationUrl(res.invitation_url);
        setConnectionId(res.connection_id);
        setShouldPollConnection(true);
      } else {
        console.error("Failed to initiate connection:", await resp.text());
      }
    } catch (err) {
      console.error("Error creating presentation:", err);
    } finally {
      setGeneratingInvitation(false);
    }
  }, [useCase]);

  // Polling for connection
  useEffect(() => {
    if (pollConnCount >= maxPolls) {
      setShouldPollConnection(false);
    }
    if (connectionData?.state && isConnectionActive(connectionData.state)) {
      setShouldPollConnection(false);
      setShouldPollPresentation(true);
    }
  }, [connectionData, pollConnCount]);

  // Polling for presentation verification
  useEffect(() => {
    if (pollPresCount >= maxPolls) {
      setShouldPollPresentation(false);
    }
    if (presentationData?.presentation) {
      setPresentationRecord(presentationData?.presentation);
      if (isPresentationDone(presentationData.presentation.state)) {
        setShouldPollPresentation(false);
        if (presentationData.presentation.verified) {
          setIsPresentationVerified(
            presentationData.presentation.verified === "true"
          );
        }
      }
    }
  }, [presentationData, pollPresCount]);

  const value = useMemo(
    () => ({
      useCase,
      isPollingConnection: shouldPollConnection,
      isPollingPresentation: shouldPollPresentation,
      generatingInvitation,
      error: !!(connectionError || presentationError),
      invitationUrl,
      presentationExchangeId,
      createPresentation,
      presentationRecord,
      isPresentationVerified,
    }),
    [
      useCase,
      shouldPollConnection,
      shouldPollPresentation,
      generatingInvitation,
      connectionError,
      presentationError,
      invitationUrl,
      presentationExchangeId,
      createPresentation,
      presentationRecord,
      isPresentationVerified,
    ]
  );

  return (
    <VCPresentationContext.Provider value={value}>
      {children}
    </VCPresentationContext.Provider>
  );
};

export const useVCPresentationContext = () => {
  const context = useContext(VCPresentationContext);
  if (!context) {
    throw new Error(
      "useVCPresentationContext must be used within a VPPresentationProvider"
    );
  }
  return context;
};
