import type { ProofUseCaseConfig } from "@/types/vc";
import credentials from "./credentials";
import tenants from "./tenants";

const proofOfPersonhood: ProofUseCaseConfig = {
  tenant: tenants.RNPN,
  proofRequest: {
    name: "Proof of Personhood",
    version: "1.0",
    requested_attributes: {
      personalInfo: {
        names: ["Full Name", "Document Number", "Date of Birth", "Sex"],
        restrictions: [
          {
            cred_def_id: credentials.digitalDUI.credDefId,
          },
        ],
      },
    },
    requested_predicates: {
      /*not_expired: {
        name: "Date of Expiry",
        p_type: ">=",
        p_value: 20230527,
        restrictions: [
          {
            cred_def_id: credentials.digitalDUI.credDefId,
          },
        ],
      },*/
    },
  },
};

export default proofOfPersonhood;
