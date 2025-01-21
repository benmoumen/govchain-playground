import {
  formatDateToYYYYMMDD,
  generateRandomIDDocumentNumber,
  getRandomElement,
} from "@/lib/utils";
import type { UseCaseConfig } from "@/types/vc";
import { VCFormFieldEnum } from "@/types/vc/form";
import { z } from "zod";
import credentials from "./credentials";
import tenants from "./tenants";

/* const proofRequest = {
  name: "proof-request",
  nonce: "1234567890",
  version: "1.0",
  requested_attributes: {
    studentInfo: {
      names: ["given_names", "family_name"],
      restrictions: [
        {
          schema_name: "student id",
        },
      ],
    },
  },
  requested_predicates: {
    not_expired: {
      name: "expiry_dateint",
      p_type: ">=",
      p_value: 20230527,
      restrictions: [
        {
          cred_def_id: credentials.digitalDUI.credDefId,
        },
      ],
    },
  },
}; */

const today = new Date();
const BlockchainEnum = z.enum([
  "Ethereum Polygon",
  "Bitcoin Rootstock",
  "Bitcoin Liquid",
]);
const defaultValues = {
  "Company Name": "Example Corp",
  "Company Registration Number": "123456789",
  "Date of Registration": new Date(today.setFullYear(today.getFullYear() - 5)),
  "Shareholder DUI": generateRandomIDDocumentNumber(),
  "Shareholder Full Name": "Juan Carlos Martinez",
  "Number of Shares": "1000",
  "Share Issuance Date": new Date(today.setFullYear(today.getFullYear() - 1)),
  "Blockchain Network": getRandomElement(BlockchainEnum.options),
  "Blockchain Wallet Address": "0x1234567890abcdef1234567890abcdef12345678",
  "NFT Token ID": Math.ceil(Math.random() * 100).toString(),
};

const companyOwnership: UseCaseConfig = {
  issuer: tenants.RNPN,
  metadata: {
    credentialName: "Company Ownership Certificate",
    category: "Business",
    title: "Obtain your Shareholder Certificate",
    benefits: [
      "Proving official company ownership",
      "Validating your shareholder status",
      "Accessing corporate records",
    ],
    src: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=4000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  form: {
    schema: z.object({
      "Company Name": z.string().nonempty(),
      "Company Registration Number": z.string().nonempty(),
      "Date of Registration": z.coerce
        .date({
          required_error: "Date of Registration is required.",
        })
        .transform((date) => formatDateToYYYYMMDD(date)),
      "Shareholder DUI": z.string().nonempty(),
      "Shareholder Full Name": z.string().nonempty(),
      "Number of Shares": z.string().nonempty(),
      "Share Issuance Date": z.coerce
        .date({
          required_error: "Share Issuance Date is required.",
        })
        .transform((date) => formatDateToYYYYMMDD(date)),
      "Blockchain Network": z.string().nonempty(),
      "Blockchain Wallet Address": z.string().nonempty(),
      "NFT Token ID": z.coerce
        .number()
        .int()
        .positive()
        .transform((n) => n.toString()),
    }),
    fields: [
      { name: "Company Name", label: "Company Name" },
      {
        name: "Company Registration Number",
        label: "Company Registration Number",
      },
      {
        name: "Date of Registration",
        label: "Date of Registration",
        type: VCFormFieldEnum.Date,
        hidden: true,
      },
      { name: "Shareholder DUI", label: "Shareholder DUI" },
      { name: "Shareholder Full Name", label: "Shareholder Full Name" },
      { name: "Number of Shares", label: "Number of Shares" },
      {
        name: "Share Issuance Date",
        label: "Share Issuance Date",
        type: VCFormFieldEnum.Date,
        hidden: true,
      },
      {
        name: "Blockchain Network",
        label: "Blockchain Network",
        type: VCFormFieldEnum.Enum,
        options: BlockchainEnum.options,
      },
      { name: "Blockchain Wallet Address", label: "Blockchain Wallet Address" },
      { name: "NFT Token ID", label: "NFT Token ID" },
    ],
    defaultValues: defaultValues,
  },
  identifiers: credentials.shareholder,
};

export default companyOwnership;
