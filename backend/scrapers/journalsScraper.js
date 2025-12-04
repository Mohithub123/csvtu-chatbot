// scrapers/journalsScraper.js
import fetch from "node-fetch";
import * as cheerio from "cheerio";

const JOURNAL_URL = "https://csvtujournal.in/";

function absolute(base, href) {
  if (!href) return null;
  if (href.startsWith("http")) return href;
  if (href.startsWith("//")) return "https:" + href;
  return new URL(href, base).toString();
}

export async function scrapeCSVTUJournals() {
  const resp = await fetch(JOURNAL_URL);
  if (!resp.ok) {
    throw new Error(
      `CSVTU Journals page fetch error: ${resp.status} ${resp.statusText}`
    );
  }

  const html = await resp.text();
  const $ = cheerio.load(html);

  const journals = [];

  // find headings that contain "Journal"
  $("h2, h3").each((_, el) => {
    const title = $(el).text().trim();
    if (!/journal/i.test(title)) return;

    const box = $(el).closest("div");

    const desc =
      box
        .find("p")
        .first()
        .text()
        .replace(/\s+/g, " ")
        .trim() || null;

    const viewLink = box.find('a:contains("View Journal")').attr("href");
    const currentIssueLink = box
      .find('a:contains("Current Issue")')
      .attr("href");

    journals.push({
      title,
      description: desc,
      viewUrl: absolute(JOURNAL_URL, viewLink),
      currentIssueUrl: absolute(JOURNAL_URL, currentIssueLink),
    });
  });

  return {
    url: JOURNAL_URL,
    journals,
  };
}
