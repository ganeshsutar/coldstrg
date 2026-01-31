import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface CardSkeletonProps {
  hasHeader?: boolean;
  contentLines?: number;
}

export function CardSkeleton({ hasHeader = true, contentLines = 3 }: CardSkeletonProps) {
  return (
    <Card>
      {hasHeader && (
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
      )}
      <CardContent className="space-y-3">
        {Array.from({ length: contentLines }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </CardContent>
    </Card>
  );
}
