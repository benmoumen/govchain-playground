"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { getUseCaseForm } from "@/config/vc";
import useCredential from "@/hooks/vc/use-credential";
import { cn, formatYYYYMMDDToDate } from "@/lib/utils";
import type { UCMetadata, VCTenant } from "@/types/vc";
import type { CredAttrSpec } from "@/types/vc/acapyApi/acapyInterface";
import type { VCFormFieldDefinition } from "@/types/vc/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2, PartyPopper, ShieldCheck } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Badge } from "../ui/badge";
import { MultiStepLoader } from "../ui/multi-step-loader";

interface CredentialFormProps {
  useCase: string;
  connectionId: string;
  issuer: VCTenant;
  metadata: UCMetadata;
}

interface CredentialState {
  name: string;
  label: string;
}

// Generic CredentialForm component
const CredentialForm: React.FC<CredentialFormProps> = ({
  useCase,
  connectionId,
  issuer,
  metadata,
}) => {
  const CREDENTIAL_STATES: CredentialState[] = [
    {
      name: "offer-sent",
      label: issuer.shortName + " sent an offer to your wallet",
    },
    { name: "request-received", label: "You accepted the credential" },
    {
      name: "credential-issued",
      label: issuer.shortName + " signed and sent the credential",
    },
    { name: "done", label: "Credential saved to your wallet 🎉" },
  ];
  const { schema, fields, defaultValues } = getUseCaseForm(useCase);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const {
    sendCredentialOffer,
    credential: offeredCredential,
    isPolling,
    error,
    sendingOffer,
  } = useCredential(useCase);
  const [showHiddenFields, setShowHiddenFields] = useState(false);
  const [isMultiStepLoaderVisible, setIsMultiStepLoaderVisible] =
    useState(false);

  const handleCloseMultiStepLoader = () => {
    window.location.reload();
  };

  const onSubmit = (data: z.infer<typeof schema>) => {
    // convert data to CredAttrSpec[]
    console.log("Credential data:", data);
    const attributes: CredAttrSpec[] = Object.entries(data).map(
      ([key, value]) => ({
        name: key,
        value: value,
      })
    );
    console.info("Converted to credential attributes format:", attributes);

    try {
      sendCredentialOffer(connectionId, attributes);
    } catch {
      toast.error(
        "The issuer agent could not issue the credential. Please try again later."
      );
    }
    toast.info("Sending credential offer...");
  };

  const handleFormSubmit = form.handleSubmit(onSubmit, () => {
    console.log("Form errors:", form.formState.errors);
    const errors = form.formState.errors;
    const hasHiddenFieldErrors = fields.some(
      (field) => field.hidden && errors[field.name]
    );

    if (hasHiddenFieldErrors) {
      setShowHiddenFields(true);
      toast.error("Please correct the errors in the hidden fields.");
    }
  });

  useEffect(() => {
    if (isPolling || offeredCredential?.state) {
      setIsMultiStepLoaderVisible(true);
    }
  }, [offeredCredential, isPolling]);

  useEffect(() => {
    if (error) {
      toast.error(
        "The issuer agent encountered an error. Please try again later."
      );
    }
  }, [error]);

  return (
    <>
      {isMultiStepLoaderVisible && (
        <MultiStepLoader
          loading={true}
          loadingStates={CREDENTIAL_STATES.map((state) => ({
            text: state.label,
          }))}
          currentState={
            CREDENTIAL_STATES.findIndex(
              (state) =>
                offeredCredential?.state &&
                state.name === offeredCredential.state
            ) ?? 0
          }
          successMessage={
            <Alert variant={"success"}>
              <PartyPopper className="h-4 w-4" />
              <AlertTitle className="font-light">Congratulations!</AlertTitle>
              <AlertDescription>
                You can now start using your{" "}
                <strong>{metadata.credentialName}</strong> for:{" "}
                <div className="flex flex-wrap gap-1 mt-2">
                  {metadata.benefits.map((benefit, index) => (
                    <Badge
                      key={index}
                      variant={"secondary"}
                      className="opacity-75"
                    >
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          }
          onClose={handleCloseMultiStepLoader}
        />
      )}

      <FormProvider {...form}>
        <form onSubmit={handleFormSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Credential Request Form</CardTitle>
              <CardDescription>
                Request your verifiable credential by filling out the form
                below.
                <br />
                The Issuer will send the credential directly to your wallet.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {fields.map((formField: VCFormFieldDefinition) => (
                <FormField
                  key={formField.name}
                  name={formField.name}
                  control={form.control}
                  render={({ field, fieldState }) => {
                    const fieldRendered = () => {
                      switch (formField.type) {
                        case "date":
                          return (
                            <Popover>
                              <PopoverTrigger
                                asChild
                                className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                              >
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(
                                      formatYYYYMMDDToDate(field.value),
                                      "PPP"
                                    )
                                  ) : (
                                    <span>
                                      {formField.placeholder || "Pick a date"}
                                    </span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  captionLayout="dropdown"
                                  selected={
                                    field.value
                                      ? new Date(field.value)
                                      : undefined
                                  }
                                  onSelect={(date) => field.onChange(date)}
                                  hidden={[
                                    formField.fromDate
                                      ? { before: formField.fromDate }
                                      : false,
                                    formField.toDate
                                      ? { after: formField.toDate }
                                      : false,
                                  ]}
                                  startMonth={
                                    formField.fromDate
                                      ? formField.fromDate
                                      : undefined
                                  }
                                  endMonth={
                                    formField.toDate
                                      ? formField.toDate
                                      : undefined
                                  }
                                  disabled={(date) =>
                                    (formField.fromDate &&
                                      date < formField.fromDate) ||
                                    (formField.toDate &&
                                      date > formField.toDate) ||
                                    false
                                  }
                                />
                              </PopoverContent>
                            </Popover>
                          );
                        case "enum":
                          return (
                            <Select
                              onValueChange={field.onChange}
                              value={field.value as string | undefined}
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={formField.placeholder}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {formField.options?.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          );
                        case "text":
                        default:
                          return (
                            <Input
                              placeholder={formField.placeholder}
                              {...field}
                              value={
                                field.value instanceof Date
                                  ? field.value.toISOString()
                                  : field.value
                              }
                            />
                          );
                      }
                    };

                    return (
                      <FormItem
                        className={`${
                          formField.hidden && !showHiddenFields ? "hidden" : ""
                        }`}
                      >
                        <FormLabel>{formField.label}</FormLabel>
                        <FormControl>{fieldRendered()}</FormControl>
                        {formField.description && (
                          <FormDescription>
                            {formField.description}
                          </FormDescription>
                        )}
                        <FormMessage>{fieldState.error?.message}</FormMessage>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <Button type="submit" disabled={sendingOffer || isPolling}>
                {sendingOffer ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Sending a request to the issuer
                  </>
                ) : isPolling ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Waiting for credential issuance...
                  </>
                ) : (
                  <>
                    <ShieldCheck />
                    Request your credential
                  </>
                )}
              </Button>

              <div className="flex items-center space-x-2 sm:ml-auto">
                <Switch
                  id="toggle-hidden-fields"
                  onCheckedChange={() => setShowHiddenFields(!showHiddenFields)}
                  checked={showHiddenFields}
                />
                <Label
                  htmlFor="toggle-hidden-fields"
                  className="cursor-pointer"
                >
                  Show all fields
                </Label>
              </div>
            </CardFooter>
          </Card>
        </form>
      </FormProvider>
    </>
  );
};

export default CredentialForm;
