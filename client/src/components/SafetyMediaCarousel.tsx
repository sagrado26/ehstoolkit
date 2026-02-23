import { useState, useEffect, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, Image, FileText, Video } from "lucide-react";

import ppeImage from "@assets/generated_images/safety_ppe_equipment_display.png";
import lotoImage from "@assets/generated_images/loto_safety_procedure_training.png";
import evacuationImage from "@assets/generated_images/emergency_evacuation_route_map.png";
import hazardImage from "@assets/generated_images/hazard_zone_warning_signage.png";

interface MediaItem {
  id: number;
  type: "image" | "video" | "document";
  title: string;
  description: string;
  thumbnail: string;
  date: string;
}

const mediaItems: MediaItem[] = [
  {
    id: 1,
    type: "image",
    title: "PPE Requirements Update",
    description: "New safety gear requirements for Zone A operations",
    thumbnail: ppeImage,
    date: "Jan 3, 2026"
  },
  {
    id: 2,
    type: "video",
    title: "LOTO Training Video",
    description: "Updated lockout/tagout procedures training",
    thumbnail: lotoImage,
    date: "Jan 2, 2026"
  },
  {
    id: 3,
    type: "document",
    title: "Emergency Response Guide",
    description: "Quick reference for emergency situations",
    thumbnail: evacuationImage,
    date: "Dec 28, 2025"
  },
  {
    id: 4,
    type: "image",
    title: "Hazard Zone Map",
    description: "Updated facility hazard zones and safe routes",
    thumbnail: hazardImage,
    date: "Dec 20, 2025"
  }
];

interface SafetyMediaCarouselProps {
  className?: string;
  compact?: boolean;
  overlayContent?: ReactNode;
}

export default function SafetyMediaCarousel({ className = "", compact = false, overlayContent }: SafetyMediaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const currentItem = mediaItems[currentIndex];
  const TypeIcon = currentItem.type === "video" ? Video : currentItem.type === "document" ? FileText : Image;

  if (compact) {
    return (
      <div className={`relative rounded-lg overflow-hidden ${className}`}>
        <div className="relative aspect-video">
          <img 
            src={currentItem.thumbnail} 
            alt={currentItem.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium backdrop-blur-sm ${
                currentItem.type === "video" ? "bg-green-500/80 text-white" :
                currentItem.type === "document" ? "bg-amber-500/80 text-white" :
                "bg-blue-500/80 text-white"
              }`}>
                {currentItem.type.charAt(0).toUpperCase() + currentItem.type.slice(1)}
              </span>
              <span className="text-[10px] text-white/80">{currentItem.date}</span>
            </div>
            <h3 className="text-sm font-semibold text-white line-clamp-1">{currentItem.title}</h3>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 h-7 w-7 bg-black/20 text-white hover:bg-black/40 backdrop-blur-sm"
            onClick={goToPrevious}
            aria-label="Previous slide"
            data-testid="button-carousel-prev"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 bg-black/20 text-white hover:bg-black/40 backdrop-blur-sm"
            onClick={goToNext}
            aria-label="Next slide"
            data-testid="button-carousel-next"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {mediaItems.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentIndex(idx);
              }}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                idx === currentIndex ? "bg-white w-4" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
              data-testid={`button-carousel-dot-${idx}`}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className={`relative rounded-xl overflow-hidden shadow-lg ${className}`}>
      <div className="relative aspect-[21/9]">
        <img 
          src={currentItem.thumbnail} 
          alt={currentItem.title}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        
        {/* Overlay Content - positioned top left */}
        {overlayContent && (
          <div className="absolute top-4 left-4 lg:top-6 lg:left-6 z-10">
            {overlayContent}
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md ${
                currentItem.type === "video" ? "bg-green-500/90 text-white" :
                currentItem.type === "document" ? "bg-amber-500/90 text-white" :
                "bg-blue-500/90 text-white"
              }`}>
                <TypeIcon className="w-3.5 h-3.5" />
                {currentItem.type.charAt(0).toUpperCase() + currentItem.type.slice(1)}
              </div>
              <span className="text-sm text-white/70 font-medium">{currentItem.date}</span>
              <div className="flex-1" />
              <span className="text-xs text-white/50">{currentIndex + 1} / {mediaItems.length}</span>
            </div>
            
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2 drop-shadow-lg">
              {currentItem.title}
            </h2>
            <p className="text-sm lg:text-base text-white/80 max-w-lg">
              {currentItem.description}
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="icon"
          className="absolute right-16 top-1/2 -translate-y-1/2 rounded-full shadow-lg"
          onClick={goToPrevious}
          aria-label="Previous slide"
          data-testid="button-carousel-prev"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full shadow-lg"
          onClick={goToNext}
          aria-label="Next slide"
          data-testid="button-carousel-next"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>

        <div className="absolute bottom-4 right-6 lg:right-8 flex items-center gap-2">
          {mediaItems.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentIndex(idx);
              }}
              className={`h-1 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "bg-white w-8" : "bg-white/40 w-4 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
              data-testid={`button-carousel-dot-${idx}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
