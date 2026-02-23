import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { DocumentGrid } from "@/features/documentation/components/DocumentGrid";
import { DocumentForm } from "@/features/documentation/components/DocumentForm";
import { useToast } from "@/hooks/use-toast";

export default function DocumentationPage() {
  const [showForm, setShowForm] = useState(false);
  const qc = useQueryClient();
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/documents", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/documents"] });
      setShowForm(false);
      toast({ title: "Document added." });
    },
  });

  return (
    <div className="p-4 sm:p-6">
      {showForm ? (
        <div>
          <h2 className="text-xl font-bold mb-4">Add Document</h2>
          <DocumentForm
            onSubmit={data => createMutation.mutate(data)}
            onCancel={() => setShowForm(false)}
            isLoading={createMutation.isPending}
          />
        </div>
      ) : (
        <DocumentGrid onNew={() => setShowForm(true)} />
      )}
    </div>
  );
}
