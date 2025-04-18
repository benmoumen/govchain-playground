import {
  formatDateToYYYYMMDD,
  generateRandomIDDocumentNumber,
  getRandomElement,
} from "@/lib/utils";
import type { CredentialUseCaseConfig } from "@/types/vc";
import { VCFormFieldEnum, type VCFormFieldDefinition } from "@/types/vc/form";
import { z } from "zod";
import credentials from "./credentials";
import tenants from "./tenants";

const metadata = {
  credentialName: "Digital DUI",
  category: "Proof of Identity",
  title: "Get your Digital ID.",
  benefits: [
    "Proof of identity",
    "Voting",
    "Access government services",
    "Age verification",
    "Boarding domestic flights",
  ],
  src: "/img/photo-wallet-scan.jpg",
};

////////////////////////
// Form Config /////////
////////////////////////
const MaritalStatusEnum = z.enum(["Single", "Married", "Divorced", "Widowed"]);
const SexEnum = z.enum(["Male", "Female"]);

const today = new Date();
const expiryDate = new Date();
expiryDate.setFullYear(today.getFullYear() + 10);
const birthDate = new Date();
birthDate.setFullYear(today.getFullYear() - 20);

// Default values
const defaultValues: { [key: string]: string | Date | undefined } = {
  "Full Name": "Juan Carlos Martinez",
  "Document Number": generateRandomIDDocumentNumber(),
  "Date of Birth": new Date(
    birthDate.setFullYear(today.getFullYear() - Math.floor(Math.random() * 50))
  ),
  "Place of Birth": "San Salvador, El Salvador",
  Sex: getRandomElement(SexEnum.options),
  Nationality: "Salvadoran",
  "Marital Status": getRandomElement(MaritalStatusEnum.options.slice(0, 2)),
  Address: "Calle Principal #123, San Salvador, El Salvador",
  Municipality: "San Salvador",
  Department: "San Salvador",
  Photograph: "base64-encoded-photograph",
  Signature: "base64-encoded-signature",
  "Date of Issue": today,
  "Date of Expiry": expiryDate,
};
// Form fields
const formFields: VCFormFieldDefinition[] = [
  {
    name: "Full Name",
    label: "Full Name",
  },
  {
    name: "Document Number",
    label: "DUI Number",
  },
  {
    name: "Date of Birth",
    label: "Date of Birth",
    type: VCFormFieldEnum.Date,
    toDate: birthDate,
    hidden: true,
  },
  {
    name: "Place of Birth",
    label: "Place of Birth",
    hidden: true,
  },
  {
    name: "Sex",
    label: "Sex",
    type: VCFormFieldEnum.Enum,
    options: SexEnum.options,
  },
  {
    name: "Marital Status",
    label: "Marital Status",
    type: VCFormFieldEnum.Enum,
    options: MaritalStatusEnum.options,
    hidden: true,
  },
  {
    name: "Nationality",
    label: "Nationality",
    hidden: true,
  },
  {
    name: "Address",
    label: "Address",
    hidden: true,
  },
  {
    name: "Municipality",
    label: "Municipality",

    hidden: true,
  },
  {
    name: "Department",
    label: "Department",
    hidden: true,
  },
  {
    name: "Date of Issue",
    label: "Date of Issue",
    type: VCFormFieldEnum.Date,
    toDate: today,
  },
  {
    name: "Date of Expiry",
    label: "Date of Expiry",
    type: VCFormFieldEnum.Date,
    fromDate: today,
    toDate: expiryDate,
    hidden: true,
  },
];

// Form schema
const formSchema: z.AnyZodObject = z.object({
  "Full Name": z.string().trim().nonempty("Full Name cannot be empty."),
  "Document Number": z
    .string()
    .trim()
    .nonempty("Document Number cannot be empty."),
  "Date of Birth": z.coerce
    .date({
      required_error: "Date of Birth is required.",
    })
    .transform((date) => formatDateToYYYYMMDD(date)),
  "Place of Birth": z.string().trim().nonempty("Place of Birth is required."),
  Nationality: z.string().trim().optional(),
  Sex: SexEnum.optional(),
  "Marital Status": MaritalStatusEnum.optional(),
  Address: z.string().trim().nonempty("Address is required."),
  Municipality: z.string().trim().optional(),
  Department: z.string().trim().optional(),
  "Date of Issue": z.coerce
    .date({
      required_error: "Date of Issue is required.",
    })
    .transform((date) => formatDateToYYYYMMDD(date)),
  "Date of Expiry": z.coerce
    .date({
      required_error: "Date of Expiry is required.",
    })
    .transform((date) => formatDateToYYYYMMDD(date)),
  Photograph: z.string().trim().optional(),
  Signature: z.string().trim().optional(),
});

////////////////////////
// Use Case Config /////
////////////////////////
const digitalDUI: CredentialUseCaseConfig = {
  tenant: tenants.RNPN,
  metadata: metadata,
  form: {
    schema: formSchema,
    fields: formFields,
    defaultValues: defaultValues,
  },
  identifiers: credentials.digitalDUI,
};

export default digitalDUI;
