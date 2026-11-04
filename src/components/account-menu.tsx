"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Eye, EyeOff, LogOut, MapPin, Mail, UserRound, Vote, X } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { Toast } from "./toast";
import { useVoteHistory } from "@/hooks/useVoteHistory";

const PROFILE_TOAST_ID = "profile-toast";

export function AccountMenu() {
  const { user, remainingVotes } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  return (
    <>
      <button
        type="button"
        className="account-trigger relative inline-flex size-11 cursor-pointer items-center justify-center rounded-full bg-emerald-800 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
        onClick={() => setOpen(true)}
        aria-label={`Mở hồ sơ, còn ${remainingVotes} lượt bình chọn`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? "account-panel" : undefined}
      >
        <UserRound aria-hidden="true" size={20} />
        <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-emerald-100 text-[11px] font-extrabold text-emerald-950">
          {remainingVotes}
        </span>
      </button>
      {open && createPortal(
        <ProfileModal email={user.email ?? ""} onClose={() => setOpen(false)} />,
        document.body,
      )}
    </>
  );
}

function ProfileModal({ email, onClose }: { email: string; onClose: () => void }) {
  const { logout, usedVotes, remainingVotes, maxVotes } = useAuth();
  const voteHistory = useVoteHistory() ?? [];
  const [revealEmail, setRevealEmail] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const masked = email ? `${email.slice(0, 2)}***@${email.split("@")[1]}` : "Chưa có email";

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;

    const previousOverflow = document.body.style.overflow;
    const lenis = window.__lenis;
    const shouldResume = lenis && !lenis.isStopped;
    document.body.style.overflow = "hidden";
    if (shouldResume) lenis.stop();
    element.showModal();
    closeButton.current?.focus({ preventScroll: true });

    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      if (shouldResume) lenis.start();
    };
  }, []);

  return (
    <dialog
      ref={dialog}
      id="account-panel"
      aria-labelledby="account-title"
      data-lenis-prevent
      className="modal-enter-panel fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto overscroll-contain rounded-3xl border border-emerald-200 bg-emerald-50 p-0 text-emerald-950 shadow-2xl shadow-emerald-950/35 backdrop:bg-emerald-950/65 backdrop:backdrop-blur-sm"
      onClick={event => { if (event.target === event.currentTarget) onClose(); }}
      onCancel={event => { event.preventDefault(); onClose(); }}
    >
      <div>
        <header className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-700 px-5 py-6 text-emerald-50 sm:px-6">
          <button
            ref={closeButton}
            type="button"
            onClick={onClose}
            aria-label="Đóng hồ sơ"
            className="absolute top-4 right-4 grid size-10 cursor-pointer place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200"
          >
            <X size={19} />
          </button>
          <span className="mb-4 grid size-12 place-items-center rounded-2xl border border-white/25 bg-white/15">
            <UserRound aria-hidden="true" size={24} />
          </span>
          <p className="text-[11px] font-extrabold tracking-[.2em] text-emerald-200 uppercase">Hồ sơ bình chọn</p>
          <h2 id="account-title" className="mt-1 text-2xl font-extrabold tracking-tight">Tài khoản của bạn</h2>
        </header>

        <div className="space-y-4 p-5 sm:p-6">
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white/75 px-3 py-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-800">
              <Mail aria-hidden="true" size={17} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-emerald-800">Email</p>
              <p className="break-all font-bold">{revealEmail ? email : masked}</p>
            </div>
            <button
              type="button"
              onClick={() => setRevealEmail(value => !value)}
              aria-label={revealEmail ? "Ẩn email" : "Hiện email"}
              className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-xl text-emerald-800 hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-emerald-700"
            >
              {revealEmail ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <section aria-labelledby="profile-votes" className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-100 to-white/80 p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 id="profile-votes" className="flex items-center gap-2 text-sm font-bold">
                <Vote aria-hidden="true" size={17} /> Lượt bình chọn
              </h3>
              <span className="shrink-0 text-sm font-extrabold tabular-nums">{usedVotes}/{maxVotes}</span>
            </div>
            <div
              role="progressbar"
              aria-label="Lượt bình chọn đã dùng"
              aria-valuenow={usedVotes}
              aria-valuemin={0}
              aria-valuemax={maxVotes}
              className="my-3 flex gap-1.5"
            >
              {Array.from({ length: maxVotes }, (_, index) => (
                <span key={index} className={`h-2 flex-1 rounded-full ${index < usedVotes ? "bg-emerald-700" : "bg-emerald-200"}`} />
              ))}
            </div>
            <p className="text-sm">Còn lại <strong>{remainingVotes} lượt</strong></p>
            <p className="mt-2 text-xs text-emerald-800">Hạn mức áp dụng cho toàn hội thi.</p>
          </section>

          <section aria-labelledby="profile-destinations">
            <h3 id="profile-destinations" className="mb-2 text-sm font-extrabold">Đã bình chọn</h3>
            {voteHistory.length ? (
              <ul className="space-y-2">
                {voteHistory.map(item => (
                  <li key={item.id} className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-white/70 px-3 py-2 text-sm">
                    <MapPin aria-hidden="true" size={16} className="shrink-0 text-emerald-700" />
                    {item.destination.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-xl border border-dashed border-emerald-300 px-3 py-3 text-sm text-emerald-800">
                Bạn chưa bình chọn điểm đến nào.
              </p>
            )}
          </section>

          <button
            type="button"
            onClick={() => void logout(PROFILE_TOAST_ID)}
            className="flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white/75 px-3 text-sm font-bold text-rose-800 hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-rose-600"
          >
            <LogOut aria-hidden="true" size={17} /> Đăng xuất
          </button>
        </div>
      </div>
      <Toast containerId={PROFILE_TOAST_ID} />
    </dialog>
  );
}
