import type { ProfileSection } from "@/types/destination-profile";
import { ProfileParagraphs } from "./destination-profile-text";

/** Nội dung hồ sơ trình bày liên tục như bài báo, giữ nguyên thứ tự và văn bản. */
export function DestinationDetailSections({ sections }: { sections: ProfileSection[] }) {
  return <article className="profile-article">
    {sections.filter(section => section.content.trim() || section.headingOnly).map(section => (
      <section key={section.id} id={`profile-${section.id}`} className="profile-article-section">
        {section.label && <h3>{section.label}</h3>}
        {section.content.trim() && <ProfileParagraphs text={section.content} />}
      </section>
    ))}
  </article>;
}
