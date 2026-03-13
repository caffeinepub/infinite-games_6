import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Moon, ShieldAlert, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Settings {
  theme: "dark" | "light";
  panicKey: string;
}

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  settings: Settings;
  onSave: (settings: Settings) => void;
}

export function SettingsModal({
  open,
  onClose,
  settings,
  onSave,
}: SettingsModalProps) {
  const [theme, setTheme] = useState<"dark" | "light">(settings.theme);
  const [panicKey, setPanicKey] = useState(settings.panicKey);

  useEffect(() => {
    setTheme(settings.theme);
    setPanicKey(settings.panicKey);
  }, [settings]);

  const handleSave = () => {
    onSave({ theme, panicKey });
    toast.success("Settings saved!", {
      description: panicKey
        ? `Panic key set to: ${panicKey}`
        : "No panic key configured",
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="border-border bg-card max-w-md"
        data-ocid="settings.modal"
        style={{
          boxShadow:
            "0 0 40px oklch(60% 0.32 300 / 0.3), 0 0 80px oklch(60% 0.32 300 / 0.1)",
        }}
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl neon-text-purple">
            ⚙ Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Theme toggle */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
              Theme
            </Label>
            <div className="flex gap-2" data-ocid="settings.theme_toggle">
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                className="flex-1 gap-2"
                onClick={() => setTheme("dark")}
                style={
                  theme === "dark"
                    ? {
                        background: "oklch(var(--neon-purple) / 0.2)",
                        borderColor: "oklch(var(--neon-purple))",
                        boxShadow: "0 0 10px oklch(var(--neon-purple) / 0.4)",
                      }
                    : {}
                }
              >
                <Moon className="w-4 h-4" />
                Dark
              </Button>
              <Button
                variant={theme === "light" ? "default" : "outline"}
                className="flex-1 gap-2"
                onClick={() => setTheme("light")}
                style={
                  theme === "light"
                    ? {
                        background: "oklch(var(--neon-blue) / 0.2)",
                        borderColor: "oklch(var(--neon-blue))",
                        boxShadow: "0 0 10px oklch(var(--neon-blue) / 0.4)",
                      }
                    : {}
                }
              >
                <Sun className="w-4 h-4" />
                Light
              </Button>
            </div>
          </div>

          {/* Panic key */}
          <div className="space-y-2">
            <Label
              htmlFor="panic-key"
              className="text-sm font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4 text-destructive" />
              Panic Key
            </Label>
            <p className="text-xs text-muted-foreground">
              Press this key to instantly redirect to Google. Leave empty to
              disable.
            </p>
            <Input
              id="panic-key"
              data-ocid="settings.panic_input"
              placeholder="e.g. F1, Escape, p"
              value={panicKey}
              onChange={(e) => setPanicKey(e.target.value)}
              className="border-border bg-input font-mono"
            />
            {panicKey && (
              <p className="text-xs text-neon-blue">
                Current:{" "}
                <span className="font-mono bg-muted px-1.5 py-0.5 rounded">
                  {panicKey}
                </span>
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            data-ocid="settings.cancel_button"
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={handleSave}
            data-ocid="settings.save_button"
            style={{
              background:
                "linear-gradient(135deg, oklch(60% 0.32 300 / 0.8), oklch(65% 0.3 220 / 0.8))",
              boxShadow: "0 0 15px oklch(60% 0.32 300 / 0.4)",
            }}
          >
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
