import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

test("contact page uses the configured operator email", async () => {
  // Given
  const contactPage = await readFile("contact.html", "utf8");

  // When
  const emailLinks = [
    ...contactPage.matchAll(/mailto:([^?"\s]+)[^"]*">([^<]+)<\/a>/gu),
  ];

  // Then
  assert.deepEqual(emailLinks.map((match) => match.slice(1)), [
    ["hyeongseog308@gmail.com", "hyeongseog308@gmail.com"],
  ]);
  assert.doesNotMatch(contactPage, /YOUR_EMAIL|배포 전 확인/u);
});

test("segmented radio controls have native accessible group names", async () => {
  // Given
  const indexPage = await readFile("index.html", "utf8");
  const styles = await readFile("assets/css/styles.css", "utf8");

  // When
  const segmentedGroups = [
    ...indexPage.matchAll(
      /<fieldset class="control-group">[\s\S]*?<legend class="control-label">([^<]+)<\/legend>[\s\S]*?<div class="segmented-control">[\s\S]*?<\/div>[\s\S]*?<\/fieldset>/gu,
    ),
  ];

  // Then
  assert.deepEqual(
    segmentedGroups.map((match) => match[1]),
    ["대본 언어", "낭독 속도"],
  );
  assert.doesNotMatch(
    styles,
    /\.segmented-control input\s*\{[^}]*pointer-events:\s*none/gu,
  );
});

test("build emits the Cloudflare Pages static output in dist", async () => {
  // Given
  const expectedEntries = [
    "_headers",
    "about.html",
    "assets",
    "contact.html",
    "faq.html",
    "index.html",
    "privacy.html",
    "robots.txt",
    "sitemap.xml",
  ];

  // When
  await execFileAsync(process.execPath, ["scripts/build.mjs"]);
  const outputEntries = (await readdir("dist")).sort();

  // Then
  assert.deepEqual(outputEntries, expectedEntries);
});
