import { PortfolioItem } from '@/lib/portfolioService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface PortfolioCardProps {
  item: PortfolioItem;
  onEdit: (item: PortfolioItem) => void;
  onDelete: (item: PortfolioItem) => void;
  isManageMode?: boolean;
}

export function PortfolioCard({ item, onEdit, onDelete, isManageMode }: PortfolioCardProps) {
  return (
    <Card className="group overflow-hidden border-0 shadow-soft hover:shadow-elegant transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {isManageMode && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              size="icon"
              variant="secondary"
              onClick={() => onEdit(item)}
              className="w-10 h-10"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              onClick={() => onDelete(item)}
              className="w-10 h-10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <span className="uppercase tracking-widest">{item.projectType}</span>
          <span>•</span>
          <span>{item.budgetRange}</span>
        </div>
        <h3 className="font-display text-lg font-medium text-foreground">
          {item.title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">{item.roomType}</p>
      </CardContent>
    </Card>
  );
}
