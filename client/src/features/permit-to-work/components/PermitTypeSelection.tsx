import { motion } from "framer-motion";
import { Box, AlertTriangle, FlaskConical, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type PermitTypeId = "confined-space" | "hazardous-space" | "hazardous-chemicals";

interface PermitTypeOption {
  id: PermitTypeId;
  title: string;
  description: string;
  icon: typeof Box;
  color: string;
  bgColor: string;
  borderColor: string;
  features: string[];
}

const PERMIT_TYPES: PermitTypeOption[] = [
  {
    id: "confined-space",
    title: "Confined Space",
    description: "Permit for enclosed areas with limited entry/exit points requiring atmospheric monitoring",
    icon: Box,
    color: "text-brand",
    bgColor: "bg-brand/5",
    borderColor: "border-brand/20 hover:border-brand/50",
    features: [
      "Space Identification & Personnel Roles",
      "Physical & Atmospheric Hazard Assessment",
      "Tools & Equipment Checklist",
      "Emergency Extraction Plan",
      "Gas Measurement Monitoring",
      "Dual EHS + Manager Sign-off with Signature",
    ],
  },
  {
    id: "hazardous-space",
    title: "Hazardous Space",
    description: "Permit for areas with hazardous atmosphere or conditions requiring respiratory protection",
    icon: AlertTriangle,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200 hover:border-amber-400",
    features: ["Hazard Assessment", "Respiratory Protection", "Isolation Methods", "Atmospheric Testing"],
  },
  {
    id: "hazardous-chemicals",
    title: "Hazardous Chemicals",
    description: "Permit for work involving chemical substances, spill response and containment",
    icon: FlaskConical,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200 hover:border-red-400",
    features: ["Chemical Inventory", "SDS Documents", "PPE Requirements", "Containment Plan"],
  },
];

interface Props {
  onSelect: (type: PermitTypeId) => void;
  onCancel: () => void;
}

export function PermitTypeSelection({ onSelect, onCancel }: Props) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-display font-bold text-brand mb-2">Select Permit Type</h1>
        <p className="text-sm text-muted-foreground">
          Choose the type of permit required for this work activity. Each type includes specific safety requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PERMIT_TYPES.map((type, idx) => {
          const Icon = type.icon;
          return (
            <motion.button
              key={type.id}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => onSelect(type.id)}
              className={cn(
                "group relative text-left p-6 rounded-xl border-2 transition-all duration-200",
                "hover:shadow-lg hover:-translate-y-0.5",
                type.borderColor,
                type.bgColor,
              )}
            >
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", type.bgColor)}>
                <Icon className={cn("h-6 w-6", type.color)} />
              </div>
              <h3 className="text-lg font-display font-semibold mb-2">{type.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{type.description}</p>
              <ul className="space-y-1.5 mb-5">
                {type.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", type.color.replace("text-", "bg-"))} />
                    {f}
                  </li>
                ))}
              </ul>
              <div className={cn("flex items-center gap-1.5 text-sm font-medium", type.color)}>
                <span>Start Permit</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="text-center mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancel and return to permit list
        </button>
      </div>
    </div>
  );
}
