declare module "aos" {
  const AOS: { init(options?: { duration?: number; once?: boolean; offset?: number; easing?: string; disable?: boolean | (() => boolean) }): void; refresh(): void; refreshHard(): void };
  export default AOS;
}
