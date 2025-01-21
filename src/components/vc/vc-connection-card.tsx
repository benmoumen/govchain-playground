import { useVCContext } from "@/contexts/vc-context";
import { VCSteps, type VCTenant } from "@/types/vc";
import { Loader2, RefreshCcw, Waypoints } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { QRCodeSVG } from "qrcode.react";
import { useEffect } from "react";
import { toast } from "sonner";
import { BackgroundLines } from "../ui/background-lines";
import { Button } from "../ui/button";
import { GradientButton } from "../ui/gradient-button";
import { MessageLoading } from "../ui/message-loading";
import { ShineBorder } from "../ui/shine-border";

interface VCConnectionCardProps {
  issuer: VCTenant;
  credentialName: string;
  setActiveStep: (step: number) => void;
}

const InvitationQRCode: React.FC<{
  url: string;
  isDark: boolean;
  issuerName: string;
}> = ({ url, isDark, issuerName }) => (
  <div className="flex flex-col items-center gap-4">
    <p className="text-center text-balance text-muted-foreground">
      You are invited to connect with <strong>{issuerName}</strong>. Scan to
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

const ConnectionSuccessAlert: React.FC<{
  issuerName: string;
  credentialName: string;
  setActiveStep: (step: number) => void;
}> = ({ issuerName, credentialName, setActiveStep }) => (
  <BackgroundLines className="items-center justify-center w-full flex-col">
    <div className="w-full h-full flex flex-col items-center justify-center gap-4  text-green-600  dark:text-green-600 [&>svg]:text-green bg-black px-6">
      <Waypoints className="h-6 w-6" />
      <h4 className="leading-none tracking-tight text-center mb-6">
        Your wallet is connected with
        <br />
        <strong>{issuerName}</strong>.
      </h4>

      <GradientButton
        variant={"variant"}
        onClick={() => setActiveStep(VCSteps.REQUEST)}
      >
        Request your {credentialName}
      </GradientButton>
    </div>
  </BackgroundLines>
);

const NewInvitationButton: React.FC<{
  loading: boolean;
  initiateConnection: (force?: boolean) => void;
}> = ({ loading, initiateConnection }) => (
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

const VCConnectionCard: React.FC<VCConnectionCardProps> = ({
  issuer,
  credentialName,
  setActiveStep,
}) => {
  const { resolvedTheme } = useTheme();
  const {
    activeConnection,
    initiateConnection,
    generatingInvitation,
    invitationUrl,
    isPolling,
    error,
  } = useVCContext();

  useEffect(() => {
    console.log("Calling initiate connection");
    initiateConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error && !activeConnection) {
    toast.error("Error while fetching your connection state");
  }

  if (activeConnection) {
    return (
      <>
        <ConnectionSuccessAlert
          issuerName={issuer.name}
          credentialName={credentialName}
          setActiveStep={setActiveStep}
        />
        <div className="my-4 z-10 opacity-85">
          <NewInvitationButton
            loading={generatingInvitation}
            initiateConnection={() => initiateConnection(true)}
          />
        </div>
      </>
    );
  }

  return (
    <div className="min-w-[300px] flex flex-col justify-center items-center gap-2 p-8">
      {invitationUrl && (
        <InvitationQRCode
          url={invitationUrl}
          isDark={resolvedTheme === "dark"}
          issuerName={issuer.name}
        />
      )}

      {isPolling && (
        <>
          <ConnectionPolling />
          <NewInvitationButton
            loading={generatingInvitation}
            initiateConnection={initiateConnection}
          />
        </>
      )}
    </div>
  );
};

export default VCConnectionCard;
