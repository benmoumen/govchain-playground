import { randomBytes } from "crypto";

export const getActiveConnectionCookieName = (tenantId: string) =>
  `active_conn_id_${tenantId}`;

export function generateNonce(): string {
  return randomBytes(16).toString("hex");
}
