"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { EASE } from "@/lib/motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: "section" | "div";
  /** 화면에 처음 들어왔을 때 1회 (예: 카운트업 시작) */
  onEnter?: () => void;
  /** 자식을 순차로 등장시킬 때 */
  stagger?: boolean;
};

/** 스크롤 진입 모션. reduced-motion이면 모션 없이 즉시 표시. */
export default function Reveal({
  children,
  className = "",
  id,
  as = "section",
  onEnter,
  stagger = false,
}: Props) {
  const reduce = useReducedMotion();
  const M = as === "section" ? motion.section : motion.div;

  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: reduce
        ? { duration: 0 }
        : {
            duration: 0.55,
            ease: EASE,
            ...(stagger ? { staggerChildren: 0.09, delayChildren: 0.05 } : {}),
          },
    },
  };

  return (
    <M
      id={id}
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      onViewportEnter={() => onEnter?.()}
    >
      {children}
    </M>
  );
}

/** Reveal(stagger)의 자식으로 두면 순차 등장 */
export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: reduce ? 0 : 14 },
        show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.5, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  );
}
