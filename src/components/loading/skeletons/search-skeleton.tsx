import { Skeleton } from "@/components/ui/skeleton";

export function SearchSkeleton() {
  return (
    <div className="relative max-w-sm">
      <Skeleton className="h-9 w-full" />
    </div>
  );
}
