import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { CraneInspectionList } from "@/features/crane-inspection/components/CraneInspectionList";
import { CraneInspectionForm } from "@/features/crane-inspection/components/CraneInspectionForm";
import { useToast } from "@/hooks/use-toast";

export default function CraneInspectionPage() {
  const [showForm, setShowForm] = useState(false);
  const qc = useQueryClient();
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/crane-inspections", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/crane-inspections"] });
      setShowForm(false);
      toast({ title: "Inspection saved." });
    },
  });

  return (
    <div className="p-4 sm:p-6">
      {showForm ? (
        <div>
          <h2 className="text-xl font-bold mb-4">New Crane Inspection</h2>
          <CraneInspectionForm
            onSubmit={data => createMutation.mutate(data)}
            onCancel={() => setShowForm(false)}
            isLoading={createMutation.isPending}
          />
        </div>
      ) : (
        <CraneInspectionList onNew={() => setShowForm(true)} />
      )}
    </div>
  );
}
