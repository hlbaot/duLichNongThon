import { Fragment, type ReactNode } from "react";
import { profileParagraphs } from "@/lib/destination-profile";

export function ProfileInline({ text }: { text: string }) {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) return <em key={index}>{part.slice(1, -1)}</em>;
    return <Fragment key={index}>{part}</Fragment>;
  });
}

const isBullet = (line: string) => /^\s*[-*•]\s+/.test(line);

/** Render đúng nội dung BE: giữ xuống dòng và danh sách, không tách/bỏ chữ. */
export function ProfileParagraphs({ text }: { text: string }) {
  return <>{profileParagraphs(text).map((paragraph, index) => {
    const lines = paragraph.split("\n");
    const nodes: ReactNode[] = [];
    let list: string[] = [];
    let plain: string[] = [];
    const flushList = () => {
      if (!list.length) return;
      nodes.push(<ul key={`ul-${nodes.length}`}>{list.map((line, i) => <li key={i}><ProfileInline text={line.replace(/^\s*[-*•]\s+/, "")} /></li>)}</ul>);
      list = [];
    };
    const flushPlain = () => {
      if (!plain.length) return;
      nodes.push(<p key={`p-${nodes.length}`}>{plain.map((line, i) => <Fragment key={i}>{i > 0 && <br />}<ProfileInline text={line} /></Fragment>)}</p>);
      plain = [];
    };
    for (const line of lines) {
      if (isBullet(line)) { flushPlain(); list.push(line); }
      else { flushList(); plain.push(line.trim()); }
    }
    flushList();
    flushPlain();
    return <Fragment key={index}>{nodes}</Fragment>;
  })}</>;
}
