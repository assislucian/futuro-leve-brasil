
import { Skeleton } from "./ui/skeleton";

export function ProfileFormSkeleton() {
  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <Skeleton className="h-10 w-32" />
      </div>
      <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-40" />
    </div>
  );
}
