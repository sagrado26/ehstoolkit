import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { PermitList } from "@/features/permit-to-work/components/PermitList";
import { PermitForm } from "@/features/permit-to-work/components/PermitForm";
import { PermitTypeSelection, type PermitTypeId } from "@/features/permit-to-work/components/PermitTypeSelection";
import { PermitDetail } from "@/features/permit-to-work/components/PermitDetail";
import { useToast } from "@/hooks/use-toast";

type View = "list" | "type-select" | "form" | "detail";

export default function PermitToWorkPage() {
  const [view, setView] = useState<View>("list");
  const [selectedPermitType, setSelectedPermitType] = useState<PermitTypeId | undefined>();
  const [selectedPermitId, setSelectedPermitId] = useState<number | null>(null);
  const qc = useQueryClient();
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/permits", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/permits"] });
      setView("list");
      toast({ title: "Permit created successfully." });
    },
  });

  const handleNewPermit = () => {
    setSelectedPermitType(undefined);
    setView("type-select");
  };

  const handleTypeSelected = (type: PermitTypeId) => {
    setSelectedPermitType(type);
    setView("form");
  };

  const handleViewPermit = (id: number) => {
    setSelectedPermitId(id);
    setView("detail");
  };

  const handleBackToList = () => {
    setView("list");
    setSelectedPermitId(null);
    setSelectedPermitType(undefined);
  };

  if (view === "type-select") {
    return (
      <div className="py-4">
        <PermitTypeSelection onSelect={handleTypeSelected} onCancel={handleBackToList} />
      </div>
    );
  }

  if (view === "form") {
    return (
      <div className="h-full max-w-5xl">
        <PermitForm
          permitType={selectedPermitType}
          onSubmit={data => createMutation.mutate(data)}
          onCancel={handleBackToList}
          isLoading={createMutation.isPending}
        />
      </div>
    );
  }

  if (view === "detail" && selectedPermitId !== null) {
    return (
      <div className="py-2">
        <PermitDetail permitId={selectedPermitId} onBack={handleBackToList} />
      </div>
    );
  }

  return (
    <div>
      <PermitList onNew={handleNewPermit} onView={handleViewPermit} />
    </div>
  );
}
