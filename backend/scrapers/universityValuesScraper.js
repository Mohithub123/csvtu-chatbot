// backend/scrapers/universityValuesScraper.js

import axios from "axios";
import * as cheerio from "cheerio";

const VALUES_URL = "https://csvtu.ac.in/ew/the-university/university-values/";

// Helper: particular section (Vision / Mission / Goal / Objectives) ka text nikaalna
function extractSection($, container, keyword) {
  const heading = container
    .find("h1, h2, h3, h4")
    .filter((i, el) =>
      $(el).text().trim().toLowerCase().startsWith(keyword.toLowerCase())
    )
    .first();

  if (!heading.length) return "";

  const parts = [];
  let node = heading.next();

  // Heading ke baad ke saare p / li lete hain, next heading tak
  while (
    node.length &&
    !["h1", "h2", "h3", "h4"].includes((node[0].tagName || "").toLowerCase())
  ) {
    const text = $(node).text().trim();
    if (text) parts.push(text);
    node = node.next();
  }

  return parts
    .join("\n")
    .replace(/\u00A0/g, " ") // non-breaking space clean
    .replace(/\s+\n/g, "\n")
    .trim();
}

export async function scrapeUniversityValues() {
  const resp = await axios.get(VALUES_URL, { timeout: 15000 });
  const html = resp.data;

  const $ = cheerio.load(html);

  // Main content container – WordPress usually .entry-content / .post etc.
  const main =
    $(".entry-content").first() ||
    $(".post").first() ||
    $(".page").first() ||
    $("article").first();

  const vision = extractSection($, main, "Vision");
  const mission = extractSection($, main, "Mission");
  const goal = extractSection($, main, "Goal");
  const objectives = extractSection($, main, "Objectives");

  return {
    url: VALUES_URL,
    vision,
    mission,
    goal,
    objectives,
  };
}
