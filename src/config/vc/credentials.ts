import type { VCIdentifiers } from "@/types/vc";

enum CredentialTypes {
  DigitalDUI = "digitalDUI",
  Shareholder = "shareholder",
}

const credentials: Record<CredentialTypes, VCIdentifiers> = {
  [CredentialTypes.DigitalDUI]: {
    credDefId: "K6zBDo67bUpgzaKzSxn7tQ:3:CL:13:2025",
    schemaId: "K6zBDo67bUpgzaKzSxn7tQ:2:ElSalvador_DUI:1.0",
  },
  [CredentialTypes.Shareholder]: {
    credDefId: "K6zBDo67bUpgzaKzSxn7tQ:3:CL:16:company_token",
    schemaId: "K6zBDo67bUpgzaKzSxn7tQ:2:Company Credential of Ownership:1.0",
  },
};

export default credentials;
