// backend/scrapers/academicCouncilScraper.js

import axios from "axios";
import * as cheerio from "cheerio";

const COUNCIL_URL =
  "https://csvtu.ac.in/ew/the-university/academic-council/";

export async function scrapeAcademicCouncil() {
  const resp = await axios.get(COUNCIL_URL, { timeout: 15000 });
  const html = resp.data;

  const $ = cheerio.load(html);

  // Pehla table hi Academic Council members ka hai
  const table = $("table").first();
  const members = [];

  if (table.length) {
    table
      .find("tr")
      .slice(1) // header row skip
      .each((i, row) => {
        const tds = $(row).find("td");
        if (tds.length >= 2) {
          const member = $(tds[0]).text().replace(/\s+/g, " ").trim();
          const role = $(tds[1]).text().replace(/\s+/g, " ").trim();
          if (member) {
            members.push({ member, role });
          }
        }
      });
  }

  return {
    url: COUNCIL_URL,
    count: members.length,
    members,
  };
}
