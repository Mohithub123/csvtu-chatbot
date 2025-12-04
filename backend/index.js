// backend/index.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";


import { scrapeUTDPrograms } from "./scrapers/utdProgramsScraper.js";
import { scrapeProgramsAndSchemes } from "./scrapers/programsAndSchemesScraper.js";
import { scrapeUniversityAbout } from "./scrapers/universityAboutScraper.js";
import { scrapeVCMessage } from "./scrapers/vcMessageScraper.js";
import { scrapeUniversityValues } from "./scrapers/universityValuesScraper.js";
import { scrapeAcademicCouncil } from "./scrapers/academicCouncilScraper.js";
import { scrapeExecutiveCouncil } from "./scrapers/executiveCouncilScraper.js";
import { scrapeFinanceCommittee } from "./scrapers/financeCommitteeScraper.js";
import { scrapeUniversityAdministration } from "./scrapers/universityAdministrationScraper.js";
import { scrapeRTI } from "./scrapers/rtiScraper.js";
import { scrapeEngineeringColleges } from "./scrapers/affiliatedEngineeringScraper.js";
import { scrapeDiplomaAffiliates } from "./scrapers/diplomaAffiliatesScraper.js";
import { scrapeAffiliatedDiploma } from "./scrapers/affiliatedDiplomaScraper.js";
import { scrapeAffiliatedPharmacy } from "./scrapers/affiliatedPharmacyScraper.js";
import { scrapeAffiliatedBArch } from "./scrapers/affiliatedBArchScraper.js";
import { scrapeAffiliatedMBA } from "./scrapers/affiliatedMBAScraper.js";
import { scrapeAffiliatedMCA } from "./scrapers/affiliatedMCAScraper.js";
import { scrapeAffiliatedMTech } from "./scrapers/affiliatedMTechScraper.js";
import { scrapeCSVTUJournals } from "./scrapers/journalsScraper.js";          // currently only link handler uses URL
import { scrapeAdjunctProfessors } from "./scrapers/adjunctProfessorsScraper.js"; // imported for future data use
import { scrapeMoUs } from "./scrapers/mousScraper.js";                           // imported for future data use
import { scrapeTEQIP } from "./scrapers/teqipScraper.js";
import { scrapeContact } from "./scrapers/contactScraper.js";







dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

if (!API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing in the .env file");
}

// -----------------------------------------
// Helper: function to call Gemini API
// -----------------------------------------
async function askGemini(modelName, message) {
  const url = `${BASE_URL}/${modelName}:generateContent?key=${API_KEY}`;

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: message }],
        },
      ],
    }),
  });

  const data = await resp.json();
  console.log(
    `Gemini raw response (${modelName}):`,
    JSON.stringify(data, null, 2)
  );
  return { status: resp.status, data };
}

// ----------------------
// CSVTU UTD Programs API (direct JSON)
// ----------------------
app.get("/api/utd-programs", async (req, res) => {
  try {
    console.log("Scraping CSVTU UTD programs...");
    const data = await scrapeUTDPrograms();
    return res.json({
      source: "csvtu.utd.programs.and.schemes",
      ...data,
    });
  } catch (err) {
    console.error("UTD scraper error:", err);
    return res.status(500).json({
      error: "Failed to fetch UTD programs from CSVTU site.",
    });
  }
});

// ----------------------
// All Programs & Schemes API (whole CSVTU page)
// ----------------------
app.get("/api/programs-and-schemes", async (req, res) => {
  try {
    console.log("Scraping CSVTU Programs & Schemes page...");
    const data = await scrapeProgramsAndSchemes();
    return res.json({
      source: "csvtu.programs.and.schemes",
      ...data,
    });
  } catch (err) {
    console.error("Programs & Schemes scraper error:", err);
    return res.status(500).json({
      error: "Failed to fetch Programs & Schemes from CSVTU site.",
    });
  }
});

// ----------------------
// Main chat API endpoint (Hybrid)
// ----------------------
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        reply: "Please type a message before sending.",
      });
    }

    const userQuestion = message.trim();
    const lower = userQuestion.toLowerCase();
    const words = lower.split(/\s+/);

    // ============================
// VC NAME DIRECT LINK HANDLER
// ============================
const askVCName =
  (lower.includes("vc") || lower.includes("vice chancellor")) &&
  (lower.includes("name") || lower.includes("who is"));

if (askVCName) {
  return res.json({
    reply: `
Vice-Chancellor of CSVTU ✅

Dr. Arun Arora  
Vice-Chancellor  
Chhattisgarh Swami Vivekanand Technical University, Bhilai (C.G.)

Official Profile:
https://csvtu.ac.in/ew/honble-vice-chancellor/
`.trim(),
  });
}
// ================================
// CSVTU DIGIVARSITY / STUDENT PORTAL LINK HANDLER
// ================================
const askDigivarsity =
  lower.includes("digivarsity") ||       // correct spelling
  lower.includes("digi varsit") ||      // space / half typing
  lower.includes("digiversity") ||      // tum jo likh rahe ho
  lower.includes("digvarsity") ||       // common typo
  lower.includes("student portal") ||
  lower.includes("exam form") ||
  lower.includes("sem form") ||
  lower.includes("reset password") ||
  lower.includes("student login") ||
  lower.includes("csvtu login");

if (askDigivarsity) {
  return res.json({
    reply: `
CSVTU Digivarsity Student Portal (Official)

Use this portal for:
• Exam form  
• Student login  
• Admission enrollment  
• Password reset  
• Ph.D application  

Official Link:  
https://csvtu.digivarsity.online/CSVTU/index.aspx
`.trim(),
  });
}


// -----------------------------------------
// CSVTU E-LIBRARY LINK HANDLER
// -----------------------------------------
const askELibrary =
  lower.includes("e library") ||
  lower.includes("elibrary") ||
  lower.includes("e-library") ||
  lower.includes("library link") ||
  lower.includes("online library") ||
  lower.includes("digital library");

if (askELibrary) {
  return res.json({
    reply: `
CSVTU E-Library (Official) 📚

• Online resources aur ebook access guides (Kortex, Pearson, McGraw Hill, etc.).
• Students ke liye E-Library login button isi page par hai.
• Latest E-Library notices bhi yahi milte hain.

Direct official link:
https://csvtu.ac.in/ew/e-library/
`.trim(),
  });
}






    // --------------------------------
    // CSVTU RESULTS DIRECT LINK HANDLER
    // --------------------------------
    const askResults =
  lower.includes("result") ||
  words.includes("rt") ||
  words.includes("rv") ||
  words.includes("rrv") ||
  lower.includes("supply") ||
  lower.includes("supplementary") ||
  lower.includes("marksheet");

    if (askResults) {
      return res.json({
        reply: `
CSVTU Results Page (Official)

• RT / RV / RRV / Regular / Supplementary results are available here
• You can check your result directly by roll number
• This is the official university results page

👉 https://csvtu.ac.in/ew/results-rtrvrrv/

`.trim(),
      });
    }

    // --------------------------------
    // CSVTU EXAM TIME TABLE DIRECT LINK HANDLER
    // --------------------------------
    const askTimeTable =
      lower.includes("time table") ||
      lower.includes("timetable") ||
      lower.includes("exam time table") ||
      lower.includes("examination time table") ||
      lower.includes("date sheet") ||
      lower.includes("datesheet") ||
      lower.includes("exam date") ||
      lower.includes("exam schedule");

    if (askTimeTable) {
      return res.json({
        reply: `
CSVTU Examination Time Table (Official)

• Time tables for BE, B.Tech, Diploma, M.Tech, MBA, MCA, Pharmacy, etc.
• Click on the course name (blue bar) to see semester-wise time tables
• Latest / "New" time tables are also updated on this page

👉 https://csvtu.ac.in/ew/examination-time-table/
`.trim(),
      });
    }

    // --------------------------------
    // CSVTU ACADEMIC CALENDAR DIRECT LINK HANDLER
    // --------------------------------
    const askCalendar =
      lower.includes("academic calendar") ||
      (lower.includes("calendar") && lower.includes("academic")) ||
      lower.includes("semester calendar") ||
      lower.includes("session calendar") ||
      lower.includes("holiday list") ||
      lower.includes("exam calendar");

    if (askCalendar) {
      return res.json({
        reply: `
CSVTU Academic Calendar (Official)

• Semester-wise academic calendar
• Holidays, exam periods and session dates
• Available in downloadable PDF format

👉 https://csvtu.ac.in/ew/academic-calendar/
`.trim(),
      });
    }

    // --------------------------------
    // CSVTU EXAMINATION FORM DIRECT LINK HANDLER
    // --------------------------------
    const askExamForm =
      lower.includes("exam form") ||
      lower.includes("examination form") ||
      lower.includes("online exam form") ||
      lower.includes("online examination form") ||
      lower.includes("form fill") ||
      lower.includes("exam registration") ||
      lower.includes("exam application");

    if (askExamForm) {
      return res.json({
        reply: `
CSVTU Online Examination Form (Official)

• Students can fill the online exam form from this page
• Institutes also have their login links here
• Help line numbers and user manual are available

👉 https://csvtu.ac.in/ew/examination-form-2016/
`.trim(),
      });
    }

    // --------------------------------
    // CSVTU NOTICES DIRECT LINK HANDLER
    // --------------------------------
    const askNotices =
      lower.includes("notice") ||
      lower.includes("notices") ||
      lower.includes("latest notice") ||
      lower.includes("university notice") ||
      lower.includes("corrigendum") ||
      lower.includes("advertisement") ||
      lower.includes("vacancy") ||
      lower.includes("job notice");

    if (askNotices) {
      return res.json({
        reply: `
CSVTU Notices (Official)

• Latest university notices
• Job advertisements, corrigendum, exam related notices
• Notice PDFs can be downloaded

👉 https://csvtu.ac.in/ew/notices/
`.trim(),
      });
    }

    // --------------------------------
    // CSVTU TENDERS DIRECT LINK HANDLER
    // --------------------------------
    const askTenders =
      lower.includes("tender") ||
      lower.includes("tenders") ||
      lower.includes("tender notice") ||
      lower.includes("tender document") ||
      lower.includes("quotation") ||
      lower.includes("bid") ||
      lower.includes("e-tender");

    if (askTenders) {
      return res.json({
        reply: `
CSVTU Tenders (Official)

• All active university tenders
• Tender documents available for download
• Closing date and details are given for each tender

👉 https://csvtu.ac.in/ew/tenders/
`.trim(),
      });
    }

    // ---------------------------------------
// CSVTU NEWSLETTER DIRECT LINK HANDLER
// ---------------------------------------
const askNewsletter =
  lower.includes("newsletter") ||
  lower.includes("csvtu newsletter") ||
  lower.includes("news letter") ||
  lower.includes("pravah") ||
  lower.includes("csktu pravah") || // typo safety
  lower.includes("csvtu pravah");

if (askNewsletter) {
  return res.json({
    reply: `
CSVTU Newsletter – "प्रवाह" (Official)

• University newsletter issues (Pravah) in PDF form  
• Different editions with date & download option  
• Latest newsletter always appears at the top  

👉 https://csvtu.ac.in/ew/newsletter/
`.trim(),
  });
}


    // --------------------------------
    // CSVTU SENIORITY LIST DIRECT LINK HANDLER
    // --------------------------------
    const askSeniorityList =
      lower.includes("seniority list") ||
      (lower.includes("seniority") && lower.includes("csvtu"));

    if (askSeniorityList) {
      return res.json({
        reply: `
CSVTU Seniority List (Teaching / Non-Teaching)

👉 https://csvtu.ac.in/ew/seniority-list/
`.trim(),
      });
    }

    // --------------------------------
    // CSVTU MERIT LIST DIRECT LINK HANDLER
    // --------------------------------
    const askMeritList =
      lower.includes("merit list") || lower.includes("meritlist");

    if (askMeritList) {
      return res.json({
        reply: `
CSVTU Merit List (Different Sessions & Courses)

👉 https://csvtu.ac.in/ew/merit-list/
`.trim(),
      });
    }

    // --------------------------------
    // CSVTU CSDIE (Skill Development) DIRECT LINK HANDLER
    // --------------------------------
    const askCsdie =
      lower.includes("csdie") ||
      lower.includes("skill development") ||
      lower.includes("skill centre") ||
      lower.includes("skill center") ||
      lower.includes("informal education") ||
      lower.includes("certificate course") ||
      lower.includes("senior citizen course") ||
      lower.includes("charak bhawan") ||
      lower.includes("skill training");

    if (askCsdie) {
      return res.json({
        reply: `
Centre for Skill Development and Informal Education (CSDIE) – CSVTU

• Details of various skill-based training and certificate programs
• Courses for students, professionals and senior citizens
• Links for Charak Bhawan (UTD-4) and Raipur extension centre

👉 https://csvtu.ac.in/ew/centre-for-skill-development-and-informal-education-csdie/
`.trim(),
      });
    }

    // --------------------------------
    // CSVTU UTD MAIN PAGE DIRECT LINK HANDLER
    // --------------------------------
    const askUtdPage =
      lower.includes("utd") ||
      lower.includes("university teaching department") ||
      lower.includes("university teaching dept") ||
      lower.includes("utd bhilai") ||
      lower.includes("university teaching bhilai") ||
      lower.includes("utd courses") ||
      lower.includes("utd branch") ||
      lower.includes("utd department");

    if (askUtdPage) {
      return res.json({
        reply: `
CSVTU University Teaching Department (UTD) – Main Page

• UTD diploma, UG (B.Tech Honours) and PG (M.Tech / M.Plan) programs
• Each box opens the respective department/program page
• Starting point to explore all UTD Bhilai academic programs

👉 https://csvtu.ac.in/ew/university-teaching-department/
`.trim(),
      });
    }

    // --------------------------------
    // CSVTU CENTRALIZED PLACEMENT CELL (CPC) DIRECT LINK HANDLER
    // --------------------------------
    const askCPC =
      lower.includes("cpc") ||
      lower.includes("placement") ||
      lower.includes("placement cell") ||
      lower.includes("training and placement") ||
      lower.includes("internship") ||
      lower.includes("campus placement") ||
      lower.includes("company visiting");

    if (askCPC) {
      return res.json({
        reply: `
CSVTU Centralized Placement Cell (CPC)

• Official information about campus placements and internships
• Job notifications and placement drives
• Internship / hiring notices from companies
• Placement-related PDFs available

👉 https://csvtu.ac.in/ew/centralized-placement-cell-cpc/
`.trim(),
      });
    }

    // --------------------------------
    // CSVTU GRIEVANCE CELL DIRECT LINK HANDLER
    // --------------------------------
    const askGrievance =
      lower.includes("grievance") ||
      lower.includes("complaint") ||
      lower.includes("problem") ||
      lower.includes("issue") ||
      lower.includes("ragging") ||
      lower.includes("harassment") ||
      lower.includes("wrong result") ||
      lower.includes("marks issue") ||
      lower.includes("rechecking") ||
      lower.includes("error in marksheet");

    if (askGrievance) {
      return res.json({
        reply: `
CSVTU Grievance Cell (Online Complaint Form)

• For examination, result or college related problems
• Submit complaint online with details
• Option to upload supporting documents

👉 https://csvtu.ac.in/ew/grievance-cell/
`.trim(),
      });
    }

    // --------------------------------
    // CSVTU VICE-CHANCELLOR MESSAGE (TEXT FROM SCRAPER)
    // --------------------------------
    const askVCMessage =
      lower.includes("vice chancellor") ||
      lower.includes("vc message") ||
      lower.includes("message from vc") ||
      lower.includes("vc sir") ||
      lower.includes("arun arora");

    if (askVCMessage) {
      try {
        const vcData = await scrapeVCMessage();

        return res.json({
          reply: `
Message from Hon'ble Vice-Chancellor – CSVTU

${vcData.message}
`.trim(),
        });
      } catch (err) {
        console.error("VC message scrape error:", err);
        return res.json({
          reply:
            "Right now I am unable to fetch the Vice-Chancellor's message from the CSVTU website. Please try again later.",
        });
      }
    }

    // ---------------------------------------------
    // CSVTU ACADEMIC COUNCIL DATA HANDLER (TEXT ONLY)
    // ---------------------------------------------
    const askAcademicCouncil =
      lower.includes("academic council") ||
      lower.includes("council members") ||
      lower.includes("university council") ||
      lower.includes("academic committee") ||
      (lower.includes("csvtu") && lower.includes("council"));

    if (askAcademicCouncil) {
      try {
        const councilData = await scrapeAcademicCouncil();

        const listText =
          councilData.members && councilData.members.length
            ? councilData.members
                .map(
                  (m, idx) =>
                    `${idx + 1}. ${m.member} – ${m.role || "Member"}`
                )
                .join("\n")
            : "Members list could not be scraped at the moment.";

        return res.json({
          reply: `
CSVTU Academic Council – Members List

${listText}
`.trim(),
        });
      } catch (err) {
        console.error("Academic Council scrape error:", err);
        return res.json({
          reply:
            "Right now I am unable to fetch Academic Council data from the CSVTU website. Please try again later.",
        });
      }
    }

    // ---------------------------------------------
    // CSVTU EXECUTIVE COUNCIL DATA HANDLER (TEXT ONLY)
    // ---------------------------------------------
    const askExecutiveCouncil =
      lower.includes("executive council") ||
      lower.includes("executive committee") ||
      lower.includes("university executive") ||
      (lower.includes("csvtu") && lower.includes("executive"));

    if (askExecutiveCouncil) {
      try {
        const councilData = await scrapeExecutiveCouncil();

        const listText =
          councilData.members && councilData.members.length
            ? councilData.members
                .map(
                  (m, i) =>
                    `${i + 1}. ${m.member} – ${m.role || "Member"}`
                )
                .join("\n")
            : "Executive Council members list is currently not available.";

        return res.json({
          reply: `
CSVTU Executive Council – Members (Text Only)

${listText}
`.trim(),
        });
      } catch (err) {
        console.error("Executive Council scrape error:", err);
        return res.json({
          reply:
            "Right now I am unable to fetch Executive Council data from the CSVTU website. Please try again later.",
        });
      }
    }

    // ---------------------------------------------
    // CSVTU FINANCE COMMITTEE DATA HANDLER (TEXT ONLY)
    // ---------------------------------------------
    const askFinanceCommittee =
      lower.includes("finance committee") ||
      lower.includes("finance council") ||
      lower.includes("finance body") ||
      (lower.includes("csvtu") && lower.includes("finance"));

    if (askFinanceCommittee) {
      try {
        const financeData = await scrapeFinanceCommittee();

        const listText =
          financeData.members && financeData.members.length
            ? financeData.members
                .map(
                  (m, i) =>
                    `${i + 1}. ${m.member} – ${m.role || "Member"}`
                )
                .join("\n")
            : "Finance Committee members list is currently not available.";

        return res.json({
          reply: `
CSVTU Finance Committee – Members (Text Only)

${listText}
`.trim(),
        });
      } catch (err) {
        console.error("Finance Committee scrape error:", err);
        return res.json({
          reply:
            "Right now I am unable to fetch Finance Committee data from the CSVTU website. Please try again later.",
        });
      }
    }

    // ---------------------------------------------
    // CSVTU UNIVERSITY ADMINISTRATION DATA HANDLER (TEXT ONLY)
    // ---------------------------------------------
    const askAdministration =
      lower.includes("university administration") ||
      lower.includes("administration") ||
      lower.includes("admin staff") ||
      lower.includes("registrar") ||
      lower.includes("exam controller") ||
      lower.includes("controller of examination") ||
      lower.includes("cfo") ||
      lower.includes("public information officer") ||
      lower.includes("pio");

    if (askAdministration) {
      try {
        const adminData = await scrapeUniversityAdministration();

        const listText =
          adminData.admins && adminData.admins.length
            ? adminData.admins
                .map((a, i) => {
                  const emailPart = a.email ? ` | Email: ${a.email}` : "";
                  return `${i + 1}. ${a.name} – ${a.designation}${emailPart}`;
                })
                .join("\n")
            : "University administration list could not be fetched right now.";

        return res.json({
          reply: `
CSVTU University Administration – Key Officers

${listText}
`.trim(),
        });
      } catch (err) {
        console.error("University Administration scrape error:", err);
        return res.json({
          reply:
            "Right now I am unable to fetch University Administration data from the CSVTU website. Please try again later.",
        });
      }
    }

// -----------------------------------
// CSVTU CONTACT DETAILS LINK HANDLER
// -----------------------------------
const askContact =
  (lower.includes("contact") ||
    lower.includes("phone") ||
    lower.includes("helpline") ||
    lower.includes("email")) &&
  (lower.includes("csvtu") ||
    lower.includes("university") ||
    lower.includes("college"));

if (askContact) {
  return res.json({
    reply: `
CSVTU Official Contact Details 📞

• Full postal address
• Important phone numbers (Registrar, Exam, Result, Verification, Student Query, etc.)
• Official email IDs

Sab details yahan milenge (official Contact Us page):

https://csvtu.ac.in/ew/contact-us/
`.trim(),
  });
}



    // --------------------------------
    // CSVTU ORDINANCES & AMENDMENTS DIRECT LINK HANDLER
    // --------------------------------
    const askOrdinance =
      lower.includes("ordinance") ||
      lower.includes("ordinances") ||
      lower.includes("amendment") ||
      lower.includes("amendments") ||
      lower.includes("university rule") ||
      lower.includes("university rules") ||
      lower.includes("exam ordinance") ||
      lower.includes("admission ordinance") ||
      lower.includes("phd ordinance") ||
      lower.includes("mba ordinance") ||
      lower.includes("diploma ordinance") ||
      lower.includes("btech ordinance");

    if (askOrdinance) {
      return res.json({
        reply: `
CSVTU Ordinances & Amendments (Official Rules & Regulations)

• Rules for Admission, Examination, Degree, Diploma, PhD, MBA, M.Tech, etc.
• All ordinances are listed separately
• Each ordinance opens as a PDF
• Amendments are also listed ordinance-wise

👉 https://csvtu.ac.in/ew/the-university/ordinances/
`.trim(),
      });
    }

    // ---------------------------------------------
    // CSVTU UNIVERSITY VALUES HANDLER (TEXT ONLY)
    // Vision / Mission / Goal / Objectives
    // ---------------------------------------------
    const askValues =
      lower.includes("university values") ||
      lower.includes("csvtu values") ||
      lower.includes("values of csvtu") ||
      lower.includes("vision mission") ||
      lower.includes("vision & mission") ||
      (lower.includes("csvtu") && lower.includes("vision")) ||
      (lower.includes("csvtu") && lower.includes("mission")) ||
      (lower.includes("csvtu") && lower.includes("objectives"));

    if (askValues) {
      try {
        const v = await scrapeUniversityValues();

        return res.json({
          reply: `
CSVTU University Values

Vision:
${v.vision || "Vision section could not be scraped."}

Mission:
${v.mission || "Mission section could not be scraped."}

Goal:
${v.goal || "Goal section could not be scraped."}

Objectives:
${v.objectives || "Objectives section could not be scraped."}
`.trim(),
        });
      } catch (err) {
        console.error("University Values scrape error:", err);
        return res.json({
          reply:
            "Right now I am unable to fetch University Values (Vision/Mission) from the CSVTU website. Please try again later.",
        });
      }
    }

    // ---------------------------------------------
// CSVTU TEQIP-III (ABOUT + OBJECTIVES) DATA HANDLER
// ---------------------------------------------
const askTEQIP =
  lower.includes("teqip") ||
  lower.includes("teqip iii") ||
  lower.includes("teqip-iii") ||
  lower.includes("about teqip") ||
  lower.includes("teqip 3");

if (askTEQIP) {
  try {
    const t = await scrapeTEQIP();

    const objText = (t.objectives || [])
      .map((o, i) => `${i + 1}. ${o}`)
      .join("\n");

    return res.json({
      reply: `
About TEQIP-III – CSVTU

About:
${t.about || "About section could not be fetched right now."}

Objectives:
${objText || "Objectives list could not be fetched right now."}
`.trim(),
    });
  } catch (err) {
    console.error("TEQIP-III scrape error:", err);
    return res.json({
      reply:
        "Right now I am unable to fetch TEQIP-III details from the CSVTU website. Please try again later.",
    });
  }
}

// ---------------------------------
// AFFILIATED COLLEGES GENERIC QUERY HANDLER (CLEAN RESPONSE)
// ---------------------------------

const askAffiliatedGeneric =
  lower.includes("affiliated college") ||
  lower.includes("affiliated colleges") ||
  lower.includes("affiliated institute") ||
  lower.includes("affiliated institutes");

if (askAffiliatedGeneric) {
  return res.json({
    reply: `
Affiliated Colleges under CSVTU

CSVTU ke under kai category ke affiliated colleges aate hain:
• Engineering
• Diploma / Polytechnic
• Pharmacy
• MCA
• MBA
• M.Tech
• B.Arch

Exact colleges ki list ke liye aise pucho:
- "CSVTU engineering colleges list"
- "CSVTU diploma colleges list"
- "CSVTU pharmacy colleges list"
- "CSVTU MCA colleges list"
- "CSVTU MBA colleges list"
- "CSVTU M.Tech colleges list"
- "CSVTU B.Arch colleges list"

Main tumhe category-wise verified list dikha sakta hoon.
`.trim(),
  });
}


    // --------------------------------
    // CSVTU ABOUT UNIVERSITY (SHORT CLEAN TEXT)
    // --------------------------------
    const askAboutUniversity =
      lower.includes("about csvtu") ||
      lower.includes("about university") ||
      lower.includes("csvtu history") ||
      lower.includes("university overview") ||
      lower.includes("about college") ||
      lower.includes("csvtu information") ||
      lower.includes("about csmtu");

    if (askAboutUniversity) {
      return res.json({
        reply: `
About CSVTU (Chhattisgarh Swami Vivekanand Technical University)

• CSVTU is the State Government Technical University of Chhattisgarh.  
• Main campus is at Newai, Bhilai (District Durg), Chhattisgarh.  
• It offers education and research in Engineering, Technology, Architecture, Pharmacy, Management, MCA and Diploma programmes.  
• Large number of Engineering, Diploma, Pharmacy, MBA, MCA and M.Tech colleges in Chhattisgarh are affiliated to CSVTU.  
• The University Teaching Department (UTD) at Bhilai runs B.Tech (Honours), M.Tech / M.Plan and Diploma programmes with a focus on quality technical education.
        `.trim(),
      });
    }


    // ---------------------------------------------
    // CSVTU AFFILIATED DIPLOMA COLLEGES DATA HANDLER
    // ---------------------------------------------
    const askAffDiploma =
      lower.includes("diploma college") ||
      lower.includes("polytechnic college") ||
      lower.includes("diploma institutes") ||
      lower.includes("affiliated diploma") ||
      lower.includes("polytechnic list") ||
      lower.includes("diploma ke college") ||
      lower.includes("polytechnic ke college");

    if (askAffDiploma) {
      try {
        const d = await scrapeAffiliatedDiploma();

        const sampleLines = (d.diploma || [])
          .slice(0, 6)
          .map((row) => `• ${row.name} – ${row.district}`)
          .join("\n");

        return res.json({
          reply: `
CSVTU Affiliated Diploma / Polytechnic Colleges

• Full-time diploma institutes: ${d.diplomaCount}
• Diploma part-time institutes: ${d.diplomaPartTimeCount}
• Diploma vocational institutes: ${d.diplomaVocationalCount}

Some example diploma colleges:
${sampleLines || "List could not be loaded."}

You can ask for a specific district like:
"CSVTU diploma colleges in Durg" or
"Polytechnic colleges in Raipur".
`.trim(),
        });
      } catch (err) {
        console.error("Diploma affiliates scrape error:", err);
        return res.json({
          reply:
            "Right now I am unable to fetch diploma affiliated colleges data from the CSVTU website. Please try again later.",
        });
      }
    }

    // ---------------------------------------------
    // CSVTU AFFILIATED PHARMACY COLLEGES DATA HANDLER
    // ---------------------------------------------
    const askAffPharmacy =
      lower.includes("pharmacy college") ||
      lower.includes("b pharm college") ||
      lower.includes("b.pharm college") ||
      lower.includes("d pharm college") ||
      lower.includes("d.pharm college") ||
      lower.includes("m pharm college") ||
      lower.includes("pharmacy ke college") ||
      lower.includes("affiliated pharmacy");

    if (askAffPharmacy) {
      try {
        const p = await scrapeAffiliatedPharmacy();

        const sampleDiploma = (p.diplomaPharm || [])
          .slice(0, 4)
          .map((row) => `• ${row.name} – ${row.district}`)
          .join("\n");

        const sampleBachelor = (p.bachelorPharm || [])
          .slice(0, 4)
          .map((row) => `• ${row.name} – ${row.district}`)
          .join("\n");

        return res.json({
          reply: `
CSVTU Affiliated Pharmacy Colleges

• Diploma Pharmacy institutes: ${p.diplomaPharmCount}
• Bachelor of Pharmacy (B.Pharm) institutes: ${p.bachelorPharmCount}
• Master of Pharmacy (M.Pharm) institutes: ${p.masterPharmCount}

Some Diploma Pharmacy colleges:
${sampleDiploma || "- Data could not be loaded"}

Some B.Pharm colleges:
${sampleBachelor || "- Data could not be loaded"}

You can ask:
"Show B.Pharm colleges in Raipur"
or "D.Pharm colleges in Durg".
`.trim(),
        });
      } catch (err) {
        console.error("Pharmacy affiliates scrape error:", err);
        return res.json({
          reply:
            "Right now I am unable to fetch pharmacy affiliated colleges data from the CSVTU website. Please try again later.",
        });
      }
    }

    // --------------------------------
    // CSVTU UTD M.Tech / B.Tech (Honours) DEPARTMENT LINK HANDLER
    // --------------------------------
    const askUtdDept =
      lower.includes("structural engineering") ||
      lower.includes("urban planning") ||
      lower.includes("environmental and water resources") ||
      lower.includes("water resources engineering") ||
      lower.includes("energy and environmental") ||
      lower.includes("biomedical engineering") ||
      lower.includes("bioinformatics") ||
      lower.includes("microelectronics") ||
      lower.includes("vlsi");

    if (askUtdDept) {
      // Structural Engineering
      if (lower.includes("structural engineering")) {
        return res.json({
          reply: `
UTD Department: Structural Engineering (M.Tech)

👉 https://csvtu.ac.in/ew/department-of-structural-engineering/
`.trim(),
        });
      }

      // Urban Planning
      if (lower.includes("urban planning")) {
        return res.json({
          reply: `
UTD Department: Urban Planning (M.Plan)

👉 https://csvtu.ac.in/ew/department-of-urban-planning/
`.trim(),
        });
      }

      // Environmental and Water Resources Engineering
      if (
        lower.includes("environmental and water resources") ||
        lower.includes("water resources engineering")
      ) {
        return res.json({
          reply: `
UTD Department: Environmental and Water Resources Engineering (M.Tech)

👉 https://csvtu.ac.in/ew/department-of-environmental-and-water-resources-engineering/
`.trim(),
        });
      }

      // Energy and Environmental Engineering
      if (lower.includes("energy and environmental")) {
        return res.json({
          reply: `
UTD Department: Energy and Environmental Engineering (M.Tech)

👉 https://csvtu.ac.in/ew/department-of-energy-and-environmental-engineering/
`.trim(),
        });
      }

      // Biomedical Engineering & Bioinformatics
      if (
        lower.includes("biomedical engineering") ||
        lower.includes("bioinformatics")
      ) {
        return res.json({
          reply: `
UTD Department: Biomedical Engineering & Bioinformatics (M.Tech)

👉 https://csvtu.ac.in/ew/department-of-biomedical-engineering-bioinformatics/
`.trim(),
        });
      }

      // Microelectronics and VLSI
      if (lower.includes("microelectronics") || lower.includes("vlsi")) {
        return res.json({
          reply: `
UTD Department: Microelectronics and VLSI (M.Tech)

👉 https://csvtu.ac.in/ew/department-of-microelectronics-and-vlsi/
`.trim(),
        });
      }
    }

    // ---------------------------------------
    // UTD INDUSTRIAL SAFETY & FIRE SAFETY HANDLER
    // ---------------------------------------
    const askUTDIndustrialFire =
      lower.includes("industrial safety utd") ||
      lower.includes("fire safety utd") ||
      lower.includes("utd fire safety") ||
      lower.includes("industrial safety csvtu") ||
      lower.includes("diploma in fire safety csvtu");

    if (askUTDIndustrialFire) {
      return res.json({
        reply: `
UTD – Diploma in Industrial Safety & Fire Safety Engineering (CSVTU Bhilai)

Official Page:
https://csvtu.ac.in/ew/university-teaching-department-industrial-safety-fire-safety-engineering/
`.trim(),
      });
    }

    // ---------------------------------------
    // B.TECH (HONOURS) HANDLER
    // ---------------------------------------
    const askBTechHonours =
      lower.includes("b tech honours") ||
      lower.includes("b.tech honours") ||
      lower.includes("btech honours") ||
      lower.includes("b.tech (honours)") ||
      lower.includes("btech (honours)") ||
      lower.includes("honours btech") ||
      lower.includes("csvtu honours");

    if (askBTechHonours) {
      return res.json({
        reply: `
CSVTU – B.Tech (Honours) Programmes

Available Courses:
• B.Tech (Honours) in Computer Science Engineering (Artificial Intelligence)
• B.Tech (Honours) in Computer Science Engineering (Data Science)
• B.Tech (Honours) in Civil Engineering

Official Page:
https://csvtu.ac.in/ew/b-tech-honours/
`.trim(),
      });
    }

    // --------------------------------
    // CSVTU UTD DIPLOMA MINING PAGE DIRECT LINK HANDLER
    // --------------------------------
    const askUtdDiplomaMining =
      lower.includes("utd diploma in mining") ||
      lower.includes("diploma in mining engineering") ||
      lower.includes("diploma mining utd") ||
      lower.includes("mining diploma utd bhilai") ||
      lower.includes("mining engineering diploma utd") ||
      lower.includes("utd mining department");

    if (askUtdDiplomaMining) {
      return res.json({
        reply: `
UTD Diploma in Mining Engineering – CSVTU Bhilai

• Official department page for Diploma in Mining Engineering  
• Vision, Mission, programme details and admission information  
• Key features, scheme, labs and PEOs / POs / PSOs  
• Faculty list with name, qualification, designation and contact  

👉 https://csvtu.ac.in/ew/university-teaching-department-diploma-in-mining-engineering/
`.trim(),
      });
    }

    // ------------------------------------------------------
    // CSVTU AFFILIATED B.ARCH COLLEGES DATA HANDLER
    // ------------------------------------------------------
    const askAffiliatedBArch =
      lower.includes("b arch college") ||
      lower.includes("b.arch college") ||
      lower.includes("architecture college") ||
      lower.includes("affiliated b arch") ||
      lower.includes("b arch list") ||
      lower.includes("b arch csvtu") ||
      lower.includes("architecture csvtu");

    if (askAffiliatedBArch) {
      try {
        const data = await scrapeAffiliatedBArch(); // { total, rows: [...] }

        const total = data.total || (data.rows ? data.rows.length : 0);

        let replyText = `
CSVTU Affiliated B.Arch Colleges (Architecture)

• Total B.Arch colleges: ${total || "N/A"}

Some example colleges:
`;

        (data.rows || [])
          .slice(0, 5)
          .forEach((row) => {
            replyText += `• ${row.instituteName} – ${row.district} (${row.address})\n`;
          });

        replyText += `
For complete B.Arch college list (full table):
https://csvtu.ac.in/ew/the-institute/b-arch/
`;

        return res.json({ reply: replyText.trim() });
      } catch (err) {
        console.error("Affiliated B.Arch scraper error:", err);
        return res.json({
          reply:
            "Right now I am unable to fetch B.Arch affiliated colleges data from the CSVTU website. Please try again later.",
        });
      }
    }

    // ------------------------------------------------------
    // CSVTU AFFILIATED MBA COLLEGES DATA HANDLER
    // ------------------------------------------------------
    const askAffiliatedMBA =
      lower.includes("mba college") ||
      lower.includes("affiliated mba") ||
      lower.includes("mba list") ||
      lower.includes("mba csvtu") ||
      lower.includes("management college csvtu");

    if (askAffiliatedMBA) {
      try {
        const data = await scrapeAffiliatedMBA(); // { total, fullTimeCount, partTimeCount, rows }

        const total = data.total || (data.rows ? data.rows.length : 0);

        let replyText = `
CSVTU Affiliated MBA Colleges

• Total MBA colleges: ${total || "N/A"}
${data.fullTimeCount ? `• Full-time MBA: ${data.fullTimeCount}` : ""}
${data.partTimeCount ? `• Part-time MBA: ${data.partTimeCount}` : ""}

Some example colleges:
`;

        (data.rows || [])
          .slice(0, 5)
          .forEach((row) => {
            replyText += `• ${row.instituteName} – ${row.district} (${row.address})\n`;
          });

        replyText += `
For complete MBA college list (full table):
https://csvtu.ac.in/ew/the-institute/mba/
`;

        return res.json({ reply: replyText.trim() });
      } catch (err) {
        console.error("Affiliated MBA scraper error:", err);
        return res.json({
          reply:
            "Right now I am unable to fetch MBA affiliated colleges data from the CSVTU website. Please try again later.",
        });
      }
    }

    // ------------------------------------------------------
    // CSVTU AFFILIATED MCA COLLEGES DATA HANDLER
    // ------------------------------------------------------
    const askAffiliatedMCA =
      lower.includes("mca college") ||
      lower.includes("affiliated mca") ||
      lower.includes("mca list") ||
      lower.includes("mca csvtu") ||
      lower.includes("computer application college");

    if (askAffiliatedMCA) {
      try {
        const data = await scrapeAffiliatedMCA(); // { total, rows }

        const total = data.total || (data.rows ? data.rows.length : 0);

        let replyText = `
CSVTU Affiliated MCA Colleges

• Total MCA colleges: ${total || "N/A"}

Some example colleges:
`;

        (data.rows || [])
          .slice(0, 5)
          .forEach((row) => {
            replyText += `• ${row.instituteName} – ${row.district} (${row.address})\n`;
          });

        replyText += `
For complete MCA college list (full table):
https://csvtu.ac.in/ew/the-institute/mca/
`;

        return res.json({ reply: replyText.trim() });
      } catch (err) {
        console.error("Affiliated MCA scraper error:", err);
        return res.json({
          reply:
            "Right now I am unable to fetch MCA affiliated colleges data from the CSVTU website. Please try again later.",
        });
      }
    }

    // ------------------------------------------------------
    // CSVTU AFFILIATED M.TECH / ME COLLEGES DATA HANDLER
    // ------------------------------------------------------
    const askAffiliatedMTech =
      lower.includes("m tech college") ||
      lower.includes("m.tech college") ||
      lower.includes("me m tech") ||
      lower.includes("me/m tech") ||
      lower.includes("affiliated m tech") ||
      lower.includes("m tech list") ||
      lower.includes("mtech csvtu");

    if (askAffiliatedMTech) {
      try {
        const data = await scrapeAffiliatedMTech(); // { total, fullTimeCount, partTimeCount, rows }

        const total = data.total || (data.rows ? data.rows.length : 0);

        let replyText = `
CSVTU Affiliated M.Tech / ME Colleges

• Total M.Tech/ME colleges: ${total || "N/A"}
${data.fullTimeCount ? `• Full-time M.Tech: ${data.fullTimeCount}` : ""}
${data.partTimeCount ? `• Part-time M.Tech: ${data.partTimeCount}` : ""}

Some example colleges:
`;

        (data.rows || [])
          .slice(0, 5)
          .forEach((row) => {
            replyText += `• ${row.instituteName} – ${row.district} (${row.address})\n`;
          });

        replyText += `
For complete M.Tech/ME college list (full table):
https://csvtu.ac.in/ew/the-institute/me-m-tech/
`;

        return res.json({ reply: replyText.trim() });
      } catch (err) {
        console.error("Affiliated M.Tech scraper error:", err);
        return res.json({
          reply:
            "Right now I am unable to fetch M.Tech / ME affiliated colleges data from the CSVTU website. Please try again later.",
        });
      }
    }

    // --------------------------------
    // CSVTU AFFILIATED DIPLOMA INSTITUTES DATA HANDLER (TEXT ONLY)
    // --------------------------------
    const askDiplomaAffiliates =
      lower.includes("diploma college list") ||
      lower.includes("diploma colleges") ||
      lower.includes("polytechnic colleges") ||
      lower.includes("affiliated diploma") ||
      lower.includes("diploma institute list") ||
      lower.includes("polytechnic list");

    if (askDiplomaAffiliates) {
      try {
        const data = await scrapeDiplomaAffiliates();

        const formatSection = (title, list) => {
          if (!list || list.length === 0) {
            return `${title}: (no rows scraped)\n`;
          }

          const lines = list.map((row, idx) => {
            const website = row.website || "website not given";
            return `${idx + 1}. ${row.name} — ${row.district} — ${website}`;
          });

          return `${title} (${list.length} institutes):\n` + lines.join("\n") + "\n";
        };

        return res.json({
          reply: `
Affiliated Diploma Institutes under CSVTU

Total Institutes: ${data.total}

${formatSection("Regular Diploma", data.regular)}
${formatSection("Diploma Part-Time", data.partTime)}
${formatSection("Diploma Vocational", data.vocational)}
`.trim(),
        });
      } catch (err) {
        console.error("Diploma affiliates scrape error:", err);
        return res.json({
          reply:
            "Right now I am unable to fetch Diploma affiliated institutes data from the CSVTU website. Please try again later.",
        });
      }
    }

    // --------------------------------------
    // CSVTU ENGINEERING COLLEGES DATA HANDLER
    // --------------------------------------
    const askEngineering =
      lower.includes("engineering college") ||
      lower.includes("engineering colleges") ||
      lower.includes("engineering institute") ||
      lower.includes("affiliated engineering") ||
      lower.includes("csvtu engineering") ||
      lower.includes("engineering list");

    if (askEngineering) {
      try {
        const engData = await scrapeEngineeringColleges();

        const list = engData.colleges
          .map(
            (c) =>
              `${c.sno}. ${c.name}\n   Location: ${c.district}\n   Address: ${c.address}`
          )
          .join("\n\n");

        return res.json({
          reply: `
CSVTU Affiliated Engineering Colleges

Total Engineering Institutes: ${engData.total}

${list}
`.trim(),
        });
      } catch (err) {
        console.error("Engineering scrape error:", err);
        return res.json({
          reply:
            "Right now I am unable to fetch the Engineering college list from the CSVTU website. Please try again later.",
        });
      }
    }

    // --------------------------------
    // CSVTU RTI OFFICERS DATA HANDLER (TEXT ONLY)
    // --------------------------------
    const askRTI =
      lower.includes("rti") ||
      lower.includes("right to information") ||
      lower.includes("information act") ||
      lower.includes("rti officer") ||
      lower.includes("public information officer") ||
      lower.includes("pio") ||
      lower.includes("appellate authority");

    if (askRTI) {
      try {
        const rtiData = await scrapeRTI();

        if (!rtiData.officers || rtiData.officers.length === 0) {
          return res.json({
            reply:
              "RTI officers data could not be fetched from the website right now. Please try again later.",
          });
        }

        const lines = rtiData.officers
          .map(
            (o, idx) =>
              `${idx + 1}. ${o.name}\n   • Designation: ${o.designation}\n   • Role under RTI: ${o.role}`
          )
          .join("\n\n");

        return res.json({
          reply: `
RTI (Right to Information Act 2005) – CSVTU Officers

${lines}
`.trim(),
        });
      } catch (err) {
        console.error("RTI scrape error:", err);
        return res.json({
          reply:
            "Right now I am unable to fetch RTI officers data from the CSVTU website. Please try again later.",
        });
      }
    }

    // ---------------------------------------
    // CSVTU JOURNALS DIRECT LINK HANDLER
    // ---------------------------------------
    const askJournals =
      lower.includes("csvtu journal") ||
      lower.includes("csvtu journals") ||
      lower.includes("research journal csvtu") ||
      lower.includes("csvtu international journal") ||
      lower.includes("ijbbb") ||
      lower.includes("csvtujournal");

    if (askJournals) {
      return res.json({
        reply: `
CSVTU Journals (Official Research Journals Portal)

• CSVTU Research Journal
• CSVTU International Journal of Biotechnology, Bioinformatics and Biomedical
• View current issues and submit research papers

👉 https://csvtujournal.in
`.trim(),
      });
    }

    // ---------------------------------------
    // CSVTU ADJUNCT PROFESSORS DIRECT LINK HANDLER
    // ---------------------------------------
    const askAdjunct =
      lower.includes("adjunct professor") ||
      lower.includes("adjunct faculty") ||
      lower.includes("international faculty") ||
      lower.includes("foreign faculty") ||
      lower.includes("visiting professor") ||
      lower.includes("csvtu international");

    if (askAdjunct) {
      return res.json({
        reply: `
Adjunct Professors (International Faculty – CSVTU)

• International professors associated with CSVTU
• Global academic collaborations
• Faculty profiles and affiliations

👉 https://csvtu.ac.in/ew/international-relations/
`.trim(),
      });
    }

    // ---------------------------------------
    // CSVTU MoUs DIRECT LINK HANDLER
    // ---------------------------------------
    const askMoUs =
      lower.includes("mou") ||
      lower.includes("mous") ||
      lower.includes("memorandum of understanding") ||
      lower.includes("international tie up") ||
      lower.includes("collaboration") ||
      lower.includes("csvtu mou");

    if (askMoUs) {
      return res.json({
        reply: `
CSVTU Memorandum of Understanding (MoUs)

• International university collaborations
• Academic partnerships
• Research tie-ups and MoUs

👉 https://csvtu.ac.in/ew/memorandum-of-understanding-mous/
`.trim(),
      });
    }

    // ---------------------------------------
    // CSVTU Ph.D INFORMATION DIRECT LINK HANDLER
    // ---------------------------------------
    const askPhDInfo =
      lower.includes("phd information") ||
      lower.includes("ph.d information") ||
      lower.includes("phd admission") ||
      lower.includes("phd notice") ||
      lower.includes("phd programme") ||
      lower.includes("phd program") ||
      lower.includes("r d c") ||
      lower.includes("rdc");

    if (askPhDInfo) {
      return res.json({
        reply: `
CSVTU Ph.D Information – Official Page

• Entrance test, RDC, interview and result
• Exempted / rejected / written test candidate lists
• Ph.D admission notices and related documents

👉 https://csvtu.ac.in/ew/research/phd-information/
`.trim(),
      });
    }

    // ---------------------------------------
    // CSVTU RESEARCH & DEVELOPMENT PROMOTIONAL SCHEMES LINK HANDLER
    // ---------------------------------------
    const askRDPS =
      lower.includes("research scheme") ||
      lower.includes("research and development scheme") ||
      lower.includes("rd scheme") ||
      lower.includes("research promotion") ||
      lower.includes("promotional scheme") ||
      lower.includes("research grant") ||
      lower.includes("development scheme");

    if (askRDPS) {
      return res.json({
        reply: `
CSVTU Research & Development Promotional Schemes

• Details for research proposal submissions
• Information about funding / promotional schemes
• R&D related official notices

👉 https://csvtu.ac.in/ew/research-development-promotional-schemes/
`.trim(),
      });
    }

    // --------------------------------
    // DIRECT PROGRAMS & SCHEMES LINK HANDLER
    // --------------------------------
    const askSchemePage =
      lower.includes("scheme") ||
      lower.includes("schemes") ||
      lower.includes("syllabus") ||
      lower.includes("curriculum") ||
      lower.includes("programs and schemes");

    if (askSchemePage) {
      const schemesUrl = "https://csvtu.ac.in/ew/programs-and-schemes/";

      return res.json({
        reply:
          `Official CSVTU "Programs and Schemes" page:\n` +
          `${schemesUrl}\n\n` +
          `From here you can open the latest scheme and syllabus for Diploma, B.Tech, BE, M.Tech, MBA, Pharmacy, etc.\n` +
          `• First click on your course (blue bar)\n` +
          `• Then select branch and open/download the Scheme/Syllabus PDF.`,
      });
    }

    // --------------------------------
    // Use UTD scraper data as extra context for Gemini answers
    // --------------------------------
    let utdContextText = "";
    let usedUtdData = false;

    const askPrograms =
      lower.includes("course") ||
      lower.includes("program") ||
      lower.includes("btech") ||
      lower.includes("b.tech") ||
      lower.includes("diploma") ||
      lower.includes("mtech") ||
      lower.includes("m.tech") ||
      lower.includes("utd");

    if (askPrograms) {
      try {
        const utdData = await scrapeUTDPrograms(); // live scrape

        const diplomaLines = (utdData.diploma || []).join("\n- ");
        const btechLines = (utdData.btech || []).join("\n- ");
        const mtechLines = (utdData.mtech || []).join("\n- ");

        utdContextText = `
CSVTU UTD PROGRAM DATA (from official website):

Diploma Programs:
- ${diplomaLines || "No items scraped"}

B.Tech (Honours) Programs:
- ${btechLines || "No items scraped"}

M.Tech / M.Plan Programs:
- ${mtechLines || "No items scraped"}
`;
        usedUtdData = true;
      } catch (err) {
        console.error("Error using UTD scraper inside chat:", err);
      }
    }

    // --------------------------------
    // Build prompt for Gemini (with optional UTD context)
    // --------------------------------
    const formattedMessage = `
You are a college enquiry chatbot for CSVTU UTD Bhilai.

If extra data about UTD programs is given, you MUST answer
only using that data. Do not invent new courses or seat numbers.

${usedUtdData ? utdContextText : ""}

Always answer in this format:
1. Short heading (1 line)
2. 3–6 bullet points
   - Each bullet max 1–2 short lines
   - Simple English, easy words
   - No very long paragraphs

User question: ${userQuestion}
`;

    const primaryModel = "gemini-2.5-flash";
    const fallbackModel = "gemini-2.0-flash-001";

    // Try primary model
    let { status, data } = await askGemini(primaryModel, formattedMessage);

    // Fallback to secondary model if needed
    if (
      data?.error &&
      (data.error.status === "UNAVAILABLE" ||
        data.error.status === "RESOURCE_EXHAUSTED" ||
        data.error.code === 503 ||
        data.error.code === 429)
    ) {
      console.warn("Primary model issue, trying fallback model:", data.error);

      const second = await askGemini(fallbackModel, formattedMessage);
      status = second.status;
      data = second.data;
    }

    // If still error, send user-friendly message
    if (data?.error) {
      console.error("Final Gemini API error:", data.error);

      let userMsg = "AI service is currently unavailable. Please try again later.";

      if (
        data.error.status === "RESOURCE_EXHAUSTED" ||
        data.error.code === 429
      ) {
        userMsg =
          "Free AI quota is temporarily exhausted. Please wait a bit and then try again.";
      }

      return res.status(200).json({ reply: userMsg });
    }

    // Extract text from successful Gemini response
    const parts = data.candidates?.[0]?.content?.parts || [];
    const text = parts.map((p) => p.text || "").join("\n").trim();

    if (!text) {
      return res.status(200).json({
        reply:
          "I did not receive any text reply from the AI model. Please try asking again.",
      });
    }

    return res.json({ reply: text });
  } catch (err) {
    console.error("Gemini Error (unexpected):", err);
    return res.status(200).json({
      reply:
        "Some unexpected error happened in the AI backend. Please try again later.",
    });
  }
});
// ----------------------
// Start server
// ----------------------
const PORT = process.env.PORT || 5000;   // 🔸 yahi line nayi hai

app.listen(PORT, () => {
  console.log(`✅ Gemini Backend Running on port ${PORT}`);
});
