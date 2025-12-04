// backend/scrapers/rtiScraper.js

import fetch from "node-fetch";
import * as cheerio from "cheerio";

const URL = "https://csvtu.ac.in/ew/rti/";

/**
 * CSVTU RTI page se officers ka data scrape karta hai.
 * Table me jo 3 column hain: Name, Designation, Role
 */
export async function scrapeRTI() {
  const resp = await fetch(URL);

  if (!resp.ok) {
    throw new Error(`RTI page fetch failed, status: ${resp.status}`);
  }

  const html = await resp.text();
  const $ = cheerio.load(html);

  const officers = [];

  // First table ke rows read karo
  $("table tr").each((i, row) => {
    if (i === 0) return; // header skip

    const tds = $(row).find("td");
    if (tds.length < 3) return;

    officers.push({
      name: $(tds[0]).text().trim(),
      designation: $(tds[1]).text().trim(),
      role: $(tds[2]).text().trim(),
    });
  });

  return {
    url: URL,
    count: officers.length,
    officers,
  };
}
