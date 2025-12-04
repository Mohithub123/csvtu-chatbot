// scrapers/vcMessageScraper.js

import axios from "axios";
import * as cheerio from "cheerio";

const VC_URL = "https://csvtu.ac.in/ew/the-university/hvc-message/";

// Helper: text ko clean karo
function cleanText(txt) {
  if (!txt) return "";
  return txt.replace(/\s+/g, " ").replace(/\u00A0/g, " ").trim();
}

export async function scrapeVCMessage() {
  const resp = await axios.get(VC_URL, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36",
    },
  });

  const $ = cheerio.load(resp.data);

  // Page ka main content box dhoondho
  let container =
    $(".entry-content").first() ||
    $(".post").first() ||
    $(".page").first();

  if (!container || container.length === 0) {
    container = $("body");
  }

  const paragraphs = container
    .find("p")
    .map((i, el) => cleanText($(el).text()))
    .get()
    .filter(Boolean);

  const message = paragraphs.join("\n\n");

  return {
    url: VC_URL,
    paragraphs,
    message,
  };
}
