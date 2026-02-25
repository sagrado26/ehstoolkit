import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NameAvatar } from "@/components/ui/name-avatar";
import { cn } from "@/lib/utils";
import { getRiskColor } from "@/features/safety-plan/risk-utils";
import { AlertTriangle, Plus, X } from "lucide-react";
import { useState } from "react";
import type { Assessment } from "@shared/schema";

interface Props {
  allHazards: string[];
  assessments: Record<string, Assessment>;
  escalatedHazards: string[];
  teamMembers: string[];
  onTeamMembersChange: (members: string[]) => void;
}

export function SRBOriginalHazardsStep({ allHazards, assessments, escalatedHazards, teamMembers, onTeamMembersChange }: Props) {
  const [newMember, setNewMember] = useState("");

  const addMember = () => {
    const name = newMember.trim();
    if (name && !teamMembers.includes(name)) {
      onTeamMembersChange([...teamMembers, name]);
      setNewMember("");
    }
  };

  const removeMember = (name: string) => {
    onTeamMembersChange(teamMembers.filter(m => m !== name));
  };

  return (
    <div className="space-y-6">
      {/* Warning callout */}
      <div className="rounded-lg bg-red-50 border border-red-200 p-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-red-800">All risks must be reduced to LOW before activity can start.</p>
          <p className="text-xs text-red-600/70 mt-1">The following hazards were identified in the original safety plan. Escalated items (score 8+) require SRB reassessment.</p>
        </div>
      </div>

      {/* Original hazard list */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Original Hazard Assessments</h3>
        <div className="space-y-2">
          {allHazards.map((name) => {
            const a = assessments[name];
            if (!a) return null;
            const score = a.severity * a.likelihood;
            const risk = getRiskColor(score);
            const isEscalated = escalatedHazards.includes(name);

            return (
              <div key={name} className={cn(
                "flex items-center gap-3 p-3 rounded-lg border",
                isEscalated ? "border-red-200 bg-red-50/50" : "border-border bg-card"
              )}>
                <span className={cn("h-8 w-8 rounded-md flex items-center justify-center text-xs font-bold shrink-0", risk.bg, risk.text)}>
                  {score}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{name}</p>
                  <p className="text-xs text-muted-foreground truncate">{a.mitigation || "No mitigation specified"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={cn("text-[10px]", risk.border)}>{risk.label}</Badge>
                  {isEscalated && (
                    <Badge className="bg-red-600 text-white text-[10px]">Escalated to SRB</Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Risk matrix legend */}
      <div className="grid grid-cols-4 gap-2 text-center">
        {[
          { label: "Low", range: "1-3", bg: "bg-emerald-500", text: "text-white" },
          { label: "Medium", range: "4-7", bg: "bg-amber-400", text: "text-amber-900" },
          { label: "High", range: "8-11", bg: "bg-orange-500", text: "text-white" },
          { label: "Extreme", range: "12-16", bg: "bg-red-500", text: "text-white" },
        ].map((band) => (
          <div key={band.label} className={cn("py-1.5 rounded-md text-[10px] font-bold", band.bg, band.text)}>
            {band.label} ({band.range})
          </div>
        ))}
      </div>

      {/* Team members */}
      <div>
        <h3 className="text-sm font-semibold mb-1">SRB Team Members</h3>
        <p className="text-xs text-muted-foreground mb-3">All identified team members must be represented before proceeding.</p>

        <div className="flex flex-wrap gap-2 mb-3">
          {teamMembers.map((name) => (
            <div key={name} className="flex items-center gap-2 bg-muted rounded-full pl-1 pr-2 py-1">
              <NameAvatar name={name} className="h-6 w-6 text-[10px]" />
              <span className="text-xs font-medium">{name}</span>
              <button type="button" onClick={() => removeMember(name)} className="text-muted-foreground hover:text-destructive transition-colors">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {teamMembers.length === 0 && (
            <p className="text-xs text-muted-foreground italic">No team members added yet</p>
          )}
        </div>

        <div className="flex gap-2">
          <Input
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addMember())}
            placeholder="Add team member name"
            className="h-8 text-sm"
          />
          <Button type="button" size="sm" variant="outline" onClick={addMember} disabled={!newMember.trim()}>
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
