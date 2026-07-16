"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type Blend = "a" | "b" | "c";

export const BLENDS: Record<Blend, { name: string; desc: string; option: string }> = {
  a: {
    name: "CALM BASIL — 정돈된 집중",
    desc: "베르가못·바질 결. 중요한 순간 전 한 박자 정돈하는 스위치.",
    option: "Calm Basil · 정돈된 집중",
  },
  b: {
    name: "CLEAR MINT — 또렷한 모드",
    desc: "자몽·페퍼민트 결. 생각을 또렷하게 정리하는 스위치.",
    option: "Clear Mint · 또렷한 모드",
  },
  c: {
    name: "ENERGY CITRUS — 산뜻한 리프레시",
    desc: "시트러스 결. 분위기를 가볍게 바꾸는 스위치.",
    option: "Energy Citrus · 산뜻한 리프레시",
  },
};

type LandingState = {
  /** 진단 결과 블렌드. 폼의 '관심 향'이 이걸 구독한다. */
  blend: Blend | "";
  /** 진단 원응답 — 폼 제출 시 함께 전송(검증 훅) */
  diag: string;
  setResult: (blend: Blend, diag: string) => void;
};

const Ctx = createContext<LandingState | null>(null);

export function LandingProvider({ children }: { children: ReactNode }) {
  const [blend, setBlend] = useState<Blend | "">("");
  const [diag, setDiag] = useState("");

  const value = useMemo<LandingState>(
    () => ({
      blend,
      diag,
      setResult: (b, d) => {
        setBlend(b);
        setDiag(d);
      },
    }),
    [blend, diag],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLanding() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLanding must be used inside <LandingProvider>");
  return ctx;
}
