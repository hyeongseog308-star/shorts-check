import { analyzeScript } from "./calculator.js";

const form = document.querySelector("[data-calculator]");

if (form) {
  const scriptInput = form.querySelector("[data-script]");
  const languageInputs = form.querySelectorAll("[name='language']");
  const speedInputs = form.querySelectorAll("[name='speed']");
  const clearButton = form.querySelector("[data-clear]");
  const sampleButton = form.querySelector("[data-sample]");
  const durationOutput = document.querySelector("[data-duration]");
  const unitOutput = document.querySelector("[data-unit-count]");
  const subtitleOutput = document.querySelector("[data-subtitle-lines]");
  const targetOutput = document.querySelector("[data-targets]");
  const sentenceOutput = document.querySelector("[data-sentence-warnings]");

  const samples = {
    ko: "잠깐, 쇼츠 조회수가 안 나오는 이유를 아시나요? 첫 3초에 결론을 먼저 보여주세요. 시청자가 얻을 결과를 약속하고, 한 문장에는 한 가지 정보만 담아보세요. 마지막에는 저장하거나 다음 영상을 보게 만드는 짧은 행동 요청을 넣으면 됩니다.",
    en: "Stop scrolling. Here is why your Shorts lose viewers in the first three seconds. Lead with the result, keep one idea in each sentence, and finish with one clear action your audience can take.",
  };

  function getCheckedValue(name) {
    return form.querySelector(`[name='${name}']:checked`).value;
  }

  function targetMessage({ target, status, difference }) {
    if (status === "fit") {
      return `${difference}초 여유`;
    }

    if (status === "close") {
      return `${difference}초 초과 · 조금 줄여보세요`;
    }

    return `${difference}초 초과 · 압축이 필요해요`;
  }

  function renderTargets(targets) {
    targetOutput.innerHTML = targets
      .map(
        (target) => `
          <li class="fit-row fit-row--${target.status}">
            <span class="fit-time">${target.target}초</span>
            <strong>${targetMessage(target)}</strong>
          </li>
        `,
      )
      .join("");
  }

  function renderSentenceWarnings(sentences) {
    if (sentences.length === 0) {
      sentenceOutput.innerHTML =
        '<p class="empty-message">긴 문장이 없습니다. 호흡이 좋아요.</p>';
      return;
    }

    sentenceOutput.innerHTML = `
      <p class="warning-summary">${sentences.length}개의 긴 문장을 찾았습니다.</p>
      <ul class="warning-list">
        ${sentences.map((sentence) => `<li>${sentence}</li>`).join("")}
      </ul>
    `;
  }

  function updateResults() {
    const language = getCheckedValue("language");
    const speed = Number(getCheckedValue("speed"));
    const analysis = analyzeScript(scriptInput.value, language, speed);
    const unitLabel = language === "ko" ? "글자" : "단어";

    durationOutput.textContent = analysis.formattedDuration;
    unitOutput.textContent = `${analysis.unitCount.toLocaleString()} ${unitLabel}`;
    subtitleOutput.textContent = `${analysis.subtitleLines}줄`;
    renderTargets(analysis.targets);
    renderSentenceWarnings(analysis.longSentences);
  }

  scriptInput.addEventListener("input", updateResults);
  languageInputs.forEach((input) =>
    input.addEventListener("change", updateResults),
  );
  speedInputs.forEach((input) =>
    input.addEventListener("change", updateResults),
  );

  clearButton.addEventListener("click", () => {
    scriptInput.value = "";
    scriptInput.focus();
    updateResults();
  });

  sampleButton.addEventListener("click", () => {
    scriptInput.value = samples[getCheckedValue("language")];
    scriptInput.focus();
    updateResults();
  });

  updateResults();
}

const currentYear = document.querySelector("[data-current-year]");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}
