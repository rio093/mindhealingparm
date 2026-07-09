const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const quiz = document.querySelector("[data-quiz]");
const quizForm = document.querySelector("[data-quiz-form]");
const steps = Array.from(document.querySelectorAll("[data-step]"));
const stepLabel = document.querySelector("[data-step-label]");
const progress = document.querySelector("[data-progress]");
const prevButton = document.querySelector("[data-prev]");
const nextButton = document.querySelector("[data-next]");
const resultPanel = document.querySelector("[data-result]");
const restartButton = document.querySelector("[data-restart]");
const leadForm = document.querySelector("[data-lead-form]");
const formNote = document.querySelector("[data-form-note]");

let currentStep = 0;

const blends = {
  focus: {
    title: "포커스",
    copy: "차분하게 정돈된 나를 위한 향입니다. 중요한 발표 앞에서 말의 순서와 태도를 차례로 맞추고 싶을 때 어울립니다.",
    notes: "베르가못 · 일랑일랑 계열",
  },
  sharp: {
    title: "샤프",
    copy: "또렷하게 깨어있는 나를 위한 향입니다. 첫 콜이나 빠른 판단이 필요한 미팅 앞에 어울립니다.",
    notes: "자몽 · 페퍼민트 계열",
  },
};

const trackEvent = (name, payload = {}) => {
  const event = {
    name,
    payload,
    createdAt: new Date().toISOString(),
  };

  window.dispatchEvent(new CustomEvent("maumyakbang:event", { detail: event }));

  try {
    const stored = JSON.parse(localStorage.getItem("maumyakbang_events") || "[]");
    stored.push(event);
    localStorage.setItem("maumyakbang_events", JSON.stringify(stored.slice(-40)));
  } catch {
    // Local storage is optional for the static prototype.
  }
};

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 8);
};

const closeNav = () => {
  document.body.classList.remove("is-nav-open");
  navMenu?.classList.remove("is-open");
  navToggle?.setAttribute("aria-expanded", "false");
  navToggle?.setAttribute("aria-label", "메뉴 열기");
};

const updateQuiz = () => {
  steps.forEach((step, index) => {
    step.classList.toggle("is-active", index === currentStep);
  });

  if (stepLabel) {
    stepLabel.textContent = `${currentStep + 1} / ${steps.length}`;
  }

  if (progress) {
    progress.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
  }

  prevButton?.classList.toggle("is-visible", currentStep > 0);

  if (nextButton) {
    nextButton.textContent = currentStep === steps.length - 1 ? "결과 보기" : "다음";
    nextButton.disabled = !getCurrentAnswer();
  }
};

const getCurrentAnswer = () => {
  const activeFieldset = steps[currentStep];
  const checked = activeFieldset?.querySelector("input:checked");
  return checked?.value || "";
};

const getAnswers = () => {
  const data = new FormData(quizForm);
  return {
    situation: data.get("situation") || "unknown",
    state: data.get("state") || "unknown",
    scent: data.get("scent") || "unknown",
  };
};

const chooseBlend = ({ state, scent }) => {
  if (state === "focus" || state === "sharp") {
    return state;
  }

  if (scent === "fresh") {
    return "sharp";
  }

  return "focus";
};

const getSignal = ({ state, scent }) => {
  if (state === "unknown" || scent === "unknown") {
    return "응답 보류 신호";
  }

  const scentBlend = scent === "fresh" ? "sharp" : "focus";
  if (state !== scentBlend) {
    return "상태·향 선호 불일치";
  }

  return "상태 기준 추천";
};

const showResult = () => {
  const answers = getAnswers();
  const blendKey = chooseBlend(answers);
  const blend = blends[blendKey];

  quizForm.hidden = true;
  resultPanel.hidden = false;

  resultPanel.querySelector("[data-result-title]").textContent = blend.title;
  resultPanel.querySelector("[data-result-copy]").textContent = blend.copy;
  resultPanel.querySelector("[data-result-notes]").textContent = blend.notes;
  resultPanel.querySelector("[data-result-signal]").textContent = getSignal(answers);

  quiz?.classList.toggle("is-focus", blendKey === "focus");
  quiz?.classList.toggle("is-sharp", blendKey === "sharp");

  trackEvent("diagnosis_complete", {
    ...answers,
    result: blendKey,
    signal: getSignal(answers),
  });
};

const restartQuiz = () => {
  currentStep = 0;
  quizForm.reset();
  quizForm.hidden = false;
  resultPanel.hidden = true;
  quiz?.classList.remove("is-focus", "is-sharp");
  updateQuiz();
  trackEvent("diagnosis_restart");
};

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

navToggle?.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "메뉴 열기" : "메뉴 닫기");
  navMenu?.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("is-nav-open", !isOpen);
});

navMenu?.addEventListener("click", (event) => {
  const target = event.target;
  if (target instanceof HTMLAnchorElement) {
    closeNav();
  }
});

document.querySelectorAll("[data-track]").forEach((element) => {
  element.addEventListener("click", () => {
    trackEvent("cta_click", {
      id: element.getAttribute("data-track"),
      label: element.textContent.trim(),
    });
  });
});

quizForm?.addEventListener("change", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) {
    return;
  }

  trackEvent("diagnosis_answer", {
    step: currentStep + 1,
    name: target.name,
    value: target.value,
  });
  updateQuiz();
});

nextButton?.addEventListener("click", () => {
  if (!getCurrentAnswer()) {
    return;
  }

  if (currentStep < steps.length - 1) {
    currentStep += 1;
    updateQuiz();
    return;
  }

  showResult();
});

prevButton?.addEventListener("click", () => {
  if (currentStep === 0) {
    return;
  }

  currentStep -= 1;
  updateQuiz();
});

restartButton?.addEventListener("click", restartQuiz);

leadForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(leadForm);
  const email = String(data.get("email") || "").trim();

  if (!email || !email.includes("@")) {
    formNote.textContent = "이메일 형식을 다시 확인해 주세요.";
    formNote.classList.add("is-error");
    trackEvent("lead_invalid");
    return;
  }

  formNote.textContent = "등록되었습니다. 첫 생산 소식을 보내드릴게요.";
  formNote.classList.remove("is-error");
  leadForm.reset();
  trackEvent("lead_submit", { emailDomain: email.split("@").pop() });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

updateQuiz();
