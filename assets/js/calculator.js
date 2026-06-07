const LANGUAGE_CONFIG = Object.freeze({
  ko: Object.freeze({
    unitsPerMinute: 300,
    subtitleCharacters: 18,
    longSentenceUnits: 45,
  }),
  en: Object.freeze({
    unitsPerMinute: 150,
    subtitleCharacters: 32,
    longSentenceUnits: 24,
  }),
});

const TARGET_SECONDS = Object.freeze([30, 45, 60]);

function countUnits(text, language) {
  if (language === "en") {
    return text.trim() ? text.trim().split(/\s+/u).length : 0;
  }

  return text.replace(/\s/gu, "").length;
}

export function estimateDuration(text, language, speed) {
  const config = LANGUAGE_CONFIG[language];
  const unitCount = countUnits(text, language);
  const seconds = (unitCount / config.unitsPerMinute) * 60;

  return Math.round(seconds / speed);
}

export function estimateSubtitleLines(text, language) {
  const config = LANGUAGE_CONFIG[language];
  const readableCharacters = text.replace(/\s/gu, "").length;

  return readableCharacters === 0
    ? 0
    : Math.ceil(readableCharacters / config.subtitleCharacters);
}

export function findLongSentences(text, language) {
  const config = LANGUAGE_CONFIG[language];
  const sentences = text
    .split(/(?<=[.!?。！？])|\n+/u)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  return sentences
    .filter(
      (sentence) =>
        countUnits(sentence, language) > config.longSentenceUnits,
    )
    .map((sentence) =>
      sentence.length > 74 ? `${sentence.slice(0, 74)}…` : sentence,
    );
}

export function formatDuration(seconds) {
  if (seconds < 60) {
    return `${seconds}초`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}분 ${remainingSeconds}초`;
}

function getTargetStatus(duration, target) {
  if (duration <= target) {
    return "fit";
  }

  if (duration <= Math.ceil(target * 1.1)) {
    return "close";
  }

  return "over";
}

export function analyzeScript(text, language, speed) {
  const duration = estimateDuration(text, language, speed);

  return {
    duration,
    formattedDuration: formatDuration(duration),
    subtitleLines: estimateSubtitleLines(text, language),
    longSentences: findLongSentences(text, language),
    unitCount: countUnits(text, language),
    targets: TARGET_SECONDS.map((target) => ({
      target,
      status: getTargetStatus(duration, target),
      difference: Math.abs(target - duration),
    })),
  };
}
