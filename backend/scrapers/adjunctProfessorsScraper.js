// scrapers/adjunctProfessorsScraper.js
import fetch from "node-fetch";
import * as cheerio from "cheerio";

const ADJUNCT_URL = "https://csvtu.ac.in/ew/international-relations/";

export async function scrapeAdjunctProfessors() {
  const resp = await fetch(ADJUNCT_URL);
  if (!resp.ok) {
    throw new Error(
      `Adjunct Professors page fetch error: ${resp.status} ${resp.statusText}`
    );
  }

  const html = await resp.text();
  const $ = cheerio.load(html);

  const professors = [];

  // Kaafi generic approach: har <p> jisme "Prof." ho usko ek entry maan lo
  $("p:contains('Prof.')").each((_, el) => {
    const fullText = $(el).text().replace(/\s+/g, " ").trim();

    // name roughly first part upto comma
    let name = null;
    const m = fullText.match(/Prof\.[^,]+/i);
    if (m) name = m[0].trim();

    // Biodata link agar same parent ya next element me ho
    const container = $(el).parent();
    const biodataHref =
      container.find("a:contains('Biodata')").attr("href") ||
      $(el).nextAll("a:contains('Biodata')").first().attr("href") ||
      null;

    professors.push({
      name: name || fullText,
      details: fullText,
      biodataUrl: biodataHref ? new URL(biodataHref, ADJUNCT_URL).toString() : null,
    });
  });

  return {
    url: ADJUNCT_URL,
    professors,
  };
}
