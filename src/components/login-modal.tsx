"use client";
import type { Step } from "@/types/login-modal";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, LoaderCircle, Mail, X } from "lucide-react";
import { toast } from "react-toastify";
import { useVotingStore } from "@/stores/use-voting-store";
import { useAuth } from "@/lib/auth/AuthProvider";
import { normalizeEmail } from "@/lib/auth/authService";
import { useCountdown } from "@/hooks/useCountdown";


function LoginPanel({ standalone }: { standalone: boolean }) {
  const auth = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<Step>("account");
  const [email, setEmail] = useState("");
  const [normalizedEmail, setNormalizedEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [resendAt, setResendAt] = useState(0);
  const [expiresAt, setExpiresAt] = useState(0);
  const expiry = useCountdown(expiresAt);
  const { m, s } = useCountdown(resendAt);
  const resendSeconds = Number(m) * 60 + Number(s);
  const panel = useRef<HTMLDivElement>(null);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const mounted = useRef(true);
  const request = useRef(0);
  const ranking = useVotingStore(state => state.ranking);
  const pendingDestination = ranking.find(destination => destination.id === auth.pendingDestinationId);

  const close = () => { ++request.current; auth.closeLoginModal(); if (standalone) router.push("/"); };

  useEffect(() => {
    mounted.current = true;
    const req = request;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    if (!standalone) {
      document.body.style.overflow = "hidden";
      if (typeof window !== "undefined" && window.__lenis) {
        window.__lenis.stop();
      }
    }
    panel.current?.querySelector<HTMLInputElement>("input")?.focus();
    return () => {
      mounted.current = false;
      ++req.current;
      if (!standalone) {
        document.body.style.overflow = overflow;
        if (typeof window !== "undefined" && window.__lenis) {
          window.__lenis.start();
        }
        if (previous?.isConnected && !(previous instanceof HTMLButtonElement && previous.disabled)) previous.focus();
        else document.querySelector<HTMLButtonElement>(".account-trigger, .nav-login-button")?.focus();
      }
    };
  }, [standalone]);

  const run = async (operation: () => Promise<void>) => {
    if (busy) return;
    const token = ++request.current;
    setBusy(true); setError("");
    try { await operation(); }
    catch (issue) { if (mounted.current && token === request.current) setError(issue instanceof Error ? issue.message : "Có lỗi xảy ra. Vui lòng thử lại."); }
    finally { if (mounted.current && token === request.current) setBusy(false); }
  };

  const showValidationError = (message: string) => {
    setError(message);
    toast.error(message, { toastId: message });
  };

  const send = async (event: FormEvent) => {
    event.preventDefault();
    let normalized: string;
    try { normalized = normalizeEmail(email); }
    catch { showValidationError("Vui lòng nhập email hợp lệ."); return; }
    await run(async () => {
      const result = await auth.sendOtp(normalized);
      if (!mounted.current) return;
      setNormalizedEmail(normalized);
      setResendAt(Date.now() + result.retryAfter * 1000);
      setExpiresAt(Date.now() + result.expiresIn * 1000);
      setOtp(Array(6).fill(""));
      setStep("otp");
    });
  };

  const resend = () => run(async () => {
    const result = await auth.resendOtp(normalizedEmail);
    if (!mounted.current) return;
    setResendAt(Date.now() + result.retryAfter * 1000);
    setExpiresAt(Date.now() + result.expiresIn * 1000);
    setOtp(Array(6).fill(""));
    inputs.current[0]?.focus();
    toast.success("Mã OTP mới đã được gửi lại vào email của bạn.");
  });

  const verify = async (event: FormEvent) => {
    event.preventDefault();
    if (otp.join("").length !== 6) { showValidationError("Vui lòng nhập đủ 6 chữ số mã OTP."); return; }
    await run(async () => { await auth.verifyOtp(normalizedEmail, otp.join("")); if (standalone) router.push("/"); });
  };

  const enterDigits = (index: number, text: string) => {
    if (!/^\d*$/.test(text)) return;
    const digits = text.slice(0, 6 - index).split("");
    setOtp(current => { const next = [...current]; if (!digits.length) next[index] = ""; else digits.forEach((digit, offset) => { next[index + offset] = digit; }); return next; });
    setError(""); inputs.current[Math.min(index + digits.length, 5)]?.focus();
  };

  const changeStep = (next: Step) => { setError(""); setStep(next); };

  return <div className={standalone ? (step === "otp" ? "auth-page auth-otp-page" : "auth-page") : "auth-overlay modal-enter-overlay"} onPointerDown={event => { if (!standalone && event.target === event.currentTarget) close(); }} onKeyDown={event => {
    if (event.key === "Escape") { event.stopPropagation(); close(); }
    if (event.key === "Tab" && (!standalone || step === "otp")) {
      const controls = panel.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), a[href], summary');
      const first = controls?.[0]; const last = controls?.[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
  }}><div ref={panel} data-lenis-prevent className={standalone ? "auth-panel" : "auth-panel modal-enter-panel"} role={standalone && step !== "otp" ? undefined : "dialog"} aria-modal={standalone && step !== "otp" ? undefined : true} aria-labelledby="auth-title" aria-describedby="auth-description">
    <div className="auth-topline"><Link href="/" aria-label="Du lịch Nông thôn - Trang chủ"><Image src="/logo.png" alt="Du lịch Nông thôn" width={34} height={34} className="rounded-full" /></Link><button className="auth-close" onClick={close} aria-label="Đóng đăng nhập"><X size={19} /></button></div>
    <div className="auth-intro"><h2 id="auth-title">{step === "otp" ? "Nhập mã OTP" : "Đăng nhập"}</h2><p id="auth-description">{step === "otp" ? <>Nhập mã 6 số gửi đến <strong>{normalizedEmail}</strong>.</> : "Nhập email của bạn để xác minh trước khi nhận mã OTP."}</p></div>
    {pendingDestination && <div className="auth-destination"><span>Đăng nhập để tiếp tục bình chọn cho</span><strong>{pendingDestination.name}</strong></div>}
    <div aria-live="assertive" aria-atomic="true">{error && <p id="auth-error" className="auth-error">{error}</p>}</div>
    {step === "account" && <form className="auth-form" onSubmit={send} noValidate>
      <div><label htmlFor="auth-email">Email</label><div className="auth-input"><Mail size={17} /><input id="auth-email" aria-invalid={Boolean(error)} aria-describedby={error ? "auth-error" : undefined} type="email" inputMode="email" autoComplete="username" autoCapitalize="none" spellCheck={false} placeholder="Email của bạn" value={email} onChange={event => { setEmail(event.target.value); setError(""); }} disabled={busy || auth.isLoading} required /></div></div>
      <button className="vote-button auth-submit" type="submit" disabled={busy || auth.isLoading}>{busy ? <><LoaderCircle className="animate-spin" size={17} />Đang xác minh…</> : <>Xác minh email <ArrowRight size={17} /></>}</button>
      </form>}
    {step === "otp" && <form className="auth-form" onSubmit={verify} noValidate>
      <fieldset className="otp-fieldset" disabled={busy}><legend>Mã xác thực 6 chữ số</legend><div className="otp-boxes">{otp.map((digit, index) => <input key={index} ref={element => { inputs.current[index] = element; }} aria-label={`Chữ số OTP ${index + 1}`} inputMode="numeric" autoComplete={index === 0 ? "one-time-code" : "off"} maxLength={6} value={digit} className={digit ? "is-filled" : ""} onChange={event => enterDigits(index, event.target.value)} onFocus={event => event.target.select()} onPaste={event => { event.preventDefault(); const value = event.clipboardData.getData("text").trim(); if (/^\d{1,6}$/.test(value)) enterDigits(index, value); }} onKeyDown={event => { if (event.key === "Backspace" && !digit && index > 0) inputs.current[index - 1]?.focus(); if (event.key === "ArrowLeft" && index > 0) inputs.current[index - 1]?.focus(); if (event.key === "ArrowRight" && index < 5) inputs.current[index + 1]?.focus(); }} autoFocus={index === 0} />)}</div></fieldset>
      <p className="text-sm">Mã hết hạn sau {expiry.m}:{expiry.s}</p>
      <div className="otp-resend"><span>Chưa nhận được mã?</span><button type="button" disabled={busy || resendSeconds > 0} onClick={() => void resend()}>{busy ? "Đang xử lý…" : resendSeconds > 0 ? `Gửi lại sau ${resendSeconds}s` : "Gửi lại mã"}</button></div>
      <button className="vote-button auth-submit" type="submit" disabled={busy}>{busy ? <><LoaderCircle className="animate-spin" size={17} />Đang xác nhận…</> : "Xác nhận"}</button>
      <button className="auth-back" type="button" disabled={busy} onClick={() => changeStep("account")}><ArrowLeft size={15} />Thay đổi email</button>
    </form>}
    <p className="auth-session-note">Mỗi điểm đến chỉ được bình chọn một lần trong toàn hội thi.</p>
  </div></div>;
}

export function LoginModal({ standalone = false }: { standalone?: boolean }) {
  const { loginModalOpen } = useAuth();
  return standalone || loginModalOpen ? <LoginPanel standalone={standalone} /> : null;
}
