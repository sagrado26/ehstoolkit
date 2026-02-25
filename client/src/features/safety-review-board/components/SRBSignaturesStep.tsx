import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SignatureCapture } from "@/features/permit-to-work/components/SignatureCapture";
import { CheckCircle2, Clock } from "lucide-react";
import type { SRBSignatory } from "../types";

interface Props {
  signatories: SRBSignatory[];
  onChange: (signatories: SRBSignatory[]) => void;
}

const ROLE_CONFIG: Record<string, { color: string; bgColor: string; description: string }> = {
  "EHS Specialist": { color: "text-blue-700", bgColor: "bg-blue-50", description: "EHS Specialist or Safety Engineer" },
  "Fab Team Lead": { color: "text-emerald-700", bgColor: "bg-emerald-50", description: "Individual Leading Action / Fab Team Lead" },
  "CS Management": { color: "text-violet-700", bgColor: "bg-violet-50", description: "CS Management Representative" },
};

function formatTimestamp(): string {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const yy = String(now.getFullYear()).slice(-2);
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  return `${mm}/${dd}/${yy} ${hh}:${min}`;
}

export function SRBSignaturesStep({ signatories, onChange }: Props) {
  const updateSignatory = (index: number, updates: Partial<SRBSignatory>) => {
    const next = [...signatories];
    next[index] = { ...next[index], ...updates };
    onChange(next);
  };

  const allSigned = signatories.every(s => s.name.trim() !== "" && s.signatureData !== null);

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-violet-50 border border-violet-200 p-4">
        <p className="text-sm font-semibold text-violet-800">Mandatory Sign-Off</p>
        <p className="text-xs text-violet-700/70 mt-1">Three signatures are required. Each must include name, digital signature, and timestamp. No SRB is valid without all three.</p>
      </div>

      {signatories.map((sig, i) => {
        const config = ROLE_CONFIG[sig.role] || ROLE_CONFIG["EHS Specialist"];
        const isSigned = sig.name.trim() !== "" && sig.signatureData !== null;

        return (
          <Card key={sig.role} className="overflow-hidden">
            <div className={cn("flex items-center justify-between p-4 border-b", config.bgColor)}>
              <div>
                <p className={cn("text-sm font-bold", config.color)}>{sig.role}</p>
                <p className="text-xs text-muted-foreground">{config.description}</p>
              </div>
              {isSigned ? (
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Signed
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1">
                  <Clock className="h-3 w-3" /> Awaiting
                </Badge>
              )}
            </div>

            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium">Full Name <span className="text-destructive">*</span></Label>
                <Input
                  value={sig.name}
                  onChange={(e) => updateSignatory(i, { name: e.target.value })}
                  placeholder="Enter full name"
                  className="h-8 text-sm"
                />
              </div>

              <SignatureCapture
                label="Digital Signature"
                onCapture={(sigData) => {
                  updateSignatory(i, {
                    signatureData: sigData,
                    signedAt: formatTimestamp(),
                  });
                }}
              />

              {sig.signedAt && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Signed at: <span className="font-mono font-medium text-foreground">{sig.signedAt}</span></span>
                </div>
              )}
            </div>
          </Card>
        );
      })}

      {allSigned && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-center">
          <p className="text-xs font-semibold text-emerald-700">All three signatures captured. Proceed to review ISO documentation.</p>
        </div>
      )}
    </div>
  );
}
