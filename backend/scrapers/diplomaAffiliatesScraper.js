// backend/scrapers/diplomaAffiliatesScraper.js

import fetch from "node-fetch";
import * as cheerio from "cheerio";

const URL = "https://csvtu.ac.in/ew/the-institute/diploma/";

function parseTable($, table) {
  const rows = [];

  $(table)
    .find("tr")
    .each((_, tr) => {
      const tds = $(tr)
        .find("td")
        .map((__, td) => $(td).text().trim())
        .get();

      // header / empty row skip
      if (tds.length < 3) return;

      const [sno, instCode, name, address, district, website, shift] = tds;

      rows.push({
        sno: sno || "",
        instCode: instCode || "",
        name: name || "",
        address: address || "",
        district: district || "",
        website: website || "",
        shift: shift || "",
      });
    });

  return rows;
}

export async function scrapeDiplomaAffiliates() {
  const resp = await fetch(URL);
  if (!resp.ok) {
    throw new Error(`Diploma page HTTP ${resp.status}`);
  }

  const html = await resp.text();
  const $ = cheerio.load(html);

  // Page par pehle 3 tables: Regular, Part-time, Vocational
  const tables = $("table").toArray();

  const regular = tables[0] ? parseTable($, tables[0]) : [];
  const partTime = tables[1] ? parseTable($, tables[1]) : [];
  const vocational = tables[2] ? parseTable($, tables[2]) : [];

  return {
    url: URL,
    total: regular.length + partTime.length + vocational.length,
    regular,
    partTime,
    vocational,
  };
}
