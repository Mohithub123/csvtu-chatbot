// scrapers/mousScraper.js
import fetch from "node-fetch";
import * as cheerio from "cheerio";

const MOU_URL = "https://csvtu.ac.in/ew/memorandum-of-understanding-mous/";

export async function scrapeMoUs() {
  const resp = await fetch(MOU_URL);
  if (!resp.ok) {
    throw new Error(
      `MoU page fetch error: ${resp.status} ${resp.statusText}`
    );
  }

  const html = await resp.text();
  const $ = cheerio.load(html);

  const description = $("p")
    .first()
    .text()
    .replace(/\s+/g, " ")
    .trim();

  const partners = [];

  // "MoU With ..." wale links/labels ko pick karo
  $("a:contains('MoU')").each((_, el) => {
    const text = $(el).text().replace(/\s+/g, " ").trim();
    const href = $(el).attr("href");
    partners.push({
      title: text,
      url: href ? new URL(href, MOU_URL).toString() : null,
    });
  });

  return {
    url: MOU_URL,
    description,
    partners,
  };
}
