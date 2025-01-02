import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2, ShieldCheck } from "lucide-react";
import { format } from "date-fns";
import { cn, formatDateToYYYYMMDD, formatYYYYMMDDToDate } from "@/lib/utils";

export enum VCUseCase {
  Identity = "Identity",
  Business = "Business",
  Education = "Education",
  Health = "Health",
}

export enum VCFormFieldEnum {
  Text = "text",
  Date = "date",
  Enum = "enum",
}
type VCFormFieldType =
  | VCFormFieldEnum.Text
  | VCFormFieldEnum.Date
  | VCFormFieldEnum.Enum;

export interface VCFormFieldDefinition {
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  type?: VCFormFieldType;
  options?: string[]; // For enum type
  toDate?: Date | undefined;
  fromDate?: Date | undefined;
  hidden?: boolean;
}

// Generic CredentialForm component
const CredentialForm: React.FC<{
  schema: z.ZodSchema;
  defaultValues: { [key: string]: string | undefined };
  formFields: VCFormFieldDefinition[];
}> = ({ schema, defaultValues, formFields: formFields }) => {
  const [showHiddenFields, setShowHiddenFields] = useState(false);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    toast("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  };

  return (
    <div className="bg-[#F5F5F7] dark:bg-black p-8 md:p-14 rounded-3xl mb-4">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {formFields.map((formField: VCFormFieldDefinition) => (
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
                                onSelect={(date) =>
                                  field.onChange(
                                    date
                                      ? formatDateToYYYYMMDD(date)
                                      : undefined
                                  )
                                }
                                fromDate={formField.fromDate}
                                toDate={formField.toDate}
                                disabled={(date) =>
                                  (formField.fromDate &&
                                    date < new Date(formField.fromDate)) ||
                                  (formField.toDate &&
                                    date > new Date(formField.toDate)) ||
                                  false
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        );
                      case "enum":
                        return (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
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
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Sending a request to the issuer
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
              <Label htmlFor="toggle-hidden-fields" className="cursor-pointer">
                Customize all credential fields
              </Label>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default CredentialForm;
