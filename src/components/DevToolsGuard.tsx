"use client";

import { useEffect } from "react";

/** A client-side deterrent only; never use this as an authorization boundary. */
export default function DevToolsGuard() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;

    const overlay = document.createElement("div");
    overlay.setAttribute("role", "alertdialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "404 - Không tìm thấy trang");
    overlay.tabIndex = -1;
    Object.assign(overlay.style, {
      position: "fixed", inset: "0", zIndex: "2147483647",
      display: "grid", placeItems: "center", background: "white",
      color: "#111", fontFamily: "system-ui, sans-serif", textAlign: "center",
      padding: "24px", pointerEvents: "auto", touchAction: "none",
    });
    const heading = document.createElement("h1");
    heading.textContent = "404 - Không tìm thấy trang";
    overlay.append(heading);

    let blocked = false;
    let originalTitle = "";
    let previousFocus: HTMLElement | null = null;
    let resumeScroll: (() => void) | undefined;
    const inertStates = new Map<HTMLElement, boolean>();
    const overflowStates = new Map<HTMLElement, [string, string, string][]>();
    const makeInert = () => {
      for (const child of document.body.children) {
        if (!(child instanceof HTMLElement) || child === overlay) continue;
        if (!inertStates.has(child)) inertStates.set(child, child.inert);
        child.inert = true;
      }
    };
    // Include portals mounted by other components while the overlay is active.
    const bodyObserver = new MutationObserver(makeInert);
    const titleObserver = new MutationObserver(() => {
      if (blocked && document.title !== "404 Not Found") {
        originalTitle = document.title;
        document.title = "404 Not Found";
      }
    });

    function hide() {
      if (!blocked) return;
      blocked = false;
      bodyObserver.disconnect();
      titleObserver.disconnect();
      overlay.remove();
      document.title = originalTitle;
      for (const [element, inert] of inertStates) element.inert = inert;
      inertStates.clear();
      for (const [element, properties] of overflowStates) {
        for (const [name, value, priority] of properties) {
          element.style.removeProperty(name);
          if (value) element.style.setProperty(name, value, priority);
        }
      }
      overflowStates.clear();
      resumeScroll?.();
      resumeScroll = undefined;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    }

    function show() {
      if (blocked) return;
      blocked = true;
      originalTitle = document.title;
      previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      document.title = "404 Not Found";
      titleObserver.observe(document.head, { childList: true, subtree: true, characterData: true });
      for (const element of [document.documentElement, document.body]) {
        overflowStates.set(element, ["overflow", "overflow-x", "overflow-y"].map(name =>
          [name, element.style.getPropertyValue(name), element.style.getPropertyPriority(name)]));
        element.style.setProperty("overflow", "hidden", "important");
      }
      const lenis = window.__lenis;
      if (lenis && !lenis.isStopped) {
        lenis.stop();
        resumeScroll = () => { if (window.__lenis === lenis) lenis.start(); };
      }
      document.body.append(overlay);
      overlay.focus({ preventScroll: true });
      makeInert();
      bodyObserver.observe(document.body, { childList: true });
    }

    function check() {
      const sizeDetected = Math.abs(window.outerWidth - window.innerWidth) > 160
        || Math.abs(window.outerHeight - window.innerHeight) > 160;
      let debuggerDetected = false;
      try {
        const start = performance.now();
        new Function("debugger")();
        debuggerDetected = performance.now() - start > 100;
      } catch {
        // A strict CSP can prohibit Function(); keep the dimension check active.
      }
      if (sizeDetected || debuggerDetected) show();
      else hide();
    }

    function intercept(event: Event) {
      let shortcut = false;
      if (event instanceof KeyboardEvent) {
        const key = event.key.toLowerCase();
        // code also works when Option changes event.key on macOS.
        const letter = event.code.replace(/^Key/, "").toLowerCase();
        shortcut = key === "f12" || event.code === "F12"
          || (event.ctrlKey && event.shiftKey && ["i", "j", "c"].includes(letter || key))
          || (event.ctrlKey && (letter || key) === "u")
          || (event.metaKey && event.altKey && ["i", "j", "c", "u"].includes(letter || key));
      }
      if (blocked || shortcut || event.type === "contextmenu") {
        if (event.cancelable) event.preventDefault();
        event.stopImmediatePropagation();
      }
    }
    const events = [
      "keydown", "keypress", "keyup", "contextmenu", "pointerdown", "pointerup",
      "mousedown", "mouseup", "click", "dblclick", "auxclick", "wheel",
      "touchstart", "touchmove", "touchend", "dragstart", "drop", "submit", "beforeinput",
    ];
    for (const event of events) window.addEventListener(event, intercept, { capture: true, passive: false });
    const interval = window.setInterval(check, 500);
    check();

    return () => {
      window.clearInterval(interval);
      for (const event of events) window.removeEventListener(event, intercept, true);
      hide();
      bodyObserver.disconnect();
      titleObserver.disconnect();
    };
  }, []);

  return null;
}
