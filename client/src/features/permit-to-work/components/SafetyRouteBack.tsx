import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Route, MapPin, Phone, Hospital, ArrowRight } from "lucide-react";

interface Props {
  primaryRoute: string | null;
  secondaryRoute: string | null;
  assemblyPoint: string | null;
  emergencyContact: string | null;
}

export function SafetyRouteBack({ primaryRoute, secondaryRoute, assemblyPoint, emergencyContact }: Props) {
  const hasData = primaryRoute || secondaryRoute || assemblyPoint || emergencyContact;

  if (!hasData) {
    return (
      <Card className="p-6 text-center">
        <Route className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground">No Safety Route Back information configured</p>
        <p className="text-xs text-muted-foreground/60 mt-1">SRB details can be added when creating or editing the permit</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-3 p-4 border-b border-border bg-red-50/50">
        <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center">
          <Route className="h-4.5 w-4.5 text-red-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-red-900">Safety Route Back (SRB)</h3>
          <p className="text-xs text-red-700/60">Emergency evacuation routes and rescue information</p>
        </div>
        <Badge variant="outline" className="ml-auto bg-red-100 text-red-700 border-red-200 text-[10px] uppercase tracking-wider">
          Critical Safety
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
        {/* Primary Route */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
              <ArrowRight className="h-3.5 w-3.5 text-emerald-700" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Primary Evacuation Route</p>
          </div>
          <p className="text-sm leading-relaxed">{primaryRoute || "Not specified"}</p>
        </div>

        {/* Secondary Route */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
              <ArrowRight className="h-3.5 w-3.5 text-amber-700" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">Secondary Evacuation Route</p>
          </div>
          <p className="text-sm leading-relaxed">{secondaryRoute || "Not specified"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-border border-t border-border">
        {/* Assembly Point */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
              <MapPin className="h-3.5 w-3.5 text-blue-700" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">Assembly Point</p>
          </div>
          <p className="text-sm leading-relaxed">{assemblyPoint || "Not specified"}</p>
        </div>

        {/* Emergency Contact */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
              <Phone className="h-3.5 w-3.5 text-red-700" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-red-700">Emergency Contact</p>
          </div>
          <p className="text-sm leading-relaxed font-medium">{emergencyContact || "Not specified"}</p>
        </div>
      </div>
    </Card>
  );
}
