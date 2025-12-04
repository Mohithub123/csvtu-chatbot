// index.js
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json()); // To parse JSON requests

// This is the chatbot's API endpoint
app.post('/api/chatbot', (req, res) => {
    const userMessage = req.body.message;
    
    // Yahan par aap chatbot ka logic add karenge
    let botResponse = "I can't understand that. Please ask a different question.";

    if (userMessage.toLowerCase().includes('hi')) {
        botResponse = "Hello! How can I help you with college inquiries?";
    } else if (userMessage.toLowerCase().includes('fees')) {
        botResponse = "For information on fees, please visit the college website's admissions section.";
    }
    
    // Response ko frontend ko wapas bhejenge
    res.json({ reply: botResponse });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});