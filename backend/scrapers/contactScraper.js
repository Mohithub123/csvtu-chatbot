// scrapers/contactScraper.js

import axios from "axios";
import * as cheerio from "cheerio";

const CONTACT_URL = "https://csvtu.ac.in/ew/contact-us/";

export async function scrapeContact() {
  const { data: html } = await axios.get(CONTACT_URL, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
    },
  });

  const $ = cheerio.load(html);

  // Main content box
  const contentDiv = $(".span8, .post, .content").first();

  // Address: usually top paragraphs
  let address = "";
  const addrParas = contentDiv.find("p").slice(0, 2);
  if (addrParas.length) {
    address = addrParas
      .map((_, el) => $(el).text().trim())
      .get()
      .filter((t) => t.length > 0)
      .join("\n");
  }

  // All mail IDs on the page
  const emails = [];
  contentDiv.find('a[href^="mailto:"]').each((_, a) => {
    const mail = $(a).attr("href").replace("mailto:", "").trim();
    if (mail && !emails.includes(mail)) emails.push(mail);
  });

  // Phone numbers table
  const contacts = [];
  const table = contentDiv.find("table").first();
  table.find("tr").each((_, tr) => {
    const tds = $(tr).find("td");
    if (tds.length >= 2) {
      const purpose = $(tds[0]).text().trim();
      const phone = $(tds[1]).text().trim();
      if (purpose && phone) {
        contacts.push({ purpose, phone });
      }
    }
  });

  return {
    address,
    emails,
    contacts,
  };
}
