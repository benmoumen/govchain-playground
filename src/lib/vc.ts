import type { V20PresExRecord } from "@/types/vc/acapyApi/acapyInterface";
import type { PresIndy, PresRequestIndy } from "@/types/vc/presentation";
import { randomBytes } from "crypto";

export const getActiveConnectionCookieName = (tenantId: string) =>
  `active_conn_id_${tenantId}`;

export function generateNonce(): string {
  return randomBytes(16).toString("hex");
}

export function extractAttributesFromPresentation(
  presentationRecord: V20PresExRecord
): Record<string, string> | null {
  if (!presentationRecord.by_format) return null;

  const pres = presentationRecord.by_format.pres as { indy?: PresIndy };
  if (!pres?.indy) return null;
  const presIndy: PresIndy = pres.indy;

  const pres_request = presentationRecord.by_format.pres_request as {
    indy?: PresRequestIndy;
  };
  if (!pres_request?.indy) return null;
  const presRequestIndy: PresRequestIndy = pres_request.indy;

  return Object.values(presRequestIndy.requested_attributes).reduce(
    (acc, attribute) => {
      const groupNames = Object.keys(
        presIndy.requested_proof.revealed_attr_groups
      );
      groupNames.forEach((groupName) => {
        const revealedAttributes =
          presIndy.requested_proof.revealed_attr_groups[groupName].values;
        attribute.names.forEach((name) => {
          acc[name] = revealedAttributes[name]?.raw || "";
        });
      });
      return acc;
    },
    {} as Record<string, string>
  );
}
