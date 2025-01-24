export interface PresIndy {
  requested_proof: {
    revealed_attr_groups: Record<
      string,
      { values: Record<string, { raw: string }> }
    >;
  };
}

export interface PresRequestIndy {
  name: string;
  version: string;
  requested_attributes: Record<string, { names: string[] }>;
}
