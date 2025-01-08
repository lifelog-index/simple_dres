import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <div className="h-2.5" />
      <Skeleton className="h-[205px] w-[300px] rounded-xl" />
      <div className="space-y-2">
        <div className="h-1" />
        <Skeleton className="h-4 w-[300px]" />
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[230px]" />
        <Skeleton className="h-4 w-[150px]" />
      </div>
    </div>
  );
}
