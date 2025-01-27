"use client";
import { getProofConfigByCase } from "@/config/vc";
import { useVCPresentationContext } from "@/contexts/vc-presentation-context";
import { Loader2, PartyPopper, RefreshCcw } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { QRCodeSVG } from "qrcode.react";
import { useEffect } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { BackgroundDotted } from "../ui/background-dotted";
import { Button } from "../ui/button";
import { Grid, GridSection } from "../ui/grid-sections";
import { MessageLoading } from "../ui/message-loading";
import { ShineBorder } from "../ui/shine-border";
import { PresentationRequest } from "./presentation-request";
import VerificationSteps from "./verification-steps";

const ConnectionPolling: React.FC<{ message: string }> = ({ message }) => (
  <motion.div
    initial={{ opacity: 1 }}
    animate={{ opacity: [1, 0.2, 1] }}
    transition={{ duration: 2, repeat: Infinity }}
    className="flex items-center justify-center gap-2"
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
    className="p-0 opacity-50"
  >
    {loading ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Creating proof request...
      </>
    ) : (
      <>
        <RefreshCcw />
        Start again
      </>
    )}
  </Button>
);

const VCPresentationCard: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
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

  return (
    <>
      {invitationUrl && (
        <div className="h-full min-w-[300px] flex flex-col items-center justify-start gap-2">
          <Grid bordered={false}>
            <GridSection className="lg:col-span-3 dark:border-neutral-800 flex justify-center">
              <div className="relative min-h-[400px] flex items-center justify-center">
                <div className="flex flex-col gap-6 items-center justify-center h-full w-full">
                  {false && isPresentationVerified === true ? (
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 2 }}
                      className="z-[100] flex flex-col items-start max-w-md"
                    >
                      <Alert variant={"success"}>
                        <PartyPopper className="h-4 w-4" />
                        <AlertTitle className="font-light">
                          Congratulations!
                        </AlertTitle>
                        <AlertDescription>
                          Your provided {useCaseConfig.proofRequest.name} has
                          been accepted
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  ) : presentationRecord ? (
                    <VerificationSteps
                      embed={true}
                      presentation={presentationRecord}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-4 h-full w-[400px]">
                      <h3 className="text-sm text-center mb-2">
                        <span className="text-muted-foreground">
                          <strong>{useCaseConfig.tenant.name}</strong> invites
                          you to present your proof.
                        </span>{" "}
                        <span className="whitespace-nowrap">
                          Use your wallet app to scan the QR code.
                        </span>
                      </h3>
                      <ShineBorder
                        className="relative flex h-[400px] w-[400px] items-center justify-center rounded-lg border bg-background md:shadow-xl"
                        color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                      >
                        <QRCodeSVG
                          title="Scan the QR code with your wallet"
                          value={invitationUrl}
                          size={400}
                          marginSize={2}
                          fgColor={isDark ? "#fff" : "#000"}
                          bgColor={isDark ? "#000" : "#fff"}
                        />
                      </ShineBorder>

                      {(isPollingConnection || isPollingPresentation) && (
                        <div className="flex items-center justify-between w-full gap-4">
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
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </GridSection>

            <GridSection className="lg:col-span-3 lg:border-r dark:border-neutral-800 lg:order-first flex justify-center">
              <BackgroundDotted />
              <PresentationRequest
                config={useCaseConfig}
                presentationRecord={presentationRecord}
                isVerified={isPresentationVerified}
              />
            </GridSection>
          </Grid>
        </div>
      )}
    </>
  );
};

export default VCPresentationCard;
