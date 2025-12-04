// backend/scrapers/affiliatedMTechScraper.js
import fetch from "node-fetch";
import * as cheerio from "cheerio";

const MTECH_URL = "https://csvtu.ac.in/ew/the-institute/me-m-tech/";

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

export async function scrapeAffiliatedMTech() {
  const res = await fetch(MTECH_URL);
  if (!res.ok) {
    throw new Error(`M.Tech page HTTP error: ${res.status}`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  const $tables = $("table");
  const $mainTable = $tables.eq(0);
  const $partTimeTable = $tables.eq(1); // M.Tech Part-Time

  const fullTime = parseTable($, $mainTable);
  const partTime = $partTimeTable.length ? parseTable($, $partTimeTable) : [];

  const allRows = [...fullTime, ...partTime];

  return {
    url: MTECH_URL,
    fullTimeCount: fullTime.length,
    partTimeCount: partTime.length,
    total: allRows.length,
    fullTime,
    partTime,
    rows: allRows,
  };
}
