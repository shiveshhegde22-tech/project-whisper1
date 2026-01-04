import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Loader2 } from 'lucide-react';
import { PortfolioItem, PROJECT_TYPES, BUDGET_RANGES, ROOM_TYPES, uploadImage, addPortfolioItem, updatePortfolioItem } from '@/lib/portfolioService';
import { useToast } from '@/hooks/use-toast';

interface PortfolioFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editItem?: PortfolioItem | null;
}

export function PortfolioFormModal({ isOpen, onClose, onSuccess, editItem }: PortfolioFormModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    roomType: '',
    projectType: '',
    budgetRange: ''
  });

  // Reset form when modal opens or editItem changes
  useEffect(() => {
    if (isOpen) {
      setImagePreview(editItem?.imageUrl || '');
      setImageFile(null);
      setFormData({
        title: editItem?.title || '',
        roomType: editItem?.roomType || '',
        projectType: editItem?.projectType || '',
        budgetRange: editItem?.budgetRange || ''
      });
    }
  }, [isOpen, editItem]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive"
        });
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editItem && !imageFile) {
      toast({
        title: "Image Required",
        description: "Please upload an image for the portfolio item.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.title || !formData.roomType || !formData.projectType || !formData.budgetRange) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      let imageUrl = editItem?.imageUrl || '';

      if (imageFile) {
        toast({
          title: "Uploading image...",
          description: "Please wait while your image is being uploaded."
        });
        
        const result = await uploadImage(imageFile);
        imageUrl = result.url;
      }

      const itemData = {
        title: formData.title,
        roomType: formData.roomType,
        projectType: formData.projectType,
        budgetRange: formData.budgetRange,
        imageUrl
      };

      if (editItem?.id) {
        await updatePortfolioItem(editItem.id, itemData);
        toast({ 
          title: "Success! ✓",
          description: "Portfolio item updated successfully."
        });
      } else {
        await addPortfolioItem(itemData);
        toast({ 
          title: "Success! ✓",
          description: "Portfolio item added successfully."
        });
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving portfolio item:', error);
      
      // Provide specific error messages based on error type
      let errorMessage = "Failed to save portfolio item. Please try again.";
      
      if (error?.code === 'storage/unauthorized') {
        errorMessage = "Permission denied. Please check Firebase Storage rules.";
      } else if (error?.code === 'storage/canceled') {
        errorMessage = "Upload was cancelled.";
      } else if (error?.code === 'storage/unknown') {
        errorMessage = "Upload failed. Please check your internet connection.";
      } else if (error?.message?.includes('not exist') || error?.code === 'not-found') {
        errorMessage = "Database not found. Please create Firestore database in Firebase Console.";
      } else if (error?.message?.includes('permission-denied') || error?.code === 'permission-denied') {
        errorMessage = "Permission denied. Please update Firestore security rules.";
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {editItem ? 'Edit Portfolio Item' : 'Add Portfolio Item'}
          </DialogTitle>
          <DialogDescription>
            {editItem ? 'Update the details of your portfolio project.' : 'Add a new project to showcase in your portfolio.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Project Image *</Label>
            <div 
              className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => document.getElementById('image-upload')?.click()}
            >
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-lg"
                />
              ) : (
                <div className="py-8">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload image</p>
                </div>
              )}
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Project Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Minimalist Living Haven"
            />
          </div>

          {/* Room Type */}
          <div className="space-y-2">
            <Label>Room Type *</Label>
            <Select 
              value={formData.roomType} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, roomType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select room type" />
              </SelectTrigger>
              <SelectContent>
                {ROOM_TYPES.filter(t => t !== 'All').map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Project Type */}
          <div className="space-y-2">
            <Label>Project Type *</Label>
            <Select 
              value={formData.projectType} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, projectType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select project type" />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_TYPES.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Budget Range */}
          <div className="space-y-2">
            <Label>Budget Range *</Label>
            <Select 
              value={formData.budgetRange} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, budgetRange: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select budget range" />
              </SelectTrigger>
              <SelectContent>
                {BUDGET_RANGES.map(range => (
                  <SelectItem key={range} value={range}>{range}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                editItem ? 'Update' : 'Add Item'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
