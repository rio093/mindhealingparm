"use client";

import type { ReactNode } from "react";
import { track } from "@/lib/analytics";

/** 클릭이 Plausible로 집계되는 앵커. 서버 컴포넌트에서도 쓸 수 있게 분리. */
export default function CtaLink({
  href,
  className,
  loc,
  children,
}: {
  href: string;
  className?: string;
  loc: string;
  children: ReactNode;
}) {
  return (
    <a href={href} className={className} onClick={() => track("CTA", { loc })}>
      {children}
    </a>
  );
}
