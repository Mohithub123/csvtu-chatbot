import { scrapeUTDPrograms } from "./scrapers/utdProgramsScraper.js";

async function test() {
  console.log("Scraping CSVTU UTD data...\n");

  const data = await scrapeUTDPrograms();

  console.log("DIPLOMA PROGRAMS:");
  console.log(data.diploma);

  console.log("\nB.TECH PROGRAMS:");
  console.log(data.btech);

  console.log("\nM.TECH / M.PLAN:");
  console.log(data.mtech);
}

test();
