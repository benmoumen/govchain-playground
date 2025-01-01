import React from "react";
import CredentialForm, {
  VCFormFieldEnum,
  type VCFormFieldDefinition,
} from "../credential-form";
import { z } from "zod";

const MaritalStatusEnum = z.enum(["Single", "Married", "Divorced", "Widowed"]);
const SexEnum = z.enum(["Male", "Female"]);
const NationalityEnum = z.enum(["Salvadorian"]);

const DigitalIdentityCredentialForm: React.FC = () => {
  const digitalIdentitySchema = z.object({
    "Full Name": z
      .string()
      .min(2, { message: "Full name must be at least 2 characters." }),
    "Document Number": z
      .string()
      .min(1, { message: "Document number is required." }),
    "Date of Birth": z.date({ required_error: "Date of Birth is required." }),
    "Place of Birth": z
      .string()
      .min(1, { message: "Place of Birth is required." }),
    Sex: SexEnum.optional(),
    Nationality: NationalityEnum.optional(),
    "Marital Status": MaritalStatusEnum.optional(),
    Address: z.string().min(1, { message: "Address is required." }),
    Municipality: z.string().optional(),
    Department: z.string().optional(),
    "Date of Issue": z.date({ required_error: "Date of Issue is required." }),
    "Date of Expiry": z.date({ required_error: "Date of Expiry is required." }),
  });

  const today = new Date();
  const expiryDate = new Date();
  const expirationYear = today.getFullYear() + 10;
  expiryDate.setFullYear(expirationYear);

  const defaultValues = {
    "Full Name": "Juan Carlos Martinez",
    "Document Number": "123456789",
    "Date of Birth": "1990-06-20",
    "Place of Birth": "San Salvador, El Salvador",
    Sex: "Male",
    Nationality: "Salvadoran",
    "Marital Status": "Single",
    Address: "Calle Principal #123, San Salvador, El Salvador",
    Municipality: "San Salvador",
    Department: "San Salvador",
    Photograph: "base64-encoded-photograph",
    Signature: "base64-encoded-signature",
    "Date of Issue": today.toISOString().split("T")[0],
    "Date of Expiry": expiryDate.toISOString().split("T")[0],
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
      name: "Nationality",
      label: "Nationality",
      type: VCFormFieldEnum.Enum,
      options: NationalityEnum.options,
      hidden: true,
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
