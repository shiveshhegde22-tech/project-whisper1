import { useState, useEffect } from 'react';
import { Plus, Settings2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PortfolioCard } from '@/components/portfolio/PortfolioCard';
import { PortfolioFilter } from '@/components/portfolio/PortfolioFilter';
import { PortfolioFormModal } from '@/components/portfolio/PortfolioFormModal';
import { 
  PortfolioItem, 
  getPortfolioItems, 
  deletePortfolioItem 
} from '@/lib/portfolioService';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Portfolio() {
  const { toast } = useToast();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isManageMode, setIsManageMode] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<PortfolioItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<PortfolioItem | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await getPortfolioItems();
      setItems(data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      toast({
        title: "Error",
        description: "Failed to load portfolio items.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredItems = activeFilter === 'All' 
    ? items 
    : items.filter(item => item.roomType === activeFilter);

  const handleEdit = (item: PortfolioItem) => {
    setEditItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteItem?.id) return;
    
    try {
      await deletePortfolioItem(deleteItem.id);
      toast({ title: "Portfolio item deleted successfully!" });
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: "Failed to delete portfolio item.",
        variant: "destructive"
      });
    } finally {
      setDeleteItem(null);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditItem(null);
  };

  const handleFormSuccess = () => {
    fetchItems();
    handleFormClose();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold text-foreground">
            Portfolio
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and showcase your interior design projects
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isManageMode ? "default" : "outline"}
            onClick={() => setIsManageMode(!isManageMode)}
          >
            <Settings2 className="w-4 h-4 mr-2" />
            {isManageMode ? 'Done' : 'Manage'}
          </Button>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>
      </div>

      {/* Filters */}
      <PortfolioFilter 
        activeFilter={activeFilter} 
        onFilterChange={setActiveFilter} 
      />

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">
            {items.length === 0 
              ? "No portfolio items yet. Add your first project!"
              : "No items match the selected filter."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <PortfolioCard
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={setDeleteItem}
              isManageMode={isManageMode}
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <PortfolioFormModal
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
          editItem={editItem}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Portfolio Item?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{deleteItem?.title}" and its image. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
