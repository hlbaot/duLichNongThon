/** Static SVG textures and transform-only ambient motion; no client JavaScript. */
export function PageBackground() {
  return <div className="page-background fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
    <div className="page-mesh" />
    <div className="ambient-blob ambient-blob-mint" />
    <div className="ambient-blob ambient-blob-sky" />
    <div className="ambient-blob ambient-blob-sage" />
    <svg className="field-pattern" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs><pattern id="rural-field-lines" width="520" height="320" patternUnits="userSpaceOnUse"><g fill="none" stroke="#1F6B45" strokeWidth="1" strokeOpacity=".05"><path d="M-60 240Q130 20 340 150T650 70M-60 266Q130 46 340 176T650 96M-60 292Q130 72 340 202T650 122M-60 318Q130 98 340 228T650 148M-60 344Q130 124 340 254T650 174" /></g></pattern></defs>
      <rect width="100%" height="100%" fill="url(#rural-field-lines)" />
    </svg>
    <div className="page-grain" />
  </div>;
}
