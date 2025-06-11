import { FileText } from "lucide-react";

interface NotFoundItemsProps {
  message: string;
  description: string;
  icon?: React.ReactNode;
}

export function NotFoundItems({
  message,
  icon,
  description,
}: NotFoundItemsProps) {
  return (
    <div className="col-span-full text-center py-10">
      {icon || <FileText className="mx-auto h-10 w-10 text-muted-foreground" />}
      <h3 className="mt-2 text-lg font-medium">{message}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
