import { cn } from '@/lib/utils';
import { ROOM_TYPES } from '@/lib/portfolioService';

interface PortfolioFilterProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function PortfolioFilter({ activeFilter, onFilterChange }: PortfolioFilterProps) {
  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2 overflow-x-auto pb-2 -mx-1 px-1">
      {ROOM_TYPES.map((type) => (
        <button
          key={type}
          onClick={() => onFilterChange(type)}
          className={cn(
            "px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium tracking-wide transition-all duration-200 rounded whitespace-nowrap flex-shrink-0",
            activeFilter === type
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          {type.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
