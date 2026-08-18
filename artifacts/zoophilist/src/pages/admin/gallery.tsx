import { useState } from "react";
import { useGetGallery, useCreateGalleryItem, useDeleteGalleryItem, getGetGalleryQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Upload, PlayCircle } from "lucide-react";

const CATEGORIES = ["Grooming", "Bath", "Haircut", "Happy Pets"];

export default function AdminGallery() {
  const { data: gallery, isLoading } = useGetGallery();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const createItem = useCreateGalleryItem();
  const deleteItem = useDeleteGalleryItem();

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      url: formData.get("url") as string,
      type: formData.get("type") as "image" | "video",
      category: formData.get("category") as string,
      caption: formData.get("caption") as string,
    };

    createItem.mutate({ data }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetGalleryQueryKey() });
        setIsDialogOpen(false);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this media item?")) {
      deleteItem.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetGalleryQueryKey() });
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Gallery Management</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Upload className="w-4 h-4" /> Add Media</Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Add to Gallery</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Media URL *</Label>
                <Input name="url" required placeholder="https://..." className="bg-background/50 border-white/10" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type *</Label>
                  <Select name="type" defaultValue="image">
                    <SelectTrigger className="bg-background/50 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select name="category" defaultValue={CATEGORIES[0]}>
                    <SelectTrigger className="bg-background/50 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Caption (Optional)</Label>
                <Input name="caption" className="bg-background/50 border-white/10" />
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" disabled={createItem.isPending}>Upload</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {gallery?.map((item) => (
          <div key={item.id} className="group relative aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/5">
            {item.type === 'video' ? (
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 pointer-events-none">
                <PlayCircle className="w-12 h-12 text-white/80" />
              </div>
            ) : null}
            <img src={item.url} alt={item.caption || ""} className="w-full h-full object-cover" />
            
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
              <div className="flex justify-end">
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="w-8 h-8 rounded-full"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div>
                <span className="text-xs font-medium bg-primary/20 text-primary px-2 py-1 rounded">
                  {item.category}
                </span>
              </div>
            </div>
          </div>
        ))}
        {gallery?.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed border-white/10 rounded-xl">
            No media found in the gallery. Upload some images to show off your work!
          </div>
        )}
      </div>
    </div>
  );
}