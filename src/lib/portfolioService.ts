import { externalSupabase } from "@/lib/externalSupabase";

export interface PortfolioItem {
  id?: string;
  title: string;
  roomType: string;
  projectType: string;
  budgetRange: string;
  imageUrl: string;
  createdAt?: Date;
}

// Upload image to Supabase Storage
export const uploadImage = async (file: File): Promise<{ url: string; path: string }> => {
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
  const path = `${timestamp}_${safeName}`;
  
  const { data, error } = await externalSupabase.storage
    .from('portfolio')
    .upload(path, file);
  
  if (error) {
    console.error("Upload error:", error);
    throw new Error("Failed to upload image. Please try again.");
  }
  
  const { data: urlData } = externalSupabase.storage
    .from('portfolio')
    .getPublicUrl(path);
  
  return { url: urlData.publicUrl, path };
};

// Delete image from Supabase Storage
export const deleteImage = async (imagePath: string): Promise<void> => {
  if (!imagePath) return;
  try {
    await externalSupabase.storage.from('portfolio').remove([imagePath]);
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};

// Get all portfolio items
export const getPortfolioItems = async (): Promise<PortfolioItem[]> => {
  const { data, error } = await externalSupabase
    .from('portfolio_items')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching portfolio:", error);
    throw new Error("Failed to load portfolio items.");
  }
  
  return (data || []).map((item: any) => ({
    id: item.id,
    title: item.title,
    roomType: item.room_type,
    projectType: item.project_type,
    budgetRange: item.budget_range,
    imageUrl: item.image_url,
    createdAt: new Date(item.created_at)
  }));
};

// Add a new portfolio item
export const addPortfolioItem = async (item: Omit<PortfolioItem, 'id' | 'createdAt'>): Promise<string> => {
  const { data, error } = await externalSupabase
    .from('portfolio_items')
    .insert({
      title: item.title,
      room_type: item.roomType,
      project_type: item.projectType,
      budget_range: item.budgetRange,
      image_url: item.imageUrl
    })
    .select('id')
    .single();
  
  if (error) {
    console.error("Error adding portfolio item:", error);
    throw new Error("Failed to save portfolio item.");
  }
  
  return data.id;
};

// Update a portfolio item
export const updatePortfolioItem = async (id: string, item: Partial<PortfolioItem>): Promise<void> => {
  const updateData: Record<string, any> = {};
  if (item.title !== undefined) updateData.title = item.title;
  if (item.roomType !== undefined) updateData.room_type = item.roomType;
  if (item.projectType !== undefined) updateData.project_type = item.projectType;
  if (item.budgetRange !== undefined) updateData.budget_range = item.budgetRange;
  if (item.imageUrl !== undefined) updateData.image_url = item.imageUrl;

  const { error } = await externalSupabase
    .from('portfolio_items')
    .update(updateData)
    .eq('id', id);
  
  if (error) {
    console.error("Error updating portfolio item:", error);
    throw new Error("Failed to update portfolio item.");
  }
};

// Delete a portfolio item
export const deletePortfolioItem = async (id: string, imagePath?: string): Promise<void> => {
  if (imagePath) {
    await deleteImage(imagePath);
  }
  
  const { error } = await externalSupabase
    .from('portfolio_items')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting portfolio item:", error);
    throw new Error("Failed to delete portfolio item.");
  }
};

// Room type options for filters
export const ROOM_TYPES = [
  "All",
  "Living Room",
  "Bedroom",
  "Kitchen",
  "Bathroom",
  "Dining"
] as const;

// Project type options
export const PROJECT_TYPES = [
  "3BHK Residence",
  "2BHK Residence",
  "Villa",
  "Penthouse",
  "Kitchen Remodel",
  "Bathroom Remodel",
  "Renovation"
] as const;

// Budget range options
export const BUDGET_RANGES = [
  "₹10L - 30L",
  "₹30L - 50L",
  "₹50L - 1CR",
  "₹1CR - 2CR",
  "₹2CR+"
] as const;
