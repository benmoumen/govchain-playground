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
