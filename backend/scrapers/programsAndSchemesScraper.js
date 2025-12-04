// scrapers/programsAndSchemesScraper.js

import axios from "axios";
import * as cheerio from "cheerio";

const URL = "https://csvtu.ac.in/ew/programs-and-schemes/";

function cleanText(txt) {
  if (!txt) return "";
  return txt.replace(/\s+/g, " ").replace(/\u00A0/g, " ").trim();
}

function parseSection($, containerId, title) {
  const items = [];

  const box = $("#" + containerId);
  if (!box.length) {
    console.warn("Section not found:", containerId);
    return null;
  }

  box.find("p").each((i, el) => {
    const $p = $(el);
    const text = cleanText($p.clone().find("a").remove().end().text());

    const links = $p.find("a").map((i2, a) => {
      return {
        label: cleanText($(a).text()),
        url: $(a).attr("href"),
      };
    }).get();

    if (text || links.length > 0) {
      items.push({ branchName: text, links });
    }
  });

  return {
    title,
    count: items.length,
    items,
  };
}

export async function scrapeProgramsAndSchemes() {
  const resp = await axios.get(URL);
  const $ = cheerio.load(resp.data);

  const sections = [];

  const map = [
    ["e_d_politechnic_box", "Diploma in Engineering (Polytechnic)"],
    ["e_g_btech_box", "Bachelor of Technology (B.Tech)"],
    ["e_pg_me_box", "M.Tech / M.Plan"],
    ["management_mba_box", "MBA"],
    ["com_app_mca_box", "MCA"],
    ["pharm_gra_bpharm_box", "B.Pharm"],
    ["pharm_dip_dpharm_box", "D.Pharm"],
    ["pharm_pg_mpharm_box", "M.Pharm"],
    ["architecture_barch_box", "B.Arch"],
    ["phd_corse_work_box", "PhD Course Work"],
    ["bach_voc_box", "B.Voc"],
    ["dip_voc_box", "Diploma of Vocational"],
    ["d_ptdc_box", "Part Time Diploma (PTDC)"],
    ["d_e_poly_box", "Diploma (Old Schemes)"],
    ["e_g_be_box", "Bachelor of Engineering (BE)"]
  ];

  for (const [id, title] of map) {
    const sec = parseSection($, id, title);
    if (sec && sec.items.length > 0) {
      sections.push(sec);
    }
  }

  return {
    url: URL,
    sectionCount: sections.length,
    sections,
  };
}
