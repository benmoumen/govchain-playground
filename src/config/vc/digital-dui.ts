import { formatDateToYYYYMMDD } from "@/lib/utils";
import type { UseCaseConfig } from "@/types/vc";
import { VCFormFieldEnum, type VCFormFieldDefinition } from "@/types/vc/form";
import { z } from "zod";

const issuer = {
  tenantId: "59378286-b0f1-4c4a-804d-c6b0f7628a39",
  name: "Registro National de las Personas Naturales",
  shortName: "RNPN",
  apiKeyVar: "VC_ISSUER_APIKEY_RNPN",
};

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
  src: "https://images.unsplash.com/photo-1626423962491-eb76bdc2e0be?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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

const generateRandomDUIDocumentNumber = () => {
  return Math.floor(100000000 + Math.random() * 900000000).toString();
};

const getRandomElement = (arr: string[]) =>
  arr[Math.floor(Math.random() * arr.length)];

// Default values
const defaultValues: { [key: string]: string | Date | undefined } = {
  "Full Name": "Juan Carlos Martinez",
  "Document Number": generateRandomDUIDocumentNumber(),
  "Date of Birth": new Date(
    birthDate.setFullYear(
      today.getFullYear() - Math.floor(Math.random() * 50 + 18)
    )
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
const digitalDUI: UseCaseConfig = {
  issuer: issuer,
  metadata: metadata,
  form: {
    schema: formSchema,
    fields: formFields,
    defaultValues: defaultValues,
  },
  identifiers: {
    credDefId: "K6zBDo67bUpgzaKzSxn7tQ:3:CL:13:2025",
    schemaId: "K6zBDo67bUpgzaKzSxn7tQ:2:ElSalvador_DUI:1.0",
  },
};

export default digitalDUI;
