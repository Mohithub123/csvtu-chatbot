// scrapers/utdProgramsScraper.js

import axios from "axios";
import * as cheerio from "cheerio";

const UTD_URL =
  "https://csvtu.ac.in/ew/university-teaching-departmentprograms-and-schemes/";

// Helper: text ko clean karo
function cleanText(txt) {
  if (!txt) return "";
  return txt.replace(/\s+/g, " ").replace(/\u00A0/g, " ").trim();
}

// Helper: list ko filter + dedupe karo
function filterPrograms(rawList, keywords) {
  const result = [];
  const seen = new Set();

  for (let item of rawList) {
    const text = cleanText(item);
    if (!text) continue;

    // bahut lamba paragraph skip
    if (text.length > 200) continue;

    const lower = text.toLowerCase();
    const hasKeyword = keywords.some((k) => lower.includes(k));
    if (!hasKeyword) continue;

    if (seen.has(text)) continue;
    seen.add(text);
    result.push(text);
  }

  return result;
}

export async function scrapeUTDPrograms() {
  const resp = await axios.get(UTD_URL, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
    },
  });

  const $ = cheerio.load(resp.data);

  // Raw collection: saare headings + li items nikaal lo
  const allTexts = [];
  $("h1, h2, h3, h4, h5, h6, li, p, a").each((_, el) => {
    const t = cleanText($(el).text());
    if (t) allTexts.push(t);
  });

  // Ab teen category ke hisaab se filter
  const diplomaPrograms = filterPrograms(allTexts, ["diploma"]);
  const btechPrograms = filterPrograms(allTexts, [
    "b.tech",
    "b. tech",
    "btech",
    "honours",
  ]);
  const mtechPrograms = filterPrograms(allTexts, [
    "m.tech",
    "m. tech",
    "mtech",
    "m.plan",
    "m. plan",
  ]);

  return {
    diploma: diplomaPrograms,
    btech: btechPrograms,
    mtech: mtechPrograms,
  };
}
