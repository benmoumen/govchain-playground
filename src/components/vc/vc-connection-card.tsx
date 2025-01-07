import useConnection from "@/hooks/vc/use-connection";
import { Loader2, RefreshCcwDotIcon, RefreshCw } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect } from "react";
import { Button } from "../ui/button";

interface VCConnectionCardProps {
  useCase: string;
}

const VCConnectionCard: React.FC<VCConnectionCardProps> = ({ useCase }) => {
  const {
    isActiveConnection,
    error,
    initiateConnection,
    connectionId,
    invitationUrl,
    generatingInvitation,
  } = useConnection(useCase);

  useEffect(() => {
    if (isActiveConnection) {
      console.log("Connection has been made successfully!");
    }
  }, [isActiveConnection]);

  useEffect(() => {
    if (!connectionId) {
      initiateConnection();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return <p>Error loading connection data.</p>;
  }

  return (
    <div>
      <h1>VC Connection Card</h1>
      <p>Use Case: {useCase}</p>
      {isActiveConnection ? (
        <>
          <p>Connection has been made successfully!</p>
          <Button
            variant={"destructive"}
            onClick={() => initiateConnection(true)}
          >
            <RefreshCw />
            Start over
          </Button>
        </>
      ) : invitationUrl ? (
        <div>
          <p>Scan the QR code to connect:</p>
          <QRCodeSVG value={invitationUrl} size={220} />
        </div>
      ) : (
        <Button
          onClick={() => initiateConnection(true)}
          disabled={generatingInvitation}
        >
          {generatingInvitation ? (
            <Loader2 className="animate-spin" />
          ) : (
            <RefreshCcwDotIcon />
          )}
          {generatingInvitation
            ? "Generating invitation..."
            : "Request a new invitation"}
        </Button>
      )}
    </div>
  );
};

export default VCConnectionCard;
