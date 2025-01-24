import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { extractAttributesFromPresentation } from "@/lib/vc";
import type { V20PresExRecord } from "@/types/vc/acapyApi/acapyInterface";
import React from "react";
import { toast } from "sonner";

const DataTable: React.FC<{ attributes: Record<string, string> }> = ({
  attributes,
}) => (
  <div className="mx-auto max-w-lg">
    <div className="overflow-hidden rounded-lg border border-border bg-background">
      <Table>
        <TableBody>
          {Object.entries(attributes).map(([key, value]) => (
            <TableRow
              key={key}
              className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r"
            >
              <TableCell className="bg-muted/50 py-2 font-medium">
                {key}
              </TableCell>
              <TableCell className="py-2">{value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);

const PresentationData: React.FC<{
  presentationRecord: V20PresExRecord;
}> = ({ presentationRecord }) => {
  const attributes = extractAttributesFromPresentation(presentationRecord);
  if (attributes === null) {
    toast.error("Failed to extract attributes from presentation");
    return null;
  }

  return <DataTable attributes={attributes} />;
};

export default PresentationData;
