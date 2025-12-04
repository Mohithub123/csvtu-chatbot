import fetch from "node-fetch";
import * as cheerio from "cheerio";


export async function scrapeFinanceCommittee() {
  const url = "https://csvtu.ac.in/ew/the-university/finance-council/";

  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);

  const members = [];

  $("table tr").each((i, row) => {
    const cols = $(row).find("td");

    if (cols.length >= 2) {
      const member = $(cols[0]).text().trim();
      const role = $(cols[1]).text().trim();

      if (member) {
        members.push({ member, role });
      }
    }
  });

  return { members };
}
