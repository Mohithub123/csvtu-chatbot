// scrapers/teqipScraper.js

import axios from "axios";
import * as cheerio from "cheerio";

const TEQIP_URL = "https://csvtu.ac.in/ew/about-as/";

/**
 * Scrape About TEQIP-III page from CSVTU site.
 * Returns:
 *   {
 *     about: "long paragraph...",
 *     objectives: ["obj1", "obj2", ...]
 *   }
 */
export async function scrapeTEQIP() {
  const { data: html } = await axios.get(TEQIP_URL, {
    // Kabhi-kabhi site user-agent check karti hai
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
    },
  });

  const $ = cheerio.load(html);

  // Main content box ka selector usually ".span8" / ".entry" type hota hai
  // Is page par About TEQIP-III heading ke just niche paragraphs hain.
  let aboutText = "";
  let objectives = [];

  // About section: first few <p> tags inside content div
  const contentDiv = $(".span8, .post, .content").first();

  const paragraphs = contentDiv.find("p");
  if (paragraphs.length) {
    // First paragraph(s) ko join karke about bana do
    aboutText = paragraphs
      .slice(0, 3) // usually 2–3 paragraphs hote hain
      .map((_, el) => $(el).text().trim())
      .get()
      .filter((t) => t.length > 0)
      .join("\n\n");
  }

  // Objective section: <ul><li> list
  contentDiv
    .find("ul li")
    .each((_, li) => {
      const t = $(li).text().trim();
      if (t) objectives.push(t);
    });

  return {
    about: aboutText,
    objectives,
  };
}
