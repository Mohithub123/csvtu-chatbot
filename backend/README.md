Project Title
AI Chatbot for College Handling and Student Queries

Description
This project is an AI-powered chatbot backend that helps colleges handle official and student-related queries. It is built with Python and designed to manage various tasks like admissions, contacts, institute information, and more.

Features
Handles student admission inquiries

Provides information via public relations officer module

Fetches data about college, diploma, and pharmacy institutes

Shares contact details and procedures

Includes multiple scrapers for different information sources

Installation
bash
# Install Python dependencies
pip install -r requirements.txt

# Start the backend server
python app.py
Usage
The chatbot can be integrated into college websites, Telegram, WhatsApp, or direct web applications.

All scraping logic is organized in the scrapers folder for different departments and institutes.

Configuration
Edit configuration files (config.py, config.json) to add your college’s details.

Folder Structure
text
├── scrapers/
│   ├── public_relations_officer.py
│   ├── ...
├── app.py
├── requirements.txt
└── README.md
Contributing
If you want to add new features, create a module or scraper and submit a pull request.

License
MIT License

Copyright (c) 2025 Mohit Chandravanshi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


Contact
For questions or issues, contact at [your email/discord/github link].