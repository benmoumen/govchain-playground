import React from "react";
import { z } from "zod";

import CredentialForm, {
  VCFormFieldEnum,
  type VCFormFieldDefinition,
} from "@/components/credential-form";
import { formatDateToYYYYMMDD } from "@/lib/utils";

const MaritalStatusEnum = z.enum(["Single", "Married", "Divorced", "Widowed"]);
const SexEnum = z.enum(["Male", "Female"]);

const DigitalIdentityCredentialForm: React.FC = () => {
  const digitalIdentitySchema = z.object({
    "Full Name": z
      .string()
      .min(2, { message: "Full name must be at least 2 characters." }),
    "Document Number": z.string({
      required_error: "Document number is required.",
    }),
    "Date of Birth": z
      .string({
        required_error: "Date of Birth is required.",
      })
      .transform((str) => new Date(str)),
    "Place of Birth": z.string({
      required_error: "Place of Birth is required.",
    }),
    Sex: SexEnum.optional(),
    "Marital Status": MaritalStatusEnum.optional(),
    Address: z.string({ required_error: "Address is required." }),
    Municipality: z.string().optional(),
    Department: z.string().optional(),
    "Date of Issue": z
      .string({
        required_error: "Date of Issue is required.",
      })
      .transform((str) => new Date(str)),
    "Date of Expiry": z
      .string({
        required_error: "Date of Expiry is required.",
      })
      .transform((str) => new Date(str)),
  });

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

  const defaultValues: { [key: string]: string | undefined } = {
    "Full Name": "Juan Carlos Martinez",
    "Document Number": generateRandomDUIDocumentNumber(),
    "Date of Birth": formatDateToYYYYMMDD(
      new Date(
        birthDate.setFullYear(
          today.getFullYear() - Math.floor(Math.random() * 50 + 18)
        )
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
    "Date of Issue": formatDateToYYYYMMDD(today),
    "Date of Expiry": formatDateToYYYYMMDD(expiryDate),
  };

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

  return (
    <CredentialForm
      schema={digitalIdentitySchema}
      defaultValues={defaultValues}
      formFields={formFields}
    />
  );
};

export default DigitalIdentityCredentialForm;
