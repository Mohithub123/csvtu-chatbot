// backend/scrapers/affiliatedMBAScraper.js
import fetch from "node-fetch";
import * as cheerio from "cheerio";

const MBA_URL = "https://csvtu.ac.in/ew/the-institute/mba/";

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

export async function scrapeAffiliatedMBA() {
  const res = await fetch(MBA_URL);
  if (!res.ok) {
    throw new Error(`MBA page HTTP error: ${res.status}`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  const $tables = $("table");
  const $fullTimeTable = $tables.eq(0);
  const $partTimeTable = $tables.eq(1); // niche wala MBA Part-Time

  const fullTime = parseTable($, $fullTimeTable);
  const partTime = $partTimeTable.length ? parseTable($, $partTimeTable) : [];

  const allRows = [...fullTime, ...partTime];

  return {
    url: MBA_URL,
    fullTimeCount: fullTime.length,
    partTimeCount: partTime.length,
    total: allRows.length,
    fullTime,
    partTime,
    rows: allRows,
  };
}
