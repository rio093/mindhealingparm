"use client";

import { useState, type FormEvent } from "react";
import Reveal from "./Reveal";
import { BLENDS, useLanding, type Blend } from "./LandingProvider";
import { track } from "@/lib/analytics";

/** 단일 설정 지점: Formspree 폼 ID로 교체 (https://formspree.io → New form) */
const FORM_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";

type Status = { kind: "idle" | "ok" | "err"; msg: string };

export default function Preorder() {
  const { blend, diag } = useLanding(); // 진단 결과를 구독
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle", msg: "" });

  // 사용자가 직접 고르기 전엔 진단 결과를 따라간다. 고르면 그 선택이 이긴다.
  // (effect로 상태를 미러링하지 않고 파생 — cascading render 없음)
  const [override, setOverride] = useState<Blend | "" | null>(null);
  const choice: Blend | "" = override ?? blend;

  // 파생: 입력하는 동안 제출 가능 여부가 바로 보인다
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = emailValid && !sending;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return; // in-flight 가드

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus({ kind: "err", msg: "올바른 이메일을 입력해주세요." });
      return;
    }
    if (FORM_ENDPOINT.includes("YOUR_FORM_ID")) {
      setStatus({
        kind: "err",
        msg: "폼 엔드포인트 미설정 — Preorder.tsx의 FORM_ENDPOINT를 Formspree 폼 ID로 교체하세요.",
      });
      return;
    }

    setSending(true);
    setStatus({ kind: "idle", msg: "" });
    try {
      const body = new FormData();
      body.append("email", email);
      body.append("blend", choice);
      body.append("diag", diag);
      body.append("_subject", "마음약방 사전주문 신청");

      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        const d = await res.json().catch(() => null);
        throw new Error(d?.errors?.[0]?.message ?? "전송 실패");
      }
      track("사전주문", { blend: choice || "none" });
      setEmail("");
      setStatus({ kind: "ok", msg: "신청 완료. 출시되면 이메일로 알려드릴게요." });
    } catch {
      setStatus({
        kind: "err",
        msg: "전송에 실패했어요. 잠시 후 다시 시도하거나 korrio093@gmail.com로 연락 주세요.",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <Reveal className="preorder" id="preorder">
      <div className="wrap preorder-inner">
        <div className="preorder-copy">
          <span className="eyebrow">사전 주문 · 출시 알림</span>
          <h2>먼저 받아보실 분</h2>
          <p>
            수량 한정 사전 주문. 이메일을 남겨주시면 진단 결과에 맞춘 향으로 준비해 알려드려요.
          </p>
        </div>

        <form className="preorder-form" onSubmit={onSubmit} noValidate>
          <div className="field">
            <label htmlFor="pf-email">이메일</label>
            <input
              id="pf-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="pf-blend">관심 향</label>
            <select
              id="pf-blend"
              name="blend"
              value={choice}
              onChange={(e) => setOverride(e.target.value as Blend | "")}
            >
              <option value="">진단 후 자동 선택</option>
              {(Object.keys(BLENDS) as Blend[]).map((k) => (
                <option value={k} key={k}>
                  {BLENDS[k].option}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary block" disabled={!canSubmit}>
            {sending ? "전송 중…" : "사전 주문 신청 →"}
          </button>

          <p className={`pf-msg ${status.kind === "ok" ? "ok" : status.kind === "err" ? "err" : ""}`} role="status" aria-live="polite">
            {status.msg}
          </p>
          <p className="pf-privacy">
            제출 시 출시 알림 목적의 이메일 수집에 동의합니다. 언제든 수신 거부 가능.
          </p>
        </form>
      </div>
    </Reveal>
  );
}
