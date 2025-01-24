import { cn } from "@/lib/utils";

const Grid = ({
  children,
  bordered = true,
  className,
}: {
  children?: React.ReactNode;
  bordered: boolean;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 lg:grid-cols-6",
        bordered ? "lg:border rounded-md dark:border-neutral-800" : "",
        className
      )}
    >
      {children}
    </div>
  );
};

const GridSection = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        `p-4 sm:p-8 relative overflow-hidden col-span-1`,
        className
      )}
    >
      {children}
    </div>
  );
};

export { Grid, GridSection };
