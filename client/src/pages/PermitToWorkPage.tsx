import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { PermitList } from "@/features/permit-to-work/components/PermitList";
import { PermitForm } from "@/features/permit-to-work/components/PermitForm";
import { useToast } from "@/hooks/use-toast";

export default function PermitToWorkPage() {
  const [showForm, setShowForm] = useState(false);
  const qc = useQueryClient();
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/permits", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/permits"] });
      setShowForm(false);
      toast({ title: "Permit created." });
    },
  });

  if (showForm) {
    return (
      <div className="p-4 sm:p-6 h-full max-w-5xl">
        <PermitForm
          onSubmit={data => createMutation.mutate(data)}
          onCancel={() => setShowForm(false)}
          isLoading={createMutation.isPending}
        />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <PermitList onNew={() => setShowForm(true)} />
    </div>
  );
}
