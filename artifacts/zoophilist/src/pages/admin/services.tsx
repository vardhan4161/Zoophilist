import { useState } from "react";
import { 
  useGetServices, 
  useCreateService, 
  useUpdateService, 
  useDeleteService,
  getGetServicesQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit2, Trash2, CheckCircle2 } from "lucide-react";
import { STATIC_SERVICES } from "@/lib/constants";

export default function AdminServices() {
  const { data: apiServices, isLoading } = useGetServices();
  const services = apiServices?.length ? apiServices : STATIC_SERVICES;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);

  const queryClient = useQueryClient();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get("name") as string,
      price: Number(formData.get("price")),
      originalPrice: formData.get("originalPrice") ? Number(formData.get("originalPrice")) : undefined,
      description: formData.get("description") as string,
      features: (formData.get("features") as string).split("\n").filter(Boolean),
      badge: formData.get("badge") as string,
      isSubscription: formData.get("isSubscription") === "on"
    };

    if (editingService) {
      updateService.mutate({ id: editingService.id, data }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetServicesQueryKey() });
          setIsDialogOpen(false);
        }
      });
    } else {
      createService.mutate({ data }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetServicesQueryKey() });
          setIsDialogOpen(false);
        }
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      deleteService.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetServicesQueryKey() });
        }
      });
    }
  };

  const openEdit = (service: any) => {
    setEditingService(service);
    setIsDialogOpen(true);
  };

  const openCreate = () => {
    setEditingService(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Services</h1>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="w-4 h-4" /> Add Service
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-white/10 text-white sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSave} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Service Name *</Label>
                <Input name="name" defaultValue={editingService?.name} required className="bg-background/50 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label>Badge (Optional)</Label>
                <Input name="badge" defaultValue={editingService?.badge} placeholder="e.g. Popular" className="bg-background/50 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label>Price (₹) *</Label>
                <Input name="price" type="number" defaultValue={editingService?.price} required className="bg-background/50 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label>Original Price (₹)</Label>
                <Input name="originalPrice" type="number" defaultValue={editingService?.originalPrice} className="bg-background/50 border-white/10" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea name="description" defaultValue={editingService?.description} className="bg-background/50 border-white/10" />
            </div>
            
            <div className="space-y-2">
              <Label>Features (One per line) *</Label>
              <Textarea 
                name="features" 
                defaultValue={editingService?.features?.join('\n')} 
                required 
                className="min-h-[120px] bg-background/50 border-white/10" 
                placeholder="Bath with Shampoo&#10;Nail Clipping&#10;Blow Dry"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Switch name="isSubscription" defaultChecked={editingService?.isSubscription} id="sub" />
              <Label htmlFor="sub">Is this a subscription plan?</Label>
            </div>

            <DialogFooter className="pt-4">
              <Button type="submit" disabled={createService.isPending || updateService.isPending}>
                Save Service
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="bg-card border-white/5 relative flex flex-col">
            <CardContent className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white">{service.name}</h3>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white" onClick={() => openEdit(service)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500 hover:text-rose-400 hover:bg-rose-500/10" onClick={() => handleDelete(service.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl font-bold text-primary">₹{service.price}</span>
                {service.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">₹{service.originalPrice}</span>
                )}
              </div>
              
              <div className="space-y-2 mb-6 flex-1">
                {service.features.slice(0, 4).map((f: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-gray-300">{f}</span>
                  </div>
                ))}
                {service.features.length > 4 && (
                  <div className="text-sm text-muted-foreground pl-6">
                    + {service.features.length - 4} more
                  </div>
                )}
              </div>
              
              <div className="mt-auto">
                <div className="text-xs text-muted-foreground flex gap-2">
                  {service.badge && <span className="bg-primary/20 text-primary px-2 py-0.5 rounded">{service.badge}</span>}
                  {service.isSubscription && <span className="bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded">Subscription</span>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}