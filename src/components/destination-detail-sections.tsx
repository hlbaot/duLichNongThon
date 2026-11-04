import { createElement, type ReactNode } from "react";
import { Award, CalendarDays, CircleDot, Compass, House, Leaf, Mountain, ShieldCheck, Sparkles, Users, Utensils, Wallet, type LucideIcon } from "lucide-react";
import type { ProfileSection } from "@/types/destination-profile";
import { normalizeProfileLabel, splitProfileLead } from "@/lib/destination-profile";
import { RevealOnScroll } from "./reveal-on-scroll";
import { DestinationImage } from "./destination-image";
import { SectionDivider } from "./section-divider";
import { DestinationDetailCarousel } from "./destination-detail-carousel";
import { ProfileInline, ProfileParagraphs } from "./destination-profile-text";

function sectionIcon(label: string): LucideIcon {
  const key = normalizeProfileLabel(label);
  if (key.startsWith("giaithuong")) return Award;
  if (key.startsWith("dichvu")) return Utensils;
  if (key.startsWith("doanhthu")) return Wallet;
  if (key.startsWith("luongkhach")) return Compass;
  if (key.startsWith("hinhthanh") || key.startsWith("sukien")) return CalendarDays;
  if (key.startsWith("soho")) return House;
  if (key.startsWith("quymo") || key.startsWith("sold") || key.startsWith("solaodong")) return Users;
  if (key.startsWith("thangcanh")) return Mountain;
  if (key.startsWith("mohinh")) return Leaf;
  return Sparkles;
}

function InformationCard({ section, number }: { section: ProfileSection; number: number }) {
  const award = normalizeProfileLabel(section.label).startsWith("giaithuong");
  return <article id={`profile-${section.id}`} className={`profile-information-card ${award ? "profile-information-award" : ""}`}>
    <div className="profile-information-top">{createElement(sectionIcon(section.label), { size: 22, strokeWidth: 1.4 })}<span>{String(number).padStart(2, "0")}</span></div>
    {section.label && <h3>{section.label}</h3>}
    <div className="profile-prose"><ProfileParagraphs text={section.content} /></div>
  </article>;
}

export function DestinationDetailSections({ sections, image }: { sections: ProfileSection[]; image?: { src: string; alt: string; caption?: string | null } }) {
  const visible = sections.filter(section => section.content.trim() || section.headingOnly);
  let imageUsed = false;
  let editorialCount = 0;
  const blocks: ReactNode[] = [];
  for (let i = 0; i < visible.length; i++) {
    const section = visible[i];
    if (section.kind === "fact" || section.kind === "highlight") {
      const group: { section: ProfileSection; number: number }[] = [];
      const kind = section.kind;
      while (i < visible.length && visible[i].kind === kind) {
        group.push({ section: visible[i], number: i + 1 });
        i++;
      }
      i--;
      blocks.push(<RevealOnScroll key={section.id} className={`profile-information-group profile-information-${kind}`}>
        <DestinationDetailCarousel label={kind === "fact" ? "Thông tin hồ sơ" : "Dấu ấn điểm đến"}>
          {group.map(({ section: item, number }) => <InformationCard key={item.id} section={item} number={number} />)}
        </DestinationDetailCarousel>
      </RevealOnScroll>);
      continue;
    }
    const { lead, rest } = splitProfileLead(section.content);
    const useImage = section.kind === "product" && image && !imageUsed;
    if (useImage) imageUsed = true;
    const tone = editorialCount++ % 2 === 1 ? "profile-tone-alt" : "";
    blocks.push(<RevealOnScroll key={section.id} className={`profile-editorial-section profile-section-${section.kind} ${tone}`}>
      <div className="profile-section-label" id={`profile-${section.id}`}><span>{String(i + 1).padStart(2, "0")}</span>{section.label && <h3>{section.label}</h3>}</div>
      <div className="profile-section-content">
        {section.kind === "product" ? <>
          <div className="profile-product-columns"><p className="profile-lead"><ProfileInline text={lead} /></p>{rest && <div className="profile-prose"><ProfileParagraphs text={rest} /></div>}</div>
          {useImage && <figure className="profile-editorial-image"><div><DestinationImage src={image.src} alt={image.alt} sizes="(max-width: 1023px) 100vw, 760px" className="object-cover" /></div>{image.caption && <figcaption>{image.caption}</figcaption>}</figure>}
        </> : section.kind === "community" ? <div className="profile-community-columns">
          <div className="profile-prose"><ProfileParagraphs text={section.content} /></div>
        </div> : section.kind === "sustainability" ? <div className="profile-sustainability-panel"><ShieldCheck size={30} strokeWidth={1.3} /><div className="profile-prose"><ProfileParagraphs text={section.content} /></div></div>
        : section.kind === "digital" ? <div className="profile-digital-columns"><blockquote><CircleDot size={19} strokeWidth={1.4} /><p><ProfileInline text={lead} /></p></blockquote>{rest && <div className="profile-prose"><ProfileParagraphs text={rest} /></div>}</div>
        : <div className="profile-prose"><ProfileParagraphs text={section.content} /></div>}
      </div>
    </RevealOnScroll>);
  }
  return <div className="profile-sections">
    {blocks.length > 0 && <SectionDivider fill="var(--profile-line)" className="profile-section-divider" />}{blocks}
  </div>;
}
