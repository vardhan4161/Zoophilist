import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapPin,
  Navigation,
  Search,
  Check,
  ExternalLink,
  Loader2,
  X,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export interface PinnedLocation {
  latitude: string;
  longitude: string;
  mapUrl: string;
  formattedAddress?: string;
  area?: string;
  city?: string;
}

interface LocationPickerProps {
  initialLat?: string;
  initialLng?: string;
  onLocationSelect: (location: PinnedLocation) => void;
  triggerButton?: React.ReactNode;
}

// Default center: Hyderabad, India (Zoophilist's primary operational hub)
const DEFAULT_CENTER = { lat: 17.385044, lng: 78.486671 };

export function LocationPicker({
  initialLat,
  initialLng,
  onLocationSelect,
  triggerButton,
}: LocationPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number }>(() => {
    const lat = initialLat ? parseFloat(initialLat) : NaN;
    const lng = initialLng ? parseFloat(initialLng) : NaN;
    return !isNaN(lat) && !isNaN(lng) ? { lat, lng } : DEFAULT_CENTER;
  });

  const [addressDetails, setAddressDetails] = useState<{
    display_name: string;
    road?: string;
    suburb?: string;
    city?: string;
    postcode?: string;
  } | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerInstanceRef = useRef<L.Marker | null>(null);

  // Custom Pet Grooming Pin
  const customPinIcon = L.divIcon({
    className: "custom-map-pin",
    html: `
      <div style="position: relative; width: 38px; height: 38px; transform: translate(-50%, -100%);">
        <div style="
          width: 38px;
          height: 38px;
          background: #22c55e;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(0,0,0,0.6);
          border: 2.5px solid #ffffff;
        ">
          <span style="transform: rotate(45deg); font-size: 18px; line-height: 1;">🐾</span>
        </div>
        <div style="
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 10px;
          height: 5px;
          background: rgba(0,0,0,0.35);
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
  });

  // Reverse geocoding function
  const fetchReverseGeocode = async (lat: number, lng: number) => {
    setIsReverseGeocoding(true);
    setGeoError(null);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { "Accept-Language": "en" } }
      );
      if (res.ok) {
        const data = await res.json();
        const addr = data.address || {};
        setAddressDetails({
          display_name: data.display_name,
          road: addr.road || addr.pedestrian || addr.suburb || "",
          suburb: addr.suburb || addr.neighbourhood || addr.residential || "",
          city: addr.city || addr.town || addr.county || addr.state_district || "Hyderabad",
          postcode: addr.postcode || "",
        });
      }
    } catch {
      // Fallback: Coordinates remain set even if network geocoding fails
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  // Initialize or re-center map when dialog opens
  useEffect(() => {
    if (!isOpen) {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerInstanceRef.current = null;
      }
      return;
    }

    // Brief timeout to ensure DOM container is rendered
    const timer = setTimeout(() => {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: [selectedCoords.lat, selectedCoords.lng],
        zoom: 15,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      // Create draggable marker
      const marker = L.marker([selectedCoords.lat, selectedCoords.lng], {
        icon: customPinIcon,
        draggable: true,
      }).addTo(map);

      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        setSelectedCoords({ lat: pos.lat, lng: pos.lng });
        fetchReverseGeocode(pos.lat, pos.lng);
      });

      map.on("click", (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        setSelectedCoords({ lat, lng });
        fetchReverseGeocode(lat, lng);
      });

      mapInstanceRef.current = map;
      markerInstanceRef.current = marker;

      // Initial reverse geocode if not already loaded
      fetchReverseGeocode(selectedCoords.lat, selectedCoords.lng);
    }, 150);

    return () => clearTimeout(timer);
  }, [isOpen]);

  // Handle GPS Locate Me
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser");
      return;
    }

    setIsGeolocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsGeolocating(false);
        const { latitude, longitude } = position.coords;
        setSelectedCoords({ lat: latitude, lng: longitude });

        if (mapInstanceRef.current && markerInstanceRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 17);
          markerInstanceRef.current.setLatLng([latitude, longitude]);
        }
        fetchReverseGeocode(latitude, longitude);
      },
      (error) => {
        setIsGeolocating(false);
        let msg = "Could not detect location. Please pin manually on map.";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "Location access denied. Please click on the map to pin your home.";
        }
        setGeoError(msg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Handle Address Search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setGeoError(null);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=5&countrycodes=in`,
        { headers: { "Accept-Language": "en" } }
      );
      if (res.ok) {
        const results = await res.json();
        setSearchResults(results);
        if (results.length === 0) {
          setGeoError("No matching places found. Try a nearby locality or landmark.");
        }
      }
    } catch {
      setGeoError("Search request failed. Please drop pin on map directly.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    setSelectedCoords({ lat, lng });
    setSearchResults([]);
    setSearchQuery("");

    if (mapInstanceRef.current && markerInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lng], 16);
      markerInstanceRef.current.setLatLng([lat, lng]);
    }
    fetchReverseGeocode(lat, lng);
  };

  const googleMapsUrl = `https://www.google.com/maps?q=${selectedCoords.lat.toFixed(6)},${selectedCoords.lng.toFixed(6)}`;

  const handleConfirm = () => {
    const formattedLat = selectedCoords.lat.toFixed(6);
    const formattedLng = selectedCoords.lng.toFixed(6);
    const mapUrl = `https://www.google.com/maps?q=${formattedLat},${formattedLng}`;

    onLocationSelect({
      latitude: formattedLat,
      longitude: formattedLng,
      mapUrl,
      formattedAddress: addressDetails?.display_name,
      area: addressDetails?.suburb || addressDetails?.road,
      city: addressDetails?.city,
    });

    setIsOpen(false);
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)}>
        {triggerButton || (
          <Button
            type="button"
            variant="outline"
            className="w-full h-11 border-primary/40 hover:bg-primary/10 text-primary flex items-center justify-center gap-2 font-medium"
          >
            <MapPin className="w-4 h-4 text-primary" />
            <span>Pin Exact Doorstep on Map</span>
          </Button>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl bg-card border-white/10 p-0 overflow-hidden flex flex-col max-h-[92vh]">
          {/* Header */}
          <DialogHeader className="p-4 sm:p-5 border-b border-white/10 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
                    Pin Your Doorstep Location
                  </DialogTitle>
                  <DialogDescription className="text-xs text-gray-400">
                    Click anywhere on the map or drag the pin to mark your exact gate or door.
                  </DialogDescription>
                </div>
              </div>
            </div>
          </DialogHeader>

          {/* Search & Actions Bar */}
          <div className="p-3 sm:px-5 bg-background/50 border-b border-white/10 flex flex-col sm:flex-row gap-2.5 relative">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSearch(e);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.stopPropagation();
                }
              }}
              className="flex-1 flex gap-2"
            >
              <div className="relative flex-1">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search apartment, locality, landmark (e.g. Banjara Hills)..."
                  className="h-9 text-xs pl-8 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
                <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <Button
                type="submit"
                size="sm"
                variant="secondary"
                disabled={isSearching}
                className="h-9 text-xs px-3 font-medium bg-muted hover:bg-muted/80 text-foreground border border-border"
              >
                {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Search"}
              </Button>
            </form>

            <Button
              type="button"
              size="sm"
              onClick={handleLocateMe}
              disabled={isGeolocating}
              className="h-9 text-xs gap-1.5 bg-primary/15 hover:bg-primary/25 text-primary border border-primary/30 font-medium whitespace-nowrap"
            >
              {isGeolocating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Navigation className="w-3.5 h-3.5" />
              )}
              <span>Locate Me (GPS)</span>
            </Button>

            {/* Search results dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute left-5 right-5 top-14 z-50 bg-card border border-border rounded-lg shadow-2xl max-h-48 overflow-y-auto">
                {searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSearchResult(item)}
                    className="w-full text-left px-3 py-2 text-xs text-foreground/80 hover:bg-primary/10 hover:text-primary border-b border-border/50 last:border-0 flex items-start gap-2 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{item.display_name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Error Message */}
          {geoError && (
            <div className="px-5 py-2 bg-amber-500/10 border-b border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{geoError}</span>
            </div>
          )}

          {/* Interactive Map View */}
          <div className="relative flex-1 min-h-[300px] sm:min-h-[360px] bg-black/60">
            <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />

            {/* Instruction Badge */}
            <div className="absolute top-3 left-3 z-10 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[11px] text-gray-200 flex items-center gap-1.5 shadow-lg pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Drag pin or click map to adjust</span>
            </div>

            {/* Reverse geocoding spinner */}
            {isReverseGeocoding && (
              <div className="absolute bottom-3 right-3 z-10 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[11px] text-primary flex items-center gap-2 shadow-lg">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Reading address...</span>
              </div>
            )}
          </div>

          {/* Selected Location Details & Confirmation */}
          <div className="p-4 sm:p-5 bg-card border-t border-white/10 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                  Selected Doorstep Location
                </div>
                <div className="text-xs text-white truncate font-medium mt-0.5">
                  {addressDetails?.display_name ||
                    `Lat: ${selectedCoords.lat.toFixed(5)}, Lng: ${selectedCoords.lng.toFixed(5)}`}
                </div>
                <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-1">
                  <span>
                    Coords: {selectedCoords.lat.toFixed(4)}, {selectedCoords.lng.toFixed(4)}
                  </span>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    <span>Test in Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 sm:pt-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-10 px-4 text-xs border-white/10 text-gray-300 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleConfirm}
                  className="h-10 px-5 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-1.5 shadow-md shadow-primary/20"
                >
                  <Check className="w-4 h-4" />
                  <span>Use This Pinned Location</span>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
