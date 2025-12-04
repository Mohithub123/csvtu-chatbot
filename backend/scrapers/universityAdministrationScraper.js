// backend/scrapers/universityAdministrationScraper.js

import fetch from "node-fetch";
import * as cheerio from "cheerio";


export async function scrapeUniversityAdministration() {
  const url = "https://csvtu.ac.in/ew/the-university/university-administration/";

  const resp = await fetch(url);
  const html = await resp.text();
  const $ = cheerio.load(html);

  const admins = [];

  // Table rows read karo (S.No, Name, Designation, Email)
  $("table tr").each((i, row) => {
    const tds = $(row).find("td");
    if (tds.length >= 3) {
      const name = $(tds[1]).text().trim();
      const designation = $(tds[2]).text().trim();
      const email = tds[3] ? $(tds[3]).text().trim() : "";

      if (name) {
        admins.push({ name, designation, email });
      }
    }
  });

  return { admins };
}
