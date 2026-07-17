import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon, Sparkles, Eye } from "lucide-react";
import { PageTransition, AuroraBackground, StaggerContainer, StaggerItem, FadeInUp, SectionLabel } from "@/components/animations";
import { useGetGallery } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORIES = ["All", "Bath", "Grooming", "Hair Cut", "Medical", "Before & After"] as const;
type Category = typeof CATEGORIES[number];

const PLACEHOLDER_GALLERY = [
  { id: "g1", title: "Max's Spa Day", caption: "Golden Retriever after premium spa bath", category: "Bath", imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80&auto=format&fit=crop", type: "image" },
  { id: "g2", title: "Luna's Haircut", caption: "Shih Tzu — show-dog styling", category: "Hair Cut", imageUrl: "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=600&q=80&auto=format&fit=crop", type: "image" },
  { id: "g3", title: "Whiskers Groomed", caption: "Persian Cat full grooming session", category: "Grooming", imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80&auto=format&fit=crop", type: "image" },
  { id: "g4", title: "Bruno's Medical Bath", caption: "Anti-tick treatment — German Shepherd", category: "Medical", imageUrl: "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=600&q=80&auto=format&fit=crop", type: "image" },
  { id: "g5", title: "Coco's Makeover", caption: "Pomeranian before & after", category: "Before & After", imageUrl: "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=600&q=80&auto=format&fit=crop", type: "image" },
  { id: "g6", title: "Happy After Bath", caption: "Beagle post-spa glow-up", category: "Bath", imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80&auto=format&fit=crop", type: "image" },
  { id: "g7", title: "Trim Time", caption: "Golden Retriever precision trim", category: "Hair Cut", imageUrl: "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=600&q=80&auto=format&fit=crop", type: "image" },
  { id: "g8", title: "Full Grooming", caption: "Labrador complete makeover", category: "Grooming", imageUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&q=80&auto=format&fit=crop", type: "image" },
  { id: "g9", title: "Skin Treatment", caption: "Medical bath for sensitive skin", category: "Medical", imageUrl: "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=600&q=80&auto=format&fit=crop", type: "image" },
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [lightbox, setLightbox] = useState<(typeof PLACEHOLDER_GALLERY)[0] | null>(null);

  const { data: apiGallery, isLoading } = useGetGallery({});
  const items = (apiGallery?.length ? apiGallery.map((g: any) => ({
    id: g.id,
    title: g.title ?? "Untitled",
    caption: g.caption ?? "",
    category: g.category ?? "Grooming",
    imageUrl: g.imageUrl ?? g.url ?? "",
    type: g.type ?? "image",
  })) : PLACEHOLDER_GALLERY) as typeof PLACEHOLDER_GALLERY;

  const filtered = activeCategory === "All" ? items : items.filter(i => i.category === activeCategory);

  return (
    <PageTransition className="pb-24">
      {/* Hero */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <AuroraBackground className="opacity-40" />
        <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <SectionLabel>
            <ImageIcon className="w-3.5 h-3.5" /> Gallery
          </SectionLabel>
          <FadeInUp>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-5 tracking-tight">
              Transformations &<br />
              <span className="text-gradient">Happy Pets</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Every session is a transformation. Browse our gallery of beautiful grooming results.
            </p>
          </FadeInUp>
        </div>
      </section>

      {/* Category filter */}
      <section className="container mx-auto px-4 mb-10">
        <FadeInUp>
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200
                  ${activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "glass border border-white/10 text-gray-400 hover:text-white hover:border-white/20"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </FadeInUp>
      </section>

      {/* Grid */}
      <section className="container mx-auto px-4 mb-16">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-2xl bg-white/5" />
            ))}
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {filtered.map((item) => (
                <StaggerItem key={item.id}>
                  <motion.div
                    layout
                    className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer border border-white/5 hover:border-primary/30 transition-colors"
                    onClick={() => setLightbox(item)}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 flex flex-col justify-end p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-bold text-sm">{item.title}</div>
                          <div className="text-gray-300 text-xs">{item.caption}</div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                          <Eye className="w-4 h-4 text-primary-foreground" />
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-medium backdrop-blur-sm border border-white/10">
                        {item.category}
                      </span>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </AnimatePresence>
          </StaggerContainer>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-24 text-muted-foreground">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No items in this category yet.</p>
          </div>
        )}
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative max-w-3xl w-full rounded-2xl overflow-hidden border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={lightbox.imageUrl} alt={lightbox.title} className="w-full max-h-[70vh] object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="text-white font-bold text-lg">{lightbox.title}</div>
                <div className="text-gray-300 text-sm">{lightbox.caption}</div>
              </div>
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <section className="container mx-auto px-4">
        <FadeInUp>
          <div className="glass-card rounded-2xl p-10 text-center">
            <Sparkles className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-black text-white mb-3">Want Your Pet Featured?</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm">
              Book a grooming session and share your pet's transformation with us — we love showcasing our work!
            </p>
            <a
              href="/book"
              className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20"
            >
              Book a Session
            </a>
          </div>
        </FadeInUp>
      </section>
    </PageTransition>
  );
}
