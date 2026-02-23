import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { DocumentFormData } from "../types";

const schema = z.object({
  title: z.string().min(1, "Required"),
  category: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  sharepointUrl: z.string().url("Must be a valid URL"),
});

interface Props {
  onSubmit: (data: DocumentFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function DocumentForm({ onSubmit, onCancel, isLoading }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<DocumentFormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", category: "", description: "", sharepointUrl: "" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      <div className="space-y-1">
        <Label>Title</Label>
        <Input {...register("title")} placeholder="e.g. EHS Risk Assessment Template" />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-1">
        <Label>Category</Label>
        <Input {...register("category")} placeholder="e.g. Templates, Procedures, Policies" />
        {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
      </div>

      <div className="space-y-1">
        <Label>Description</Label>
        <Textarea {...register("description")} placeholder="Brief description of the document..." rows={3} />
        {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
      </div>

      <div className="space-y-1">
        <Label>SharePoint URL</Label>
        <Input {...register("sharepointUrl")} placeholder="https://..." />
        {errors.sharepointUrl && <p className="text-xs text-destructive">{errors.sharepointUrl.message}</p>}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : "Add Document"}</Button>
      </div>
    </form>
  );
}
