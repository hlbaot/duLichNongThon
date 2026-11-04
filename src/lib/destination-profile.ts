import type { DestinationProfile, ProfileMetric, ProfileSectionKind } from "@/types/destination-profile";

export const normalizeProfileLabel = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/gi, "d").toLowerCase().replace(/[^a-z0-9]/g, "");

function sectionKind(label: string): ProfileSectionKind {
  const key = normalizeProfileLabel(label);
  if (key === "sanphamdacsac") return "product";
  if (key === "suthamgiacongdong") return "community";
  if (key.startsWith("benvung")) return "sustainability";
  if (key.startsWith("xuctien")) return "digital";
  if (/^(diemnoibat|diemnhan|sukien|giaithuong|mohinh|sanphamdactrung|giatrikhacbiet|thangcanh)/.test(key)) return "highlight";
  if (/^(quymo|soho|solaodong|sold|dichvu|hinhthanh|luongkhach|doanhthu|chuthe|operator)/.test(key)) return "fact";
  return "general";
}

/** Presentational parser only: unknown labels and continuation paragraphs are retained. */
export function parseDestinationProfile(raw: string): DestinationProfile {
  const result: DestinationProfile = { code: "", codeLabel: "", address: "", addressLabel: "", heading: "", sections: [] };
  let current: DestinationProfile["sections"][number] | undefined;
  for (const block of raw.replace(/\r\n?/g, "\n").split(/\n\s*\n/)) {
    const text = block.trim();
    if (!text) continue;
    const heading = text.match(/^#{1,6}\s+([^\n]+)$/);
    if (heading && normalizeProfileLabel(heading[1]) === "noidunghoso" && !result.heading) {
      result.heading = heading[1];
      current = undefined;
      continue;
    }
    const labeled = text.match(/^(?:\*\*)?([^:;\n]{2,80}?)(?::|;)(?:\*\*)?\s*([\s\S]*)$/);
    if (labeled) {
      const label = labeled[1].trim().replace(/\*\*$/g, "");
      const content = labeled[2].trim();
      const key = normalizeProfileLabel(label);
      if ((key === "mahoso" || key === "mabaiduthi") && !result.code) { result.code = content; result.codeLabel = label; current = undefined; continue; }
      if (key === "diachi" && !result.address) { result.address = content; result.addressLabel = label; current = undefined; continue; }
      current = { id: `section-${result.sections.length}`, label, content, kind: sectionKind(label) };
      result.sections.push(current);
    } else if (heading) {
      current = { id: `section-${result.sections.length}`, label: heading[1], content: "", kind: sectionKind(heading[1]), headingOnly: true };
      result.sections.push(current);
    } else if (current) {
      current.content += `${current.content ? "\n\n" : ""}${text}`;
    } else {
      current = { id: `section-${result.sections.length}`, label: "", content: text, kind: "general" };
      result.sections.push(current);
    }
  }
  return result;
}

/** Keep decimal numbers intact and reuse original sentence text verbatim. */
export function splitProfileLead(text: string): { lead: string; rest: string } {
  const value = text.trim();
  if (!value) return { lead: "", rest: "" };
  const sentence = [...new Intl.Segmenter("vi", { granularity: "sentence" }).segment(value)][0]?.segment ?? value;
  return { lead: sentence.trim(), rest: value.slice(sentence.length).trim() };
}

/** Giữ nguyên từng đoạn như BE trả về, không tách hay rút gọn câu. */
export function profileParagraphs(text: string): string[] {
  return text.split(/\n\s*\n/).map(paragraph => paragraph.trim()).filter(Boolean);
}

function metric(id: string, label: string, original: string): ProfileMetric | null {
  const match = original.trim().match(/^(.*?)(\d[\d.,]*)([\s\S]*)$/);
  if (!match) return null;
  const number = match[2].replace(/\.$/, "");
  const precision = number.includes(",") ? number.split(",")[1].length : 0;
  const value = Number(number.replace(/\./g, "").replace(",", "."));
  if (!Number.isFinite(value)) return null;
  return { id, label, displayValue: original.trim(), value, precision, prefix: match[1], suffix: match[3] };
}

export function extractProfileMetrics(profile: DestinationProfile): ProfileMetric[] {
  const metrics: ProfileMetric[] = [];
  const sections = profile.sections;
  const add = (id: string, label: string, value?: string) => {
    if (!value) return;
    const parsed = metric(id, label, value);
    if (parsed) metrics.push(parsed);
  };
  const community = sections.find(item => normalizeProfileLabel(item.label).startsWith("quymo"));
  const qualifier = "(?:(?:trên|khoảng|hơn|gần)\\s+)?";
  const withUnit = (content: string, unit: string) => content.match(new RegExp(`${qualifier}\\d[\\d.,]*\\s+${unit}`, "i"))?.[0];
  if (community) add("households", community.label, withUnit(community.content, "hộ"));
  const tourism = sections.find(item => /^soho/.test(normalizeProfileLabel(item.label)));
  if (tourism) add("tourism", tourism.label, tourism.content.match(/^(?:(?:trên|khoảng|hơn|gần)\s+)?\d[\d.,]*(?:\s+hộ)?(?:\s*\([^)]*\))?/i)?.[0]);
  const workers = sections.find(item => /^(solaodong|sold)/.test(normalizeProfileLabel(item.label)));
  if (workers) add("workers", workers.label, workers.content.match(/^(?:(?:trên|khoảng|hơn|gần)\s+)?\d[\d.,]*(?:\s+(?:người|lao động))?/i)?.[0]);
  const visitors = sections.find(item => normalizeProfileLabel(item.label) === "luongkhach");
  if (visitors) add("visitors", visitors.label, [...visitors.content.matchAll(/(?:(?:trên|khoảng|hơn|gần)\s+)?\d[\d.,]*\s+lượt(?:\s*\([^)]*\))?/gi)].at(-1)?.[0]);
  const revenue = sections.find(item => normalizeProfileLabel(item.label) === "doanhthu");
  if (revenue) add("revenue", revenue.label, [...revenue.content.matchAll(/(?:(?:trên|khoảng|hơn|gần)\s+)?\d[\d.,]*\s+(?:tỷ|triệu|nghìn)(?:\s+đồng)?(?:\s*\([^)]*\))?/gi)].at(-1)?.[0]);
  if (community) add("area", "Diện tích", withUnit(community.content, "ha"));
  const services = sections.find(item => normalizeProfileLabel(item.label) === "dichvu");
  if (services) add("homestay", services.label, withUnit(services.content, "homestay"));
  if (community) add("population", community.label, withUnit(community.content, "nhân khẩu"));
  return metrics.slice(0, 6);
}
