import { PageTransition, StaggerContainer, StaggerItem } from "@/components/animations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { PlayCircle } from "lucide-react";
import { useGetGallery } from "@workspace/api-client-react";

const CATEGORIES = ["All", "Grooming", "Bath", "Haircut", "Happy Pets"];

const STATIC_GALLERY = [
  { id: "g1", url: "/images/gallery-1.jpg", type: "image", category: "Happy Pets" },
  { id: "g2", url: "/images/gallery-2.jpg", type: "image", category: "Grooming" },
  { id: "g3", url: "/images/gallery-3.jpg", type: "image", category: "Bath" },
  { id: "g4", url: "/images/gallery-4.jpg", type: "image", category: "Haircut" },
  { id: "g5", url: "/images/gallery-5.jpg", type: "image", category: "Grooming" },
  { id: "g6", url: "/images/hero.jpg", type: "image", category: "Happy Pets" },
];

export default function Gallery() {
  const [activeTab, setActiveTab] = useState("All");
  const { data: apiGallery, isLoading } = useGetGallery();
  
  const galleryData = apiGallery?.length ? apiGallery : STATIC_GALLERY;

  const filteredGallery = activeTab === "All" 
    ? galleryData 
    : galleryData.filter(item => item.category.toLowerCase() === activeTab.toLowerCase());

  return (
    <PageTransition className="pt-32 pb-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Our Happy Clients</h1>
          <p className="text-lg text-muted-foreground">
            Take a look at some of the furry friends we've had the pleasure of pampering.
          </p>
        </div>

        <Tabs defaultValue="All" value={activeTab} onValueChange={setActiveTab} className="w-full mb-12">
          <div className="flex justify-center mb-8 overflow-x-auto pb-4 hide-scrollbar">
            <TabsList className="bg-card/50 border border-white/10 rounded-full p-1 h-auto inline-flex whitespace-nowrap">
              {CATEGORIES.map(cat => (
                <TabsTrigger 
                  key={cat} 
                  value={cat}
                  className="rounded-full px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm font-medium transition-all"
                >
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="aspect-square bg-white/5 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : filteredGallery.length > 0 ? (
              <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6" key={activeTab}>
                {filteredGallery.map((item, i) => (
                  <StaggerItem key={item.id} className="relative aspect-square group rounded-2xl overflow-hidden bg-card border border-white/5">
                    {item.type === 'video' ? (
                      <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
                        <PlayCircle className="w-16 h-16 text-white/80 group-hover:text-primary transition-colors" />
                      </div>
                    ) : null}
                    <img 
                      src={item.url} 
                      alt={(item as any).caption || item.category} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <span className="text-white font-medium">{item.category}</span>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            ) : (
              <div className="text-center py-24 glass-card rounded-[2rem]">
                <p className="text-xl text-muted-foreground">No media found in this category yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
}