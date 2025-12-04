import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

async function listModels() {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    console.log("LIST MODELS RAW RESPONSE:\n");
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error listing models:", err);
  }
}

listModels();
