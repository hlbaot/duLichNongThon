import { Fragment } from "react";

/** In đậm/nghiêng theo markdown của BE, không đổi chữ. */
function Inline({ text }: { text: string }) {
  return <>{text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) return <em key={index}>{part.slice(1, -1)}</em>;
    return <Fragment key={index}>{part}</Fragment>;
  })}</>;
}

/** Hiển thị nguyên văn `detail` do BE trả về: từng đoạn một, không tách mục, không tóm tắt. */
export function DestinationDetailPlain({ text }: { text: string }) {
  const blocks = text.replace(/\r\n?/g, "\n").split(/\n\s*\n/).map(block => block.trim()).filter(Boolean);
  return <div className="profile-plain">{blocks.map((block, index) => {
    const heading = block.match(/^(#{1,6})\s+([\s\S]+)$/);
    if (heading) return <h2 key={index}><Inline text={heading[2]} /></h2>;
    return <p key={index}>{block.split("\n").map((line, i) => <Fragment key={i}>{i > 0 && <br />}<Inline text={line} /></Fragment>)}</p>;
  })}</div>;
}
