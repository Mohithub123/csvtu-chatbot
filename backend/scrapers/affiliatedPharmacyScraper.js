// scrapers/affiliatedPharmacyScraper.js

import fetch from "node-fetch";
import * as cheerio from "cheerio";

const URL = "https://csvtu.ac.in/ew/the-institute/pharmacy/";

function parseTable($, tableEl) {
  const rows = [];

  if (!tableEl) return rows;

  $(tableEl)
    .find("tr")
    .slice(1)
    .each((i, tr) => {
      const tds = $(tr).find("td");
      if (tds.length < 5) return;

      const sno = $(tds[0]).text().trim();
      const instCode = $(tds[1]).text().trim();
      const name = $(tds[2]).text().trim();
      const address = $(tds[3]).text().trim();
      const district = $(tds[4]).text().trim();
      const website = tds[5] ? $(tds[5]).text().trim() : "";

      if (!name) return;
      rows.push({ sno, instCode, name, address, district, website });
    });

  return rows;
}

export async function scrapeAffiliatedPharmacy() {
  const resp = await fetch(URL);
  if (!resp.ok) {
    throw new Error(`Pharmacy page HTTP error: ${resp.status}`);
  }

  const html = await resp.text();
  const $ = cheerio.load(html);

  const tables = $("table").toArray();
  if (!tables.length) {
    throw new Error("Pharmacy tables not found on page");
  }

  // Order: 0 = Diploma Pharmacy, 1 = B.Pharm, 2 = M.Pharm
  const diploma = parseTable($, tables[0]);
  const bachelor = parseTable($, tables[1]);
  const master = parseTable($, tables[2]);

  return {
    diplomaPharmCount: diploma.length,
    bachelorPharmCount: bachelor.length,
    masterPharmCount: master.length,
    diplomaPharm: diploma,
    bachelorPharm: bachelor,
    masterPharm: master,
  };
}
