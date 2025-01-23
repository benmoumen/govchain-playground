import { getProofConfigByCase } from "@/config/vc";
import { useVCPresentationContext } from "@/contexts/vc-presentation-context";
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

const InvitationQRCode: React.FC<{
  url: string;
  isDark: boolean;
  verifierName: string;
}> = ({ url, isDark, verifierName }) => (
  <div className="flex flex-col items-center gap-4">
    <p className="text-center text-muted-foreground">
      You are invited by <strong>{verifierName}</strong> to present your proof.
      Scan to proceed.
    </p>
    <ShineBorder
      className="relative flex h-[280px] w-[280px] items-center justify-center rounded-lg border bg-background md:shadow-xl"
      color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
    >
      <QRCodeSVG
        title="Scan the QR code with your wallet"
        value={url}
        size={280}
        marginSize={2}
        fgColor={isDark ? "#fff" : "#000"}
        bgColor={isDark ? "#000" : "#fff"}
      />
    </ShineBorder>
  </div>
);

const ConnectionSuccessAlert: React.FC<{ verifierName: string }> = ({
  verifierName,
}) => (
  <BackgroundLines className="flex w-full flex-col items-center justify-center">
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-green-600 px-6">
      <Waypoints className="h-6 w-6" />
      <h4 className="mb-6 text-center leading-none">
        Your proof has been successfully shared with
        <br />
        <strong>{verifierName}</strong>.
      </h4>
    </div>
  </BackgroundLines>
);

const ConnectionPolling: React.FC<{ message: string }> = ({ message }) => (
  <motion.div
    initial={{ opacity: 1 }}
    animate={{ opacity: [1, 0.2, 1] }}
    transition={{ duration: 2, repeat: Infinity }}
    className="flex items-center justify-center gap-2 p-2"
  >
    <MessageLoading />
    <span className="text-sm text-muted-foreground">{message}</span>
  </motion.div>
);

const NewPresentationButton: React.FC<{
  loading: boolean;
  createPresentation: () => Promise<void>;
}> = ({ loading, createPresentation }) => (
  <Button
    onClick={() => createPresentation()}
    variant="link"
    size="sm"
    disabled={loading}
  >
    {loading ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Creating proof request...
      </>
    ) : (
      <>
        <RefreshCcw className="mr-2 h-4 w-4" />
        Start again
      </>
    )}
  </Button>
);

const VCPresentationCard: React.FC = () => {
  const { resolvedTheme } = useTheme();

  const {
    useCase,
    isPollingConnection,
    isPollingPresentation,
    generatingInvitation,
    error,
    invitationUrl,
    createPresentation,
    presentationRecord,
    isPresentationVerified,
  } = useVCPresentationContext();

  const useCaseConfig = getProofConfigByCase(useCase);

  useEffect(() => {
    createPresentation().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error && !presentationRecord) {
    toast.error("Error while fetching proof state.");
  }

  if (isPresentationVerified) {
    return <ConnectionSuccessAlert verifierName={useCaseConfig.tenant.name} />;
  }

  return (
    <div className="flex min-w-[300px] flex-col items-center justify-center gap-2 p-8">
      {invitationUrl && (
        <InvitationQRCode
          url={invitationUrl}
          isDark={resolvedTheme === "dark"}
          verifierName={useCaseConfig.tenant.name}
        />
      )}

      {(isPollingConnection || isPollingPresentation) && (
        <>
          <ConnectionPolling
            message={
              isPollingConnection
                ? "Checking connection status..."
                : "Checking presentation status..."
            }
          />
          <NewPresentationButton
            loading={generatingInvitation}
            createPresentation={createPresentation}
          />
        </>
      )}
    </div>
  );
};

export default VCPresentationCard;
