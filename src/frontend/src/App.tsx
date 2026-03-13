import { GameCard, GameCardSkeleton, type Zone } from "@/components/GameCard";
import { ParticleCanvas } from "@/components/ParticleCanvas";
import { SettingsModal } from "@/components/SettingsModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import {
  ChevronRight,
  Gamepad2,
  RefreshCw,
  Search,
  Settings,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

const HTML_URL = "https://cdn.jsdelivr.net/gh/gn-math/html@main";
const ZONES_URL = "https://cdn.jsdelivr.net/gh/gn-math/assets@main/zones.json";
const RECENT_KEY = "infiniteGames_recentlyPlayed";
const SETTINGS_KEY = "infiniteGames_settings";

const SKELETON_KEYS = Array.from({ length: 18 }, (_, i) => `skeleton-${i}`);

interface AppSettings {
  theme: "dark" | "light";
  panicKey: string;
}

const defaultSettings: AppSettings = { theme: "dark", panicKey: "" };

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {}
  return defaultSettings;
}

function loadRecent(): Zone[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export default function App() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [recentlyPlayed, setRecentlyPlayed] = useState<Zone[]>(loadRecent);
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Tab cloaking
  useEffect(() => {
    document.title = "Google";
    let link = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = "https://www.google.com/favicon.ico";
  }, []);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
  }, [settings.theme]);

  // Panic key
  useEffect(() => {
    if (!settings.panicKey) return;
    const handler = (e: KeyboardEvent) => {
      const key = settings.panicKey.toLowerCase();
      const pressed = e.key.toLowerCase();
      if (pressed === key || e.code.toLowerCase() === key) {
        window.location.href = "https://google.com";
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [settings.panicKey]);

  // Fetch zones
  const fetchZones = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(ZONES_URL);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setZones(Array.isArray(data) ? data : (data.zones ?? []));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchZones();
  }, [fetchZones]);

  const filteredZones = useMemo(() => {
    if (!search.trim()) return zones;
    const q = search.toLowerCase();
    return zones.filter((z) => z.name.toLowerCase().includes(q));
  }, [zones, search]);

  const openGame = useCallback((zone: Zone) => {
    setRecentlyPlayed((prev) => {
      const filtered = prev.filter((z) => z.id !== zone.id);
      const updated = [zone, ...filtered].slice(0, 8);
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
      return updated;
    });

    if (zone.url.startsWith("http")) {
      const encoded = encodeURIComponent(zone.url);
      window.open(`https://duckduckgo.com/?q=!ducky+${encoded}`, "_blank");
    } else {
      const url = zone.url.replace("{HTML_URL}", HTML_URL);
      fetch(`${url}?t=${Date.now()}`)
        .then((r) => r.text())
        .then((html) => {
          const newWin = window.open("about:blank", "_blank");
          if (newWin) {
            newWin.document.open();
            newWin.document.write(html);
            newWin.document.close();
          }
        })
        .catch(() => {
          const newWin = window.open("about:blank", "_blank");
          if (newWin) {
            newWin.document.open();
            newWin.document.write(
              `<html><body style="background:#000;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh"><h2>Failed to load game</h2></body></html>`,
            );
            newWin.document.close();
          }
        });
    }
  }, []);

  const handleSaveSettings = useCallback((newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
  }, []);

  const currentYear = new Date().getFullYear();
  const hostname = window.location.hostname;

  return (
    <div
      className="min-h-screen relative"
      style={{
        background:
          settings.theme === "dark"
            ? "oklch(8% 0.04 285)"
            : "oklch(96% 0.02 285)",
      }}
    >
      <ParticleCanvas />

      <div className="relative" style={{ zIndex: 1 }}>
        {/* Header */}
        <header
          className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl"
          style={{ background: "oklch(10% 0.05 285 / 0.85)" }}
        >
          <div className="container mx-auto px-4 py-3 flex items-center gap-4">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Gamepad2
                className="w-7 h-7 animate-pulse-neon"
                style={{ color: "oklch(65% 0.3 220)" }}
              />
              <h1
                className="font-display text-xl font-bold tracking-wider hidden sm:block"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(65% 0.3 220), oklch(60% 0.32 300))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 8px oklch(60% 0.32 300 / 0.6))",
                }}
              >
                INFINITE GAMES
              </h1>
            </div>

            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: "oklch(65% 0.3 220)" }}
              />
              <Input
                data-ocid="header.search_input"
                placeholder="Search games..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 border-border/60 bg-background/50 backdrop-blur-sm"
                style={{
                  boxShadow: search
                    ? "0 0 8px oklch(65% 0.3 220 / 0.3)"
                    : undefined,
                }}
              />
            </div>

            <Button
              data-ocid="header.settings_button"
              variant="outline"
              size="icon"
              onClick={() => setSettingsOpen(true)}
              className="border-border/60 flex-shrink-0"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 space-y-10">
          {/* Recently Played */}
          {recentlyPlayed.length > 0 && (
            <section data-ocid="recently_played.section">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-1 h-6 rounded-full"
                  style={{
                    background: "oklch(60% 0.32 300)",
                    boxShadow: "0 0 8px oklch(60% 0.32 300)",
                  }}
                />
                <h2 className="font-display text-sm font-semibold tracking-widest uppercase neon-text-purple">
                  Recently Played
                </h2>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                {recentlyPlayed.map((zone) => (
                  <div key={zone.id} className="w-48 flex-shrink-0">
                    <GameCard zone={zone} onClick={openGame} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* All Games */}
          <section data-ocid="games.section">
            <div className="flex items-center gap-2 mb-6">
              <div
                className="w-1 h-6 rounded-full"
                style={{
                  background: "oklch(65% 0.3 220)",
                  boxShadow: "0 0 8px oklch(65% 0.3 220)",
                }}
              />
              <h2 className="font-display text-sm font-semibold tracking-widest uppercase neon-text-blue">
                {search ? `Results for "${search}"` : "All Games"}
              </h2>
              {!loading && (
                <span className="text-xs text-muted-foreground font-mono">
                  {filteredZones.length} games
                </span>
              )}
            </div>

            {error && (
              <div
                className="flex flex-col items-center justify-center py-20 gap-4"
                data-ocid="games.error_state"
              >
                <p className="text-muted-foreground">Failed to load games.</p>
                <Button
                  onClick={fetchZones}
                  variant="outline"
                  className="gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </Button>
              </div>
            )}

            {loading && (
              <div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                data-ocid="games.loading_state"
              >
                {SKELETON_KEYS.map((k) => (
                  <GameCardSkeleton key={k} />
                ))}
              </div>
            )}

            {!loading && !error && filteredZones.length === 0 && (
              <div
                className="flex flex-col items-center justify-center py-20 gap-3"
                data-ocid="games.empty_state"
              >
                <Gamepad2 className="w-12 h-12 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {search ? `No games match "${search}"` : "No games found"}
                </p>
              </div>
            )}

            {!loading && !error && filteredZones.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredZones.map((zone, i) => (
                  <GameCard
                    key={zone.id}
                    zone={zone}
                    onClick={openGame}
                    index={i < 3 ? i : undefined}
                  />
                ))}
              </div>
            )}
          </section>
        </main>

        <footer className="border-t border-border/30 py-6 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-xs text-muted-foreground">
              &copy; {currentYear}. Built with &hearts; using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-neon-blue transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </footer>
      </div>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSave={handleSaveSettings}
      />

      <Toaster />
    </div>
  );
}
