// backend/scrapers/executiveCouncilScraper.js

import axios from "axios";
import * as cheerio from "cheerio";

const EXECUTIVE_COUNCIL_URL =
  "https://csvtu.ac.in/ew/the-university/executive-council/";

export async function scrapeExecutiveCouncil() {
  const resp = await axios.get(EXECUTIVE_COUNCIL_URL, { timeout: 15000 });
  const html = resp.data;

  const $ = cheerio.load(html);
  const members = [];

  const table = $("table").first();

  if (table.length) {
    table
      .find("tr")
      .slice(1)
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
    source: "csvtu.executive.council",
    totalMembers: members.length,
    members,
  };
}
