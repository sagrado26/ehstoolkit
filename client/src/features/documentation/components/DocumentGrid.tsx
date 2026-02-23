import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Trash2 } from "lucide-react";

interface Props { onNew: () => void; }

export function DocumentGrid({ onNew }: Props) {
  const qc = useQueryClient();
  const { data: docs = [], isLoading } = useQuery({ queryKey: ["/api/documents"] });
  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/documents/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/documents"] }),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Documentation</h1>
          <p className="text-sm text-muted-foreground">EHS reference documents on SharePoint</p>
        </div>
        <Button onClick={onNew}>+ Add Document</Button>
      </div>

      {isLoading ? <p className="text-sm text-muted-foreground">Loading...</p> :
       (docs as any[]).length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-16">No documents yet.</p>
       ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(docs as any[]).map(doc => (
            <Card key={doc.id} className="flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-sm font-semibold leading-snug">{doc.title}</CardTitle>
                  <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0"
                    onClick={() => deleteMutation.mutate(doc.id)}>
                    <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </div>
                <Badge variant="outline" className="w-fit text-xs">{doc.category}</Badge>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between gap-3">
                <p className="text-xs text-muted-foreground line-clamp-3">{doc.description}</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a href={doc.sharepointUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5 mr-1" /> Open in SharePoint
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
