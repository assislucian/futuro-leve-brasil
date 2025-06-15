
import React from 'react';
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function BudgetSummaryLoading() {
  return (
    <Card>
      <CardHeader>
        <CardTitle><Skeleton className="h-6 w-2/3" /></CardTitle>
        <CardDescription><Skeleton className="h-4 w-1/2" /></CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-8 w-1/2" />
          </div>
          <Skeleton className="h-2 w-full" />
          <div className="flex justify-between text-sm">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
