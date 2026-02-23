import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { IncidentList } from "@/features/incidents/components/IncidentList";
import { IncidentForm } from "@/features/incidents/components/IncidentForm";
import { useToast } from "@/hooks/use-toast";

export default function IncidentsPage() {
  const [showForm, setShowForm] = useState(false);
  const qc = useQueryClient();
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/incidents", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/incidents"] });
      setShowForm(false);
      toast({ title: "Incident reported." });
    },
  });

  return (
    <div className="p-4 sm:p-6">
      {showForm ? (
        <div>
          <h2 className="text-xl font-bold mb-4">Report Incident</h2>
          <IncidentForm
            onSubmit={data => createMutation.mutate(data)}
            onCancel={() => setShowForm(false)}
            isLoading={createMutation.isPending}
          />
        </div>
      ) : (
        <IncidentList onNew={() => setShowForm(true)} />
      )}
    </div>
  );
}
