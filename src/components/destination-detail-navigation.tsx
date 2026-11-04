import Link from "next/link";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import type { Destination } from "@/types/voting-destination";

export function DestinationDetailNavigation({ destinations, currentId }: { destinations: Destination[]; currentId: string }) {
  const ordered = [...destinations].sort((a, b) => a.displayOrder - b.displayOrder || a.id.localeCompare(b.id));
  const index = ordered.findIndex(item => item.id === currentId);
  if (index < 0) return null;
  const previous = ordered[index - 1];
  const next = ordered[index + 1];
  if (!previous && !next) return null;
  return <nav className="profile-navigation" aria-label="Khám phá hồ sơ khác">
    {[{ item: previous, label: "Hồ sơ trước", Icon: ArrowLeft }, { item: next, label: "Hồ sơ tiếp theo", Icon: ArrowRight }].filter(({ item }) => item).map(({ item, label, Icon }) => item && <Link key={item.id} href={`/diem-den/${encodeURIComponent(item.slug)}`} prefetch={false} className="profile-navigation-card">
      <span>{label}<Icon size={20} /></span><h3>{item.name}</h3>{item.province && <small><MapPin size={12} />{item.province}</small>}
    </Link>)}
  </nav>;
}
