import { useRef, useState } from "react";
import { useGetGallery, useCreateGalleryItem, useDeleteGalleryItem, getGetGalleryQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Upload, PlayCircle, Pencil, Star } from "lucide-react";
import { validateAdminGalleryFile } from "@/lib/admin-media-upload";

const CATEGORIES = [
  { value: "grooming", label: "Grooming" },
  { value: "bath", label: "Bath" },
  { value: "haircut", label: "Haircut" },
  { value: "happypets", label: "Happy Pets" },
];

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

type GalleryMetadata = { category?: string; caption?: string; featured?: boolean };

async function updateGalleryMetadata(id: string, data: GalleryMetadata) {
  const token = localStorage.getItem("adminToken");
  const response = await fetch(`/api/gallery/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(data),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "The gallery item could not be updated. Please try again.");
  return payload;
}

export default function AdminGallery() {
  const { data: gallery, isLoading } = useGetGallery();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [caption, setCaption] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editingItem, setEditingItem] = useState<{ id: string; category: string; caption?: string; featured?: boolean } | null>(null);
  const [editingCategory, setEditingCategory] = useState(CATEGORIES[0].value);
  const [editingCaption, setEditingCaption] = useState("");
  const [editingFeatured, setEditingFeatured] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const createItem = useCreateGalleryItem();
  const deleteItem = useDeleteGalleryItem();

  const resetForm = () => {
    setSelectedFile(null);
    setCategory(CATEGORIES[0].value);
    setCaption("");
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) resetForm();
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = selectedFile;
    const clientValidationError = validateAdminGalleryFile(file);
    if (!file || clientValidationError) {
      setUploadError(clientValidationError);
      return;
    }

    setUploadError(null);
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      });
      const uploaded = await response.json().catch(() => ({}));
      if (!response.ok || typeof uploaded.url !== "string") {
        throw new Error(uploaded.error || "The media upload could not be completed. Please try again.");
      }

      await createItem.mutateAsync({
        data: {
          url: uploaded.url,
          type: uploaded.type === "video" ? "video" : "image",
          category,
          caption: caption.trim(),
        },
      });
      await queryClient.invalidateQueries({ queryKey: getGetGalleryQueryKey() });
      handleDialogChange(false);
    } catch (error) {
      setUploadError(errorMessage(error, "The gallery item could not be saved. Please try again."));
    } finally {
      setIsUploading(false);
    }
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

  const openEditor = (item: { id: string; category: string; caption?: string; featured?: boolean }) => {
    setEditingItem(item);
    setEditingCategory(item.category);
    setEditingCaption(item.caption ?? "");
    setEditingFeatured(Boolean(item.featured));
    setActionError(null);
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingItem) return;
    setActionError(null);
    setIsSavingEdit(true);
    try {
      await updateGalleryMetadata(editingItem.id, {
        category: editingCategory,
        caption: editingCaption.trim(),
        featured: editingFeatured,
      });
      await queryClient.invalidateQueries({ queryKey: getGetGalleryQueryKey() });
      setEditingItem(null);
    } catch (error) {
      setActionError(errorMessage(error, "The gallery item could not be updated. Please try again."));
    } finally {
      setIsSavingEdit(false);
    }
  };

  const toggleFeatured = async (item: { id: string; featured?: boolean }) => {
    setActionError(null);
    try {
      await updateGalleryMetadata(item.id, { featured: !item.featured });
      await queryClient.invalidateQueries({ queryKey: getGetGalleryQueryKey() });
    } catch (error) {
      setActionError(errorMessage(error, "The featured status could not be updated. Please try again."));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Gallery Management</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Upload className="w-4 h-4" /> Add Media</Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Add to Gallery</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="gallery-media">Image or video *</Label>
                <Input
                  id="gallery-media"
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
                  onChange={(event) => {
                    setSelectedFile(event.target.files?.[0] ?? null);
                    setUploadError(null);
                  }}
                  className="bg-background/50 border-white/10 file:text-foreground"
                />
                <p className="text-xs text-muted-foreground">JPG, PNG, WebP, MP4, or WebM. Images up to 5MB; videos up to 20MB.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gallery-category">Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="gallery-category" className="bg-background/50 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(({ value, label }) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gallery-caption">Caption (optional)</Label>
                <Input id="gallery-caption" value={caption} onChange={(event) => setCaption(event.target.value)} className="bg-background/50 border-white/10" />
              </div>
              {uploadError && <p role="alert" className="text-sm text-destructive">{uploadError}</p>}
              <DialogFooter className="pt-4">
                <Button type="submit" disabled={isUploading || createItem.isPending}>
                  {isUploading || createItem.isPending ? "Uploading…" : "Upload"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {actionError && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{actionError}</p>}

      <Dialog open={Boolean(editingItem)} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="bg-card border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Edit gallery item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-gallery-category">Category *</Label>
              <Select value={editingCategory} onValueChange={setEditingCategory}>
                <SelectTrigger id="edit-gallery-category" className="bg-background/50 border-white/10"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(({ value, label }) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-gallery-caption">Caption</Label>
              <Input id="edit-gallery-caption" value={editingCaption} maxLength={300} onChange={(event) => setEditingCaption(event.target.value)} className="bg-background/50 border-white/10" />
            </div>
            <label className="flex cursor-pointer items-center gap-3 text-sm text-muted-foreground">
              <Checkbox checked={editingFeatured} onCheckedChange={(checked) => setEditingFeatured(checked === true)} />
              Feature this media item first in the gallery.
            </label>
            {actionError && <p role="alert" className="text-sm text-destructive">{actionError}</p>}
            <DialogFooter><Button type="submit" disabled={isSavingEdit}>{isSavingEdit ? "Saving…" : "Save changes"}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {gallery?.map((item) => (
          <div key={item.id} className="group relative aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/5">
            {item.type === 'video' ? (
              <>
                <video src={item.url} aria-label={item.caption || "Gallery video"} className="w-full h-full object-cover" controls preload="metadata" playsInline />
                <div className="absolute inset-0 bg-background/30 flex items-center justify-center z-10 pointer-events-none">
                  <PlayCircle className="w-12 h-12 text-white/80" />
                </div>
              </>
            ) : (
              <img src={item.url} alt={item.caption || "Zoophilist pet grooming gallery"} loading="lazy" className="w-full h-full object-cover" />
            )}
            
            <div className="absolute inset-0 z-20 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100 flex flex-col justify-between p-4">
              <div className="flex justify-end">
                <Button variant={item.featured ? "secondary" : "outline"} size="icon" className="mr-2 h-8 w-8 rounded-full" onClick={() => toggleFeatured(item)} aria-label={item.featured ? "Remove from featured gallery" : "Feature gallery item"}>
                  <Star className={`w-4 h-4 ${item.featured ? "fill-current" : ""}`} />
                </Button>
                <Button variant="secondary" size="icon" className="mr-2 h-8 w-8 rounded-full" onClick={() => openEditor(item)} aria-label={`Edit ${item.caption || "gallery item"}`}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="w-8 h-8 rounded-full"
                  onClick={() => handleDelete(item.id)}
                  aria-label={`Delete ${item.caption || "gallery item"}`}
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
