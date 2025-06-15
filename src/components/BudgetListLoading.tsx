
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";

export function BudgetListLoading() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[25%]"><Skeleton className="h-5 w-full" /></TableHead>
              <TableHead className="w-[35%]"><Skeleton className="h-5 w-full" /></TableHead>
              <TableHead className="w-[20%] text-right"><Skeleton className="h-5 w-full" /></TableHead>
              <TableHead className="w-[15%] text-right"><Skeleton className="h-5 w-full" /></TableHead>
              <TableHead className="w-[5%] text-right"><Skeleton className="h-5 w-1/2" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(3)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
                <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-5 w-full" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-5 w-full" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-5 w-1/2" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
