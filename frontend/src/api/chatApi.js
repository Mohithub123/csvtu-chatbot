// frontend/src/api/chatApi.js

const BASE_URL = "http://localhost:5000";

export default class ChatApi {
  // User ke free text questions ke liye
  static async query_request(query) {
    try {
      const response = await fetch(`${BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: query }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json(); // { reply: "..." }

      // onDataReceived ke format me convert karo
      return {
        status: 200,
        message: data.reply,
        related: {}, // abhi khali, baad me suggestions add kar sakte ho
      };
    } catch (error) {
      console.error("Error in query_request:", error);
      return {
        status: 500,
        message: "Sorry! Something not feels Right. Please Try After Sometime",
        related: {},
      };
    }
  }

  // Buttons / welcome greeting ke liye
  static async direct_request(klass) {
    // "welcomegreeting" ke liye special prompt
    const prompt =
      klass === "welcomegreeting"
        ? "You are a helpful college enquiry chatbot for CSVTU UTD Bhilai. Greet the user briefly and tell them what kind of questions they can ask about courses, fees, admissions, and facilities. Keep it short and friendly."
        : klass;

    try {
      const response = await fetch(`${BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: prompt }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json(); // { reply: "..." }

      return {
        status: 200,
        message: data.reply,
        related: {},
      };
    } catch (error) {
      console.error("Error in direct_request:", error);
      return {
        status: 500,
        message: "Sorry! Something not feels Right. Please Try After Sometime",
        related: {},
      };
    }
  }
}
