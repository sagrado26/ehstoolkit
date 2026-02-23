import { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, PenLine, FileText, User, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSimulatedUsers, type SimulatedUser } from "@/hooks/use-simulated-users";
import { NameAvatar } from "@/components/ui/name-avatar";

interface Permit {
  id: number;
  workType: string;
  location: string;
  date: string;
  status: string;
  submitter: string;
}

interface Props {
  leadName: string;
  approverName: string;
  engineers: string[];
  comments: string;
  linkedPermitId?: number;
  permits?: Permit[];
  currentUser?: string;
  onChange: (field: string, value: any) => void;
}

// ── People Picker ──────────────────────────────────────────────────────────
function PeoplePicker({
  label,
  required,
  value,
  onChange,
  users,
  placeholder,
  currentUser,
  filterRoles,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  users: SimulatedUser[];
  placeholder?: string;
  currentUser?: string;
  filterRoles?: SimulatedUser["role"][];
}) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayUsers = filterRoles
    ? users.filter(u => filterRoles.includes(u.role))
    : users;

  const filtered = value
    ? displayUsers.filter(u => u.name.toLowerCase().includes(value.toLowerCase()))
    : displayUsers;

  const showDropdown = open && filtered.length > 0;

  const selectUser = (name: string) => {
    onChange(name);
    setOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
        {currentUser && (
          <button
            type="button"
            onClick={() => onChange(currentUser)}
            className={cn(
              "flex items-center gap-1 text-[11px] transition-colors",
              value === currentUser
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-primary"
            )}
          >
            {value === currentUser
              ? <><Check className="h-3 w-3" /> Using me</>
              : <><User className="h-3 w-3" /> Use me ({currentUser})</>
            }
          </button>
        )}
      </div>

      <div className="relative">
        <Input
          ref={inputRef}
          value={value}
          onChange={e => { onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={placeholder}
          className="pr-8"
        />
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50 pointer-events-none" />

        {showDropdown && (
          <div className="absolute z-50 w-full mt-1 rounded-md border border-border bg-popover shadow-md overflow-hidden">
            <div className="max-h-48 overflow-y-auto">
              {filtered.map(u => (
                <button
                  key={u.id}
                  type="button"
                  onMouseDown={() => selectUser(u.name)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left hover:bg-muted transition-colors",
                    value === u.name && "bg-primary/5"
                  )}
                >
                  <NameAvatar name={u.name} className="h-5 w-5 text-[9px]" />
                  <span className="flex-1 font-medium">{u.name}</span>
                  <span className="text-[10px] text-muted-foreground">{u.role}</span>
                  {value === u.name && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                </button>
              ))}
            </div>
            {value && !displayUsers.some(u => u.name.toLowerCase() === value.toLowerCase()) && (
              <button
                type="button"
                onMouseDown={() => selectUser(value)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left border-t border-border hover:bg-muted transition-colors text-muted-foreground"
              >
                <Plus className="h-3.5 w-3.5" />
                Use &ldquo;{value}&rdquo; as free text
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export function SignOffStep({
  leadName,
  approverName,
  engineers,
  comments,
  linkedPermitId,
  permits = [],
  currentUser,
  onChange,
}: Props) {
  const [memberInput, setMemberInput] = useState("");
  const { users } = useSimulatedUsers();

  const addMember = () => {
    const trimmed = memberInput.trim();
    if (!trimmed || engineers.includes(trimmed)) return;
    onChange("engineers", [...engineers, trimmed]);
    setMemberInput("");
  };

  const handleMemberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addMember();
    }
  };

  const addMemberFromUser = (name: string) => {
    if (!engineers.includes(name)) {
      onChange("engineers", [...engineers, name]);
    }
  };

  const submittedPermits = permits.filter(p => p.status === "approved" || p.status === "pending");
  const linkedPermit = permits.find(p => p.id === linkedPermitId);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md bg-primary/10">
          <PenLine className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold">Sign Off</h2>
          <p className="text-sm text-muted-foreground">Names and final comment</p>
        </div>
      </div>

      {/* Lead + Manager side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PeoplePicker
          label="Lead Name"
          required
          value={leadName}
          onChange={v => onChange("leadName", v)}
          users={users}
          filterRoles={["Lead", "Manager"]}
          placeholder="Search or type lead name"
          currentUser={currentUser}
        />
        <PeoplePicker
          label="Manager / Approver"
          value={approverName}
          onChange={v => onChange("approverName", v)}
          users={users}
          filterRoles={["Manager"]}
          placeholder="Search or type manager name"
        />
      </div>

      {/* Team Members */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Team Members</Label>

        {/* Quick-add from directory */}
        {users.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {users
              .filter(u => !engineers.includes(u.name) && u.name !== leadName && u.name !== approverName)
              .map(u => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => addMemberFromUser(u.name)}
                  className="flex items-center gap-1 px-2 py-1 rounded-md border border-dashed border-border text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <Plus className="h-3 w-3" /> {u.name}
                </button>
              ))}
          </div>
        )}

        {/* Free-text add */}
        <div className="flex gap-2">
          <Input
            value={memberInput}
            onChange={e => setMemberInput(e.target.value)}
            onKeyDown={handleMemberKeyDown}
            placeholder="Type a name then press Enter or click +"
            className="text-sm"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={addMember}
            disabled={!memberInput.trim()}
            className="shrink-0"
            title="Add member"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Member chips */}
        {engineers.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {engineers.map(name => (
              <span
                key={name}
                className="inline-flex items-center gap-1.5 pl-1 pr-1.5 py-1 rounded-full bg-muted border border-border text-sm"
              >
                <NameAvatar name={name} className="h-5 w-5 text-[9px]" />
                <span className="text-foreground/80">{name}</span>
                <button
                  type="button"
                  onClick={() => onChange("engineers", engineers.filter(e => e !== name))}
                  className="text-muted-foreground hover:text-destructive transition-colors ml-0.5"
                  title={`Remove ${name}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Manager approval notice */}
      {!approverName.trim() && (
        <div className="flex items-start gap-2 rounded-md border border-amber-500/20 bg-amber-500/5 px-3 py-2.5">
          <span className="text-amber-500 text-xs mt-0.5">⚠</span>
          <p className="text-xs text-amber-700 dark:text-amber-400">
            No manager named — the plan will remain <strong>pending</strong> until an approver reviews it. Adding a manager name is recommended.
          </p>
        </div>
      )}

      {/* Comment */}
      <div>
        <Label className="text-sm font-medium">Comment</Label>
        <Textarea
          rows={3}
          value={comments}
          onChange={e => onChange("comments", e.target.value)}
          placeholder="Any additional notes or safety reminders for the team..."
          className="mt-1.5 resize-none text-sm"
        />
      </div>

      {/* Permit link */}
      {submittedPermits.length > 0 && (
        <div className="pt-3 border-t border-border">
          <Label className="text-xs text-muted-foreground font-medium">
            <span className="flex items-center gap-1.5">
              <FileText className="h-3 w-3" />
              Link Permit to Work (optional)
            </span>
          </Label>
          <Select
            value={linkedPermitId ? String(linkedPermitId) : "none"}
            onValueChange={v => onChange("linkedPermitId", v === "none" ? undefined : Number(v))}
          >
            <SelectTrigger className="mt-1.5 h-9 text-sm">
              <SelectValue placeholder="No linked permit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No linked permit</SelectItem>
              {submittedPermits.map(p => (
                <SelectItem key={p.id} value={String(p.id)}>
                  PTW-{String(p.id).padStart(4, "0")} — {p.workType} ({p.location})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {linkedPermit && (
            <p className="text-[11px] text-muted-foreground mt-1.5">
              {linkedPermit.location} &middot; {linkedPermit.date} &middot; {linkedPermit.submitter}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
