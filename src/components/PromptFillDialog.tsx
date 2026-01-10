import { useState, useEffect, useMemo } from "react";
import { ArrowRight, ArrowLeft, Check, Copy, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PlaceholderField {
  placeholder: string;
  label: string;
  options?: string[];
}

interface PromptFillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promptTitle: string;
  promptContent: string;
}

// Extract placeholders from prompt content
const extractPlaceholders = (content: string): PlaceholderField[] => {
  const regex = /\[([^\]]+)\]/g;
  const matches: PlaceholderField[] = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    const placeholder = match[0];
    const label = match[1];
    
    // Generate contextual options based on the placeholder type
    const options = getOptionsForPlaceholder(label.toLowerCase());
    
    matches.push({ placeholder, label, options });
  }

  return matches;
};

// Generate predefined options based on placeholder context
const getOptionsForPlaceholder = (label: string): string[] | undefined => {
  const optionsMap: Record<string, string[]> = {
    "topic": ["AI & Technology", "Health & Wellness", "Personal Finance", "Productivity Tips", "Travel Adventures"],
    "genre": ["Fantasy", "Sci-Fi", "Mystery", "Romance", "Horror", "Thriller"],
    "recipient": ["Client", "Manager", "Team Member", "Partner", "Customer Support"],
    "subject": ["Project Update", "Meeting Request", "Follow-up", "Proposal", "Inquiry"],
    "product": ["Smartphone", "Headphones", "Watch", "Laptop", "Camera"],
    "number": ["3", "5", "7", "10"],
    "error message": [],
    "code": [],
    "paste code here": [],
    "paste text": [],
  };

  // Find matching key
  for (const key in optionsMap) {
    if (label.includes(key)) {
      return optionsMap[key].length > 0 ? optionsMap[key] : undefined;
    }
  }

  return undefined;
};

export const PromptFillDialog = ({
  open,
  onOpenChange,
  promptTitle,
  promptContent,
}: PromptFillDialogProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [customInput, setCustomInput] = useState("");
  const [copied, setCopied] = useState(false);

  // Memoize placeholders extraction to prevent regex loop on every render
  const placeholders = useMemo(() => extractPlaceholders(promptContent), [promptContent]);
  const totalSteps = placeholders.length;
  const currentPlaceholder = placeholders[currentStep];
  const isLastStep = currentStep === totalSteps - 1;
  const isComplete = currentStep >= totalSteps;

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setCurrentStep(0);
      setAnswers({});
      setCustomInput("");
      setCopied(false);
    }
  }, [open]);

  // Generate the final prompt with filled values
  const generateFinalPrompt = () => {
    let result = promptContent;
    for (const [placeholder, value] of Object.entries(answers)) {
      result = result.replace(placeholder, value);
    }
    return result;
  };

  const handleSelectOption = (option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentPlaceholder.placeholder]: option,
    }));
    
    if (isLastStep) {
      setCurrentStep(totalSteps);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
    setCustomInput("");
  };

  const handleCustomSubmit = () => {
    if (!customInput.trim()) return;
    
    setAnswers((prev) => ({
      ...prev,
      [currentPlaceholder.placeholder]: customInput.trim(),
    }));
    
    if (isLastStep) {
      setCurrentStep(totalSteps);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
    setCustomInput("");
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setCustomInput("");
    }
  };

  const handleCopyFinal = async () => {
    const finalPrompt = generateFinalPrompt();
    await navigator.clipboard.writeText(finalPrompt);
    setCopied(true);
    toast.success("Complete prompt copied to clipboard!", {
      duration: 2000,
      className: "bg-card/90 backdrop-blur-sm border-border",
    });
    setTimeout(() => {
      setCopied(false);
      onOpenChange(false);
    }, 1500);
  };

  // If no placeholders, don't show the dialog
  if (placeholders.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Sparkles className="h-5 w-5 text-primary" />
            {promptTitle}
          </DialogTitle>
        </DialogHeader>

        {/* Progress bar */}
        <div className="flex gap-1.5 mb-4">
          {placeholders.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors duration-300",
                index < currentStep
                  ? "bg-primary"
                  : index === currentStep
                  ? "bg-primary/60"
                  : "bg-muted/50"
              )}
            />
          ))}
        </div>

        {!isComplete ? (
          <div className="space-y-6 animate-fade-in">
            {/* Step indicator */}
            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {totalSteps}
            </div>

            {/* Question */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-1">
                Enter: {currentPlaceholder.label}
              </h3>
              <p className="text-sm text-muted-foreground">
                Choose from options below or write your own
              </p>
            </div>

            {/* Options */}
            {currentPlaceholder.options && currentPlaceholder.options.length > 0 && (
              <div className="space-y-2">
                {currentPlaceholder.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSelectOption(option)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-xl",
                      "bg-secondary/40 hover:bg-secondary/60",
                      "border border-border/30 hover:border-primary/40",
                      "text-foreground transition-all duration-200",
                      "hover:shadow-md hover:shadow-primary/5"
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {/* Custom input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Or type your own:
              </label>
              <div className="flex gap-2">
                <Input
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder={`Enter ${currentPlaceholder.label.toLowerCase()}...`}
                  className="flex-1 bg-secondary/30 border-border/30 focus:border-primary/50"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCustomSubmit();
                    }
                  }}
                />
                <Button
                  onClick={handleCustomSubmit}
                  disabled={!customInput.trim()}
                  size="icon"
                  className="shrink-0"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Navigation */}
            {currentStep > 0 && (
              <Button
                variant="ghost"
                onClick={handleBack}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
          </div>
        ) : (
          /* Complete state */
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-2 text-accent-foreground">
              <Check className="h-5 w-5" />
              <span className="font-medium">Prompt Complete!</span>
            </div>

            {/* Preview */}
            <div className="bg-secondary/30 border border-border/30 rounded-xl p-4 max-h-48 overflow-y-auto">
              <pre className="text-sm text-foreground whitespace-pre-wrap font-sans">
                {generateFinalPrompt()}
              </pre>
            </div>

            {/* Copy button */}
            <Button
              onClick={handleCopyFinal}
              className="w-full"
              disabled={copied}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy to Clipboard
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
