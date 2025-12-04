// backend/scrapers/affiliatedMCAScraper.js
import fetch from "node-fetch";
import * as cheerio from "cheerio";

const MCA_URL = "https://csvtu.ac.in/ew/the-institute/mca/";

function parseTable($, $table) {
  const rows = [];
  $table.find("tr").slice(1).each((_, tr) => {
    const tds = $(tr).find("td");
    if (tds.length < 5) return;

    const row = {
      sno: $(tds[0]).text().trim(),
      instCode: $(tds[1]).text().trim(),
      instituteName: $(tds[2]).text().trim(),
      address: $(tds[3]).text().trim(),
      district: $(tds[4]).text().trim(),
      website: tds[5] ? $(tds[5]).text().trim() : "",
    };
    if (row.instituteName) rows.push(row);
  });
  return rows;
}

export async function scrapeAffiliatedMCA() {
  const res = await fetch(MCA_URL);
  if (!res.ok) {
    throw new Error(`MCA page HTTP error: ${res.status}`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  const $table = $("table").first();
  const rows = parseTable($, $table);

  return {
    url: MCA_URL,
    total: rows.length,
    rows,
  };
}
