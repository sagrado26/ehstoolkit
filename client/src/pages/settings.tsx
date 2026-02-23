import { useTheme } from "@/hooks/use-theme";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Moon, Sun, Palette, Settings2, ClipboardList, FileText, PanelLeft, ShieldCheck } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useState, useEffect } from "react";

const USER_ID = "default";

const colorOptions = [
  { 
    id: "blue" as const, 
    label: "Blue (ASML)", 
    color: "bg-[#1a3a7a]",
    description: "Corporate blue"
  },
  { 
    id: "green" as const, 
    label: "Green", 
    color: "bg-[#22C55E]",
    description: "Fresh and natural green"
  },
  { 
    id: "violet" as const, 
    label: "Violet (Teams)", 
    color: "bg-[#7C3AED]",
    description: "Microsoft Teams purple"
  },
  { 
    id: "darkgreen" as const, 
    label: "Dark Green", 
    color: "bg-[#166534]",
    description: "Professional dark green theme"
  },
];

const navColorOptions = [
  { id: "slate" as const, label: "Slate", color: "bg-[#2a2d32]", description: "Neutral dark gray" },
  { id: "blue" as const, label: "Blue (ASML)", color: "bg-[#1a2744]", description: "Corporate blue tint" },
  { id: "charcoal" as const, label: "Charcoal", color: "bg-[#262626]", description: "Near-black minimal" },
  { id: "green" as const, label: "Green", color: "bg-[#1a2e1f]", description: "Dark green tint" },
  { id: "violet" as const, label: "Violet", color: "bg-[#271a3a]", description: "Purple tint" },
  { id: "darkgreen" as const, label: "Forest", color: "bg-[#1a2b1e]", description: "Deep forest green" },
  { id: "transparent" as const, label: "Transparent", color: "bg-transparent border border-dashed border-muted-foreground/30", description: "No background" },
  { id: "white" as const, label: "White", color: "bg-white border border-muted-foreground/20", description: "Clean light sidebar" },
];

const systemOptions = ["EUV", "DUV", "CSCM", "Trumph", "Others"];
const groupOptions = ["Europe", "US", "ASIA", "TW", "Korea"];
const siteOptions = ["F34 Intel Ireland"];

export default function Settings() {
  const { color, navColor, mode, setColor, setNavColor, toggleMode } = useTheme();
  const queryClient = useQueryClient();
  
  const [ispSystem, setIspSystem] = useState("Others");
  const [ispGroup, setIspGroup] = useState("Europe");
  const [ispSite, setIspSite] = useState("F34 Intel Ireland");
  const [userRole, setUserRole] = useState("user");
  const [hasChanges, setHasChanges] = useState(false);

  const { data: preferences, isLoading } = useQuery<{
    isFirstTime: string;
    system: string;
    group: string;
    site: string;
    role?: string;
  }>({
    queryKey: ["/api/user-preferences", USER_ID],
  });

  useEffect(() => {
    if (preferences) {
      setIspSystem(preferences.system || "Others");
      setIspGroup(preferences.group || "Europe");
      setIspSite(preferences.site || "F34 Intel Ireland");
      setUserRole(preferences.role || "user");
    }
  }, [preferences]);

  const savePreferencesMutation = useMutation({
    mutationFn: async (prefs: { system: string; group: string; site: string; isFirstTime: string; role: string }) => {
      return apiRequest("POST", `/api/user-preferences/${USER_ID}`, prefs);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-preferences", USER_ID] });
      setHasChanges(false);
    },
  });

  const handleSavePreferences = () => {
    savePreferencesMutation.mutate({
      system: ispSystem,
      group: ispGroup,
      site: ispSite,
      isFirstTime: "false",
      role: userRole,
    });
  };

  const handleSystemChange = (value: string) => {
    setIspSystem(value);
    setHasChanges(true);
  };

  const handleGroupChange = (value: string) => {
    setIspGroup(value);
    setHasChanges(true);
  };

  const handleSiteChange = (value: string) => {
    setIspSite(value);
    setHasChanges(true);
  };

  return (
    <div className="h-screen overflow-y-auto bg-background">
      <header className="bg-background border-b border-border px-4 lg:px-8 py-4 sticky top-0 z-20">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Customize your application preferences</p>
        </div>
      </header>
      <div className="p-4 lg:p-8">

        <Tabs defaultValue="themes" className="max-w-3xl">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="themes" className="flex items-center gap-2" data-testid="tab-themes">
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Themes</span>
            </TabsTrigger>
            <TabsTrigger value="isp-details" className="flex items-center gap-2" data-testid="tab-isp-details">
              <Settings2 className="w-4 h-4" />
              <span className="hidden sm:inline">ISP Details</span>
            </TabsTrigger>
            <TabsTrigger value="ptw-details" className="flex items-center gap-2" data-testid="tab-ptw-details">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">PtW Details</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="themes" className="space-y-6">
            <Card className="p-4 lg:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-md bg-primary/10">
                  <Palette className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold">Theme Color</h2>
                  <p className="text-sm text-muted-foreground">Choose your preferred accent color</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {colorOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setColor(option.id)}
                    className={`relative p-4 rounded-md border-2 transition-all text-left hover-elevate ${
                      color === option.id 
                        ? "border-primary bg-primary/5" 
                        : "border-border bg-card"
                    }`}
                    data-testid={`button-theme-${option.id}`}
                  >
                    {color === option.id && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                    <div className={`w-8 h-8 rounded-full mb-3 ${option.color}`} />
                    <p className="font-medium text-sm">{option.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">{option.description}</p>
                  </button>
                ))}
              </div>
            </Card>

            <Card className="p-4 lg:p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-primary/10">
                    {mode === "dark" ? (
                      <Moon className="w-5 h-5 text-primary" />
                    ) : (
                      <Sun className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <Label htmlFor="dark-mode" className="font-semibold cursor-pointer">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
                  </div>
                </div>
                <Switch
                  id="dark-mode"
                  checked={mode === "dark"}
                  onCheckedChange={toggleMode}
                  data-testid="switch-dark-mode"
                />
              </div>
            </Card>

            <Card className="p-4 lg:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-md bg-primary/10">
                  <PanelLeft className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold">Navigation Color</h2>
                  <p className="text-sm text-muted-foreground">Customize the sidebar and header color</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {navColorOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setNavColor(option.id)}
                    className={`relative p-3 rounded-md border-2 transition-all text-left hover-elevate ${
                      navColor === option.id
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card"
                    }`}
                    data-testid={`button-nav-${option.id}`}
                  >
                    {navColor === option.id && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-primary-foreground" />
                      </div>
                    )}
                    <div className={`w-full h-6 rounded mb-2 ${option.color}`} />
                    <p className="font-medium text-xs">{option.label}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 hidden sm:block">{option.description}</p>
                  </button>
                ))}
              </div>
            </Card>

            <Card className="p-4 lg:p-6">
              <h2 className="font-semibold mb-4">Preview</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">
                    Primary Button
                  </div>
                  <div className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium">
                    Secondary Button
                  </div>
                  <div className="px-4 py-2 border border-border rounded-md text-sm font-medium">
                    Outline Button
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    Badge Primary
                  </div>
                  <div className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs font-medium">
                    Badge Muted
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden w-full max-w-xs">
                  <div className="h-full bg-primary rounded-full" style={{ width: "65%" }} />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="isp-details" className="space-y-6">
            <Card className="p-4 lg:p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-md bg-primary/10">
                  <ClipboardList className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold">ISP Preferences</h2>
                  <p className="text-sm text-muted-foreground">Configure your default ISP settings</p>
                </div>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  <div className="h-10 bg-muted rounded animate-pulse" />
                  <div className="h-10 bg-muted rounded animate-pulse" />
                  <div className="h-10 bg-muted rounded animate-pulse" />
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">System</Label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {systemOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleSystemChange(option)}
                          className={`py-2 rounded-md text-xs font-medium transition-all ${
                            ispSystem === option
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                          data-testid={`settings-system-${option.toLowerCase()}`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Group</Label>
                    <Select value={ispGroup} onValueChange={handleGroupChange}>
                      <SelectTrigger data-testid="select-settings-group">
                        <SelectValue placeholder="Select group" />
                      </SelectTrigger>
                      <SelectContent>
                        {groupOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Site</Label>
                    <Select value={ispSite} onValueChange={handleSiteChange}>
                      <SelectTrigger data-testid="select-settings-site">
                        <SelectValue placeholder="Select site" />
                      </SelectTrigger>
                      <SelectContent>
                        {siteOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Role
                      </span>
                    </Label>
                    <Select value={userRole} onValueChange={(v) => { setUserRole(v); setHasChanges(true); }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-[11px] text-muted-foreground">Admins can show/hide table columns</p>
                  </div>

                  <Button
                    onClick={handleSavePreferences}
                    disabled={!hasChanges || savePreferencesMutation.isPending}
                    className="w-full sm:w-auto"
                    data-testid="button-save-isp-preferences"
                  >
                    {savePreferencesMutation.isPending ? "Saving..." : "Save Preferences"}
                  </Button>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="ptw-details" className="space-y-6">
            <Card className="p-4 lg:p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-md bg-primary/10">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold">Pre-Task Work Details</h2>
                  <p className="text-sm text-muted-foreground">Configure PtW form preferences</p>
                </div>
              </div>

              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">PtW configuration options coming soon</p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
