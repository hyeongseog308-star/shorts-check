import test from "node:test";
import assert from "node:assert/strict";

import {
  analyzeScript,
  estimateDuration,
  estimateSubtitleLines,
  findLongSentences,
  formatDuration,
} from "../assets/js/calculator.js";

test("estimateDuration returns zero when the script is empty", () => {
  // Given
  const script = "   ";

  // When
  const duration = estimateDuration(script, "ko", 1);

  // Then
  assert.equal(duration, 0);
});

test("estimateDuration applies the selected Korean narration speed", () => {
  // Given
  const script = "가".repeat(300);

  // When
  const duration = estimateDuration(script, "ko", 1.5);

  // Then
  assert.equal(duration, 40);
});

test("estimateDuration counts English words rather than characters", () => {
  // Given
  const script = Array.from({ length: 150 }, () => "word").join(" ");

  // When
  const duration = estimateDuration(script, "en", 1);

  // Then
  assert.equal(duration, 60);
});

test("estimateSubtitleLines uses language-specific readable line lengths", () => {
  // Given
  const koreanScript = "가".repeat(36);
  const englishScript = "a".repeat(64);

  // When
  const koreanLines = estimateSubtitleLines(koreanScript, "ko");
  const englishLines = estimateSubtitleLines(englishScript, "en");

  // Then
  assert.equal(koreanLines, 2);
  assert.equal(englishLines, 2);
});

test("findLongSentences reports only Korean sentences over the threshold", () => {
  // Given
  const script = `짧은 문장입니다. ${"가".repeat(46)}.`;

  // When
  const warnings = findLongSentences(script, "ko");

  // Then
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /^가{20}/);
});

test("formatDuration shows minutes and seconds for longer scripts", () => {
  // Given
  const seconds = 74;

  // When
  const formatted = formatDuration(seconds);

  // Then
  assert.equal(formatted, "1분 14초");
});

test("analyzeScript returns fit statuses for all Shorts targets", () => {
  // Given
  const script = "가".repeat(225);

  // When
  const analysis = analyzeScript(script, "ko", 1);

  // Then
  assert.deepEqual(
    analysis.targets.map(({ target, status }) => ({ target, status })),
    [
      { target: 30, status: "over" },
      { target: 45, status: "fit" },
      { target: 60, status: "fit" },
    ],
  );
});
