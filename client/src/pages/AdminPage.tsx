import { useState } from "react";
import { cn } from "@/lib/utils";
import { UserCog, Upload, FileSpreadsheet, Users, Plus, Trash2, RotateCcw, Settings, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSimulatedUsers, type SimulatedUser } from "@/hooks/use-simulated-users";
import { NameAvatar } from "@/components/ui/name-avatar";

const ROLES = ["Lead", "Manager", "Engineer"] as const;

const roleColors: Record<SimulatedUser["role"], string> = {
  Manager: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  Lead: "bg-primary/10 text-primary border-primary/20",
  Engineer: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

function AddUserForm({ onAdd }: { onAdd: (u: Omit<SimulatedUser, "id">) => void }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState<SimulatedUser["role"]>("Engineer");
  const [email, setEmail] = useState("");

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd({ name: name.trim(), role, email: email.trim() || undefined });
    setName("");
    setEmail("");
  };

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Add User</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <Label className="text-xs text-muted-foreground">Full Name *</Label>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAdd()}
            placeholder="e.g. John Smith"
            className="mt-1 h-8 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Role</Label>
          <div className="flex gap-1 mt-1">
            {ROLES.map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={cn(
                  "flex-1 h-8 rounded text-xs font-medium border transition-colors",
                  role === r
                    ? roleColors[r]
                    : "border-border text-muted-foreground hover:text-foreground"
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Email (optional)</Label>
          <Input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="user@company.com"
            className="mt-1 h-8 text-sm"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button size="sm" onClick={handleAdd} disabled={!name.trim()} className="gap-1.5 h-8">
          <Plus className="h-3.5 w-3.5" /> Add User
        </Button>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { users, addUser, removeUser, resetToDefaults } = useSimulatedUsers();
  const [activeCurrentUser, setActiveCurrentUser] = useState(() => {
    try { return localStorage.getItem("planflow_current_user") || ""; } catch { return ""; }
  });

  const handleSetCurrentUser = (name: string) => {
    try { localStorage.setItem("planflow_current_user", name); } catch {}
    setActiveCurrentUser(name);
  };

  const handleClearCurrentUser = () => {
    try { localStorage.removeItem("planflow_current_user"); } catch {}
    setActiveCurrentUser("");
  };

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div>
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <p className="text-sm text-muted-foreground">Manage user directory and system configuration</p>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="mb-4">
          <TabsTrigger value="users" className="gap-1.5">
            <Users className="h-3.5 w-3.5" /> Users
          </TabsTrigger>
          <TabsTrigger value="import" className="gap-1.5">
            <FileSpreadsheet className="h-3.5 w-3.5" /> Import
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-1.5">
            <Settings className="h-3.5 w-3.5" /> System
          </TabsTrigger>
        </TabsList>

        {/* ── Users Tab ── */}
        <TabsContent value="users" className="space-y-4 mt-0">
          {/* Active session banner */}
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-1.5 rounded-md bg-primary/10">
                <UserCheck className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Active Session User</p>
                <p className="text-xs text-muted-foreground">
                  Shown as "Use me" shortcut in the Sign Off form. Click "Set as Me" on any user below to switch.
                </p>
              </div>
            </div>
            {activeCurrentUser ? (
              <div className="flex items-center gap-2">
                <NameAvatar name={activeCurrentUser} />
                <span className="text-sm font-medium">{activeCurrentUser}</span>
                <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20 ml-1">
                  Active
                </Badge>
                <button
                  type="button"
                  onClick={handleClearCurrentUser}
                  className="ml-auto text-xs text-muted-foreground hover:text-destructive transition-colors"
                >
                  Clear
                </button>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                No active user — click "Set as Me" on any user below to simulate being logged in as them.
              </p>
            )}
          </div>

          {/* Add new user */}
          <AddUserForm onAdd={addUser} />

          {/* User directory table */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Directory · {users.length} user{users.length !== 1 ? "s" : ""}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetToDefaults}
                className="gap-1 h-7 text-xs text-muted-foreground"
              >
                <RotateCcw className="h-3 w-3" /> Reset defaults
              </Button>
            </div>

            {users.length === 0 ? (
              <div className="py-10 text-center">
                <UserCog className="h-7 w-7 text-muted-foreground/20 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No users yet. Add one above.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Role</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Email</th>
                      <th className="px-4 py-2.5" />
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => {
                      const isActive = u.name === activeCurrentUser;
                      return (
                        <tr
                          key={u.id}
                          className={cn(
                            "border-b border-border last:border-0 transition-colors",
                            isActive ? "bg-primary/5" : "hover:bg-muted/20"
                          )}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <NameAvatar name={u.name} />
                              <span className="font-medium">{u.name}</span>
                              {isActive && (
                                <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                                  Me
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className={cn("text-[10px]", roleColors[u.role])}>
                              {u.role}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">
                            {u.email || "—"}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3 justify-end">
                              {!isActive ? (
                                <button
                                  type="button"
                                  onClick={() => handleSetCurrentUser(u.name)}
                                  className="text-[11px] text-primary hover:underline whitespace-nowrap"
                                >
                                  Set as Me
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={handleClearCurrentUser}
                                  className="text-[11px] text-muted-foreground hover:text-foreground whitespace-nowrap"
                                >
                                  Unset
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => removeUser(u.id)}
                                className="text-muted-foreground/40 hover:text-destructive transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ── Import Tab ── */}
        <TabsContent value="import" className="mt-0">
          <div className="rounded-lg border border-border bg-card">
            <div className="flex items-center gap-3 p-4 border-b border-border">
              <div className="p-2 rounded-md bg-primary/10">
                <FileSpreadsheet className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Excel Import</h2>
                <p className="text-xs text-muted-foreground">Upload an Excel file to bulk-import users into the directory</p>
              </div>
            </div>
            <div className="p-4">
              <div className="rounded-lg border-2 border-dashed border-border py-10 text-center">
                <Upload className="h-6 w-6 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Drop an Excel file here or click to upload</p>
                <p className="text-[11px] text-muted-foreground/60 mt-1">Supported: .xlsx, .xls, .csv</p>
                <Button variant="outline" size="sm" className="mt-3" disabled>
                  <Upload className="h-3.5 w-3.5 mr-1.5" /> Upload File
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── System Tab ── */}
        <TabsContent value="system" className="mt-0">
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <Settings className="h-8 w-8 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-sm font-medium text-muted-foreground">System configuration</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Coming soon — site settings, approval rules, notification config.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
