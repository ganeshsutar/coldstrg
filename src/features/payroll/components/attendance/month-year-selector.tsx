import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MonthYearSelectorProps {
  year: number;
  month: number;
  onChange: (year: number, month: number) => void;
}

export function MonthYearSelector({
  year,
  month,
  onChange,
}: MonthYearSelectorProps) {
  const handlePrevMonth = () => {
    if (month === 1) {
      onChange(year - 1, 12);
    } else {
      onChange(year, month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      onChange(year + 1, 1);
    } else {
      onChange(year, month + 1);
    }
  };

  const monthName = new Date(year, month - 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const isCurrentMonth =
    new Date().getFullYear() === year && new Date().getMonth() + 1 === month;

  const isFutureMonth =
    year > new Date().getFullYear() ||
    (year === new Date().getFullYear() && month > new Date().getMonth() + 1);

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={handlePrevMonth}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="min-w-[180px] text-center">
        <span className="font-medium">{monthName}</span>
        {isCurrentMonth && (
          <span className="ml-2 text-xs text-muted-foreground">(Current)</span>
        )}
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={handleNextMonth}
        disabled={isFutureMonth}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
