declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: Record<string, string> }) => void;
  }
}

/** Plausible 이벤트. 미설정이면 조용히 no-op. */
export function track(event: string, props?: Record<string, string>) {
  try {
    window.plausible?.(event, props ? { props } : undefined);
  } catch {
    /* 분석 실패가 UI를 막지 않는다 */
  }
}
