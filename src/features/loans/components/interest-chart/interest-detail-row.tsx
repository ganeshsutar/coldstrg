import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { InterestDetailRow as InterestDetailRowType } from "../../types";
import { formatCurrency } from "../../utils";

interface InterestDetailRowProps {
  details: InterestDetailRowType[];
}

export function InterestDetailRow({ details }: InterestDetailRowProps) {
  if (details.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No interest details available
      </div>
    );
  }

  const totalInterest = details.reduce((sum, d) => sum + d.interest, 0);
  const totalDays = details.reduce((sum, d) => sum + d.days, 0);

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>From Date</TableHead>
            <TableHead>To Date</TableHead>
            <TableHead className="text-right">Days</TableHead>
            <TableHead className="text-right">Balance</TableHead>
            <TableHead className="text-right">Rate (% p.m.)</TableHead>
            <TableHead className="text-right">Interest</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {details.map((detail, index) => (
            <TableRow key={index}>
              <TableCell>
                {format(new Date(detail.fromDate), "dd/MM/yyyy")}
              </TableCell>
              <TableCell>
                {format(new Date(detail.toDate), "dd/MM/yyyy")}
              </TableCell>
              <TableCell className="text-right">{detail.days}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(detail.balance)}
              </TableCell>
              <TableCell className="text-right">{detail.rate}%</TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(detail.interest)}
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="font-medium bg-muted/50">
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell className="text-right">{totalDays}</TableCell>
            <TableCell colSpan={2}></TableCell>
            <TableCell className="text-right">
              {formatCurrency(totalInterest)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
