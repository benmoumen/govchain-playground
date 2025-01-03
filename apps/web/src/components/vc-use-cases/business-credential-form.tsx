import React from "react";
import CredentialForm, { type VCFormFieldDefinition } from "../credential-form";
import { z } from "zod";

const BusinessCredentialForm: React.FC = () => {
  const businessSchema = z.object({
    businessName: z
      .string()
      .min(2, { message: "Business name must be at least 2 characters." }),
  });

  const defaultValues = {
    businessName: "",
  };

  const formFields: VCFormFieldDefinition[] = [
    {
      name: "businessName",
      label: "Business Name",
      placeholder: "Enter your business name",
      description: "The official name of your business",
    },
  ];

  return (
    <CredentialForm
      schema={businessSchema}
      defaultValues={defaultValues}
      formFields={formFields}
    />
  );
};

export default BusinessCredentialForm;
