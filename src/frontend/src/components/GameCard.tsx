import { Skeleton } from "@/components/ui/skeleton";

export interface Zone {
  id: string;
  name: string;
  cover: string;
  url: string;
  author?: string;
  featured?: boolean;
  special?: string[];
}

interface GameCardProps {
  zone: Zone;
  onClick: (zone: Zone) => void;
  index?: number;
}

export function GameCard({ zone, onClick, index }: GameCardProps) {
  const coverUrl = zone.cover.replace(
    "{COVER_URL}",
    "https://cdn.jsdelivr.net/gh/gn-math/covers@main",
  );

  const ocid = index !== undefined ? `game.card.${index + 1}` : undefined;

  const handleActivate = () => onClick(zone);

  return (
    <button
      type="button"
      data-ocid={ocid}
      className="card-hover cursor-pointer rounded-lg overflow-hidden border border-border bg-card group w-full text-left"
      onClick={handleActivate}
    >
      <div className="aspect-video relative overflow-hidden bg-muted">
        <img
          src={coverUrl}
          alt={zone.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full border-2 border-white/80 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <svg
              aria-label="Play"
              role="img"
              className="w-5 h-5 text-white ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <title>Play</title>
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-foreground truncate group-hover:text-neon-blue transition-colors duration-200">
          {zone.name}
        </p>
        {zone.author && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {zone.author}
          </p>
        )}
      </div>
    </button>
  );
}

export function GameCardSkeleton() {
  return (
    <div
      className="rounded-lg overflow-hidden border border-border bg-card"
      data-ocid="game.loading_state"
    >
      <Skeleton className="aspect-video w-full" />
      <div className="p-3 space-y-1.5">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}
