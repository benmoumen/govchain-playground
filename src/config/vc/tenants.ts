import type { VCTenant } from "@/types/vc";

enum TenantNames {
  RNPN = "RNPN",
}

const tenants: Record<TenantNames, VCTenant> = {
  [TenantNames.RNPN]: {
    tenantId: "59378286-b0f1-4c4a-804d-c6b0f7628a39",
    name: "Registro National de las Personas Naturales",
    shortName: TenantNames.RNPN,
    apiKeyVar: "VC_ISSUER_APIKEY_RNPN",
  },
};

export default tenants;
