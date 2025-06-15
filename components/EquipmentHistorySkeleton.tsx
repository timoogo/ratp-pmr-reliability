
import { Skeleton } from "@/components/ui/skeleton";

export const EquipmentHistorySkeleton = () => {
  return (
    <div className="space-y-3">
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
};
