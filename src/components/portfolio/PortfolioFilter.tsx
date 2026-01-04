import { cn } from '@/lib/utils';
import { ROOM_TYPES } from '@/lib/portfolioService';

interface PortfolioFilterProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function PortfolioFilter({ activeFilter, onFilterChange }: PortfolioFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {ROOM_TYPES.map((type) => (
        <button
          key={type}
          onClick={() => onFilterChange(type)}
          className={cn(
            "px-4 py-2 text-sm font-medium tracking-wide transition-all duration-200 rounded",
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
