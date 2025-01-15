import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import useConnection from "@/hooks/vc/use-connection";
import type { VCIssuer } from "@/types/vc";
import type { ConnRecord } from "@/types/vc/acapyApi/acapyInterface";
import { Loader2, RefreshCcw, Waypoints } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { QRCodeSVG } from "qrcode.react";
import { useEffect } from "react";
import { toast } from "sonner";
import { BackgroundLines } from "../ui/background-lines";
import { Button } from "../ui/button";
import { MessageLoading } from "../ui/message-loading";
import { ShineBorder } from "../ui/shine-border";

interface VCConnectionCardProps {
  useCase: string;
  issuer: VCIssuer;
  credentialName: string;
  setConnection?: (conn: ConnRecord) => void;
}

const VCConnectionCard: React.FC<VCConnectionCardProps> = ({
  useCase,
  issuer,
  credentialName,
  setConnection,
}) => {
  const { resolvedTheme } = useTheme();
  const {
    activeConnection,
    initiateConnection,
    generatingInvitation,
    invitationUrl,
    isPolling,
    error,
  } = useConnection(useCase);

  useEffect(() => {
    if (activeConnection) {
      //setConnection(activeConnection);
      console.log("Connection has been made successfully!");
    }
  }, [activeConnection, setConnection]);

  useEffect(() => {
    console.log("Calling initiate connection");
    initiateConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const InvitationQRCode: React.FC<{ url: string; isDark: boolean }> = ({
    url,
    isDark,
  }) => (
    <div className="flex flex-col items-center gap-4">
      <p className="text-center text-balance text-muted-foreground">
        You are invited to connect with <strong>{issuer.name}</strong>. Scan to
        proceed.
      </p>

      <ShineBorder
        className="relative flex h-[280px] w-[280px] flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl"
        color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
      >
        <QRCodeSVG
          title="Scan the QR code to connect"
          value={url}
          size={280}
          marginSize={3}
          fgColor={isDark ? "#fff" : "#000"}
          bgColor={isDark ? "#000" : "#fff"}
        />
      </ShineBorder>
    </div>
  );

  const ConnectionSuccessAlert: React.FC = () => (
    <BackgroundLines className="items-center justify-center w-full flex-col px-4">
      <Alert variant={"success"}>
        <Waypoints className="h-4 w-4" />
        <AlertTitle>
          You can now request your <strong>{credentialName}</strong>.
        </AlertTitle>
        <AlertDescription>
          Your wallet is connected with <strong>{issuer.name}</strong>.
        </AlertDescription>
      </Alert>
    </BackgroundLines>
  );

  const NewInvitationButton: React.FC<{ loading: boolean }> = ({ loading }) => (
    <Button
      onClick={() => initiateConnection(true)}
      variant={"link"}
      size={"sm"}
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" />
          Creating invitation...
        </>
      ) : (
        <>
          <RefreshCcw />
          Request a new invitation
        </>
      )}
    </Button>
  );

  const ConnectionPolling: React.FC = () => (
    <motion.div
      initial={{
        opacity: 1,
      }}
      animate={{
        opacity: [1, 0.2, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
      }}
      className="flex justify-center items-center gap-2 p-2"
    >
      <MessageLoading />
      <span className="text-muted-foreground text-sm">
        Checking connection status...
      </span>
    </motion.div>
  );

  if (error && !activeConnection) {
    toast.error("Error while fetching your connection state");
  }

  return (
    <div className="min-w-[300px] flex flex-col justify-center items-center gap-2">
      {activeConnection ? (
        <ConnectionSuccessAlert />
      ) : (
        invitationUrl && (
          <InvitationQRCode
            url={invitationUrl}
            isDark={resolvedTheme === "dark"}
          />
        )
      )}

      {isPolling && (
        <>
          <ConnectionPolling />
          <NewInvitationButton loading={generatingInvitation} />
        </>
      )}
    </div>
  );
};

export default VCConnectionCard;
