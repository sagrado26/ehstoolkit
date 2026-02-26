import * as React from "react";
import { X, Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export interface MultiSelectOption {
  value: string;
  label: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

interface MultiSelectComboProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
  disabled?: boolean;
  /** Render custom content inside each selected tag */
  renderTag?: (option: MultiSelectOption) => React.ReactNode;
}

export function MultiSelectCombo({
  options,
  selected,
  onChange,
  placeholder = "Select items…",
  searchPlaceholder = "Search…",
  emptyText = "No results found.",
  className,
  disabled,
  renderTag,
}: MultiSelectComboProps) {
  const [open, setOpen] = React.useState(false);

  const selectedSet = React.useMemo(() => new Set(selected), [selected]);

  const toggleOption = (value: string) => {
    if (selectedSet.has(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const removeOption = (value: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    onChange(selected.filter((v) => v !== value));
  };

  const clearAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange([]);
  };

  const selectedOptions = React.useMemo(
    () => selected.map((v) => options.find((o) => o.value === v)).filter(Boolean) as MultiSelectOption[],
    [selected, options]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "flex min-h-[36px] w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm ring-offset-background",
            "hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
        >
          <div className="flex flex-1 flex-wrap items-center gap-1.5 overflow-hidden">
            {selectedOptions.length === 0 ? (
              <span className="text-muted-foreground text-sm">{placeholder}</span>
            ) : (
              selectedOptions.map((opt) => (
                <span
                  key={opt.value}
                  className="inline-flex items-center gap-1 rounded-md border border-border bg-muted px-2 py-0.5 text-xs font-medium text-foreground shrink-0"
                >
                  {renderTag ? renderTag(opt) : opt.label}
                  <button
                    type="button"
                    className="ml-0.5 rounded-full outline-none ring-offset-background text-muted-foreground hover:text-destructive focus:ring-2 focus:ring-ring focus:ring-offset-1"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => removeOption(opt.value, e)}
                    aria-label={`Remove ${opt.label}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1 pl-2">
            {selected.length > 0 && (
              <button
                type="button"
                className="rounded-full p-0.5 text-muted-foreground hover:text-foreground transition-colors"
                onMouseDown={(e) => e.preventDefault()}
                onClick={clearAll}
                aria-label="Clear all"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground/60" />
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
        sideOffset={4}
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedSet.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => toggleOption(option.value)}
                    className="gap-2.5 py-2"
                  >
                    <div
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-colors",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30 bg-background"
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </div>
                    <div className="flex flex-1 items-center gap-2 overflow-hidden">
                      {option.icon}
                      <div className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{option.label}</span>
                        {option.subtitle && (
                          <span className="block truncate text-[10px] text-muted-foreground">{option.subtitle}</span>
                        )}
                      </div>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
