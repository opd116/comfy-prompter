import { FileText, Image, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PromptType } from "@/lib/prompts-data";

interface PromptTypeSelectorProps {
  onSelect: (type: PromptType) => void;
}

const typeCards = [
  {
    type: "text" as PromptType,
    title: "Text Prompts",
    description: "AI writing, coding, and analysis prompts",
    icon: FileText,
    gradient: "from-primary/20 to-accent/20",
    iconColor: "text-primary",
  },
  {
    type: "image" as PromptType,
    title: "Image Prompts",
    description: "Generate stunning visuals with AI",
    icon: Image,
    gradient: "from-accent/20 to-secondary/30",
    iconColor: "text-accent-foreground",
  },
  {
    type: "video" as PromptType,
    title: "Video Prompts",
    description: "Create cinematic video content",
    icon: Video,
    gradient: "from-secondary/30 to-primary/20",
    iconColor: "text-secondary-foreground",
  },
];

export const PromptTypeSelector = ({ onSelect }: PromptTypeSelectorProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Prompt Library
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose your prompt type to get started
          </p>
        </div>

        {/* Type Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {typeCards.map((card, index) => (
            <button
              key={card.type}
              onClick={() => onSelect(card.type)}
              style={{ animationDelay: `${index * 100}ms` }}
              className={cn(
                "group relative p-8 rounded-3xl border border-border/30",
                "bg-gradient-to-br backdrop-blur-xl",
                card.gradient,
                "hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10",
                "transition-all duration-500 animate-slide-up",
                "hover:-translate-y-2"
              )}
            >
              {/* Icon */}
              <div
                className={cn(
                  "w-16 h-16 rounded-2xl mb-6 flex items-center justify-center",
                  "bg-card/60 backdrop-blur-sm",
                  "group-hover:scale-110 transition-transform duration-300"
                )}
              >
                <card.icon className={cn("h-8 w-8", card.iconColor)} />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {card.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {card.description}
              </p>

              {/* Hover indicator */}
              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary text-lg">→</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
