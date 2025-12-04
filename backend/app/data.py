responses = [
    {"intent": "welcomegreeting", "responses": [
        " Welcome to the chatbot! ",
        "Welcome to CSVTU College Enquiry Bot!"
    ]},
    {"intent": "hello", "responses": [
        "Hello! How can I assist you?",
        "Hi there! What would you like to know?"
    ]},
    {"intent": "about_csvtu", "responses": [
        "CSVTU is Chhattisgarh Swami Vivekanand Technical University, Bhilai—known for engineering, pharmacy, management and more.",
        "CSVTU UTD Bhilai offers a wide range of programs including engineering, technology, and pharmacy. What do you wish to know further?"
    ]},
    {"intent": "hi", "responses": [
        "Hello! Feel free to ask questions.",
        "Hi! How can I help you today?"
    ]},
    # Add more intents and responses as needed
]

related = [
    {"intent": "welcomegreeting", "related": ["hello", "about_csvtu"]},
    {"intent": "hello", "related": ["about_csvtu"]},
    {"intent": "about_csvtu", "related": ["programs", "admissions"]},
    {"intent": "hi", "related": ["hello", "about_csvtu"]},
    # Add related intents as needed
]
