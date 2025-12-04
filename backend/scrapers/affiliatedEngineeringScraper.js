import fetch from "node-fetch";
import * as cheerio from "cheerio";


export async function scrapeEngineeringColleges() {
  const url = "https://csvtu.ac.in/ew/the-institute/engineering/";

  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);

  const results = [];

  $("table tbody tr").each((i, row) => {
    const cols = $(row).find("td");

    if (cols.length >= 6) {
      results.push({
        sno: $(cols[0]).text().trim(),
        code: $(cols[1]).text().trim(),
        name: $(cols[2]).text().trim(),
        address: $(cols[3]).text().trim(),
        district: $(cols[4]).text().trim(),
        website: $(cols[5]).text().trim()
      });
    }
  });

  return {
    total: results.length,
    colleges: results
  };
}
