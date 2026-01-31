import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DateNavigatorProps {
  date: string;
  onDateChange: (date: string) => void;
}

export function DateNavigator({ date, onDateChange }: DateNavigatorProps) {
  const currentDate = new Date(date);

  const goToPrevDay = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    onDateChange(prev.toISOString().split("T")[0]);
  };

  const goToNextDay = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    onDateChange(next.toISOString().split("T")[0]);
  };

  const goToToday = () => {
    onDateChange(new Date().toISOString().split("T")[0]);
  };

  const isToday = date === new Date().toISOString().split("T")[0];

  const formatDisplayDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="flex items-center gap-2" data-testid="daybook-date-navigator">
      <Button variant="outline" size="icon" onClick={goToPrevDay} data-testid="daybook-nav-prev">
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-2 min-w-[250px]">
        <div className="relative flex-1">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="pl-9"
            data-testid="daybook-date-input"
          />
        </div>
      </div>

      <Button variant="outline" size="icon" onClick={goToNextDay} data-testid="daybook-nav-next">
        <ChevronRight className="h-4 w-4" />
      </Button>

      {!isToday && (
        <Button variant="ghost" size="sm" onClick={goToToday} data-testid="daybook-nav-today">
          Today
        </Button>
      )}

      <span className="text-sm text-muted-foreground ml-2" data-testid="daybook-date-display">
        {formatDisplayDate(date)}
      </span>
    </div>
  );
}
