import useConnection from "@/hooks/vc/use-connection";
import { QRCodeSVG } from "qrcode.react";
import { useEffect } from "react";

interface VCConnectionCardProps {
  useCase: string;
}

const VCConnectionCard: React.FC<VCConnectionCardProps> = ({ useCase }) => {
  const {
    isActiveConnection,
    isLoading,
    error,
    initiateConnection,
    connectionId,
    invitationUrl,
    stopPolling,
  } = useConnection(useCase);

  useEffect(() => {
    if (isActiveConnection) {
      stopPolling();
      return;
    }
    if (!connectionId) {
      initiateConnection();
    }
  }, [
    invitationUrl,
    initiateConnection,
    isActiveConnection,
    connectionId,
    stopPolling,
  ]);

  if (isLoading) {
    return <p>Initializing connection...</p>;
  }

  if (error) {
    return <p>Error loading connection data.</p>;
  }

  return (
    <div>
      <h1>VC Connection Card</h1>
      <p>Use Case: {useCase}</p>
      {isActiveConnection ? (
        <p>Connection has been made successfully!</p>
      ) : invitationUrl ? (
        <div>
          <p>Scan the QR code to connect:</p>
          <QRCodeSVG value={invitationUrl} />
        </div>
      ) : (
        <p>Initializing connection...</p>
      )}
    </div>
  );
};

export default VCConnectionCard;
