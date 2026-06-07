import { cp, mkdir, rm } from "node:fs/promises";

const outputDirectory = new URL("../dist/", import.meta.url);
const projectDirectory = new URL("../", import.meta.url);
const staticEntries = [
  "index.html",
  "about.html",
  "faq.html",
  "privacy.html",
  "contact.html",
  "assets",
  "robots.txt",
  "sitemap.xml",
  "_headers",
];

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

await Promise.all(
  staticEntries.map((entry) =>
    cp(
      new URL(entry, projectDirectory),
      new URL(entry, outputDirectory),
      { recursive: true },
    ),
  ),
);

console.log(`Built ${staticEntries.length} static entries in dist/.`);
