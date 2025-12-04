// scrapers/universityAboutScraper.js

import axios from "axios";
import * as cheerio from "cheerio";

// Yahi woh URL hona chahiye jahan About CSVTU likha hai
const ABOUT_URL = "https://csvtu.ac.in/ew/the-university/";

export async function scrapeUniversityAbout() {
  const { data: html } = await axios.get(ABOUT_URL, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
    },
  });

  const $ = cheerio.load(html);

  // Main content block (centre column)
  const contentDiv = $(".span8, .post, .content, #content").first();

  // Saare <p> collect kar lo
  const paragraphs = contentDiv.find("p");

  let aboutText = paragraphs
    .map((_, el) => $(el).text().trim())
    .get()
    .filter((t) => t.length > 0)
    .join("\n\n");

  // Safety: agar upar se bhi kuch na mila to pura body ka fallback
  if (!aboutText) {
    aboutText = $("body")
      .text()
      .replace(/\s+/g, " ")
      .trim();
  }

  if (!aboutText) {
    aboutText =
      "About section could not be scraped from the CSVTU website at this moment.";
  }

  return { about: aboutText };
}
