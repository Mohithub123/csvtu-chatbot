# FastAPI framework aur uske tools import kar rahe hain
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Uvicorn server ko import kar rahe hain
import uvicorn
import random

# Ab hum aapke original project ke modules ko import kar rahe hain
# Agar yeh files exist nahi karti, to error aayega
try:
    from models.interpreter import Interpreter
    
    # "app" ko "my_app" se badal diya gaya hai
    from my_app.greetings import get_updated_string
    from my_app.spelling_fix import correct_spelling
except ImportError as e:
    # Agar koi import error aata hai, to hum usko handle karenge
    print(f"Error importing a module: {e}")
    # Aap isko ek simple response de sakte hain ya aage badh sakte hain
    # Isse aapka server chalne se nahi rukega
    Interpreter = None
    data = None
    get_updated_string = lambda s: s
    correct_spelling = lambda s: s

# Yahan hum check kar rahe hain ki kya interpreter module import hua hai
__interpreter = None
if Interpreter:
    try:
        __interpreter = Interpreter.load_interpreter("new_stem")
        __interpreter.parse("hello")
    except Exception as e:
        print(f"Error loading interpreter: {e}")
        __interpreter = None

# Fast API application ka object bana rahe hain
app = FastAPI(
    title="CSVTUBOT",
    description="A College Enquiry Chat bot of CSVTU UTD Bhilai"
)

# CORS middleware add kar rahe hain
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
async def root():
    return {
        "status": 200,
        "message": "Chatbot Backend Running - Use /query/{your_message} or /direct/{intent}"
    }

# Query endpoint
@app.get("/query/{q}")
async def query(q: str):
    reply = {}
    if not __interpreter or not data:
        return {"status": 500, "message": "Backend components failed to load."}
    
    q = correct_spelling(q)
    try:
        klass = __interpreter.parse(q)
        response = ""
        for res in data.responses:
            if res["intent"] == klass:
                response = random.choice(res["responses"])
                if res["intent"] == "welcomegreeting":
                    response = get_updated_string(response)
                break
        related = []
        for rel in data.related:
            if rel["intent"] == klass:
                related = rel["related"]
                break
        reply = {
            "status": 200,
            "message": response,
            "related": related,
        }
    except Exception as e:
        reply = {
            "status": 400,
            "message" : str(e)
        }
    finally:
        return reply

# Direct endpoint
@app.get("/direct/{klass}")
async def direct(klass: str):
    if not data:
        return {"status": 500, "message": "Backend data not loaded."}
    
    response = ""
    related = []
    for res in data.responses:
        if res["intent"] == klass:
            response = random.choice(res["responses"])
            if res["intent"] == "welcomegreeting":
                response = get_updated_string(response)
            break
    for rel in data.related:
        if rel["intent"] == klass:
            related = rel["related"]
            break
    return {
        "status": 200,
        "message": response,
        "related": related,
    }

# 404 Not Found endpoint
@app.get("/{path:path}")
async def not_found_404(path: str):
    return {
        "status": 404,
        "message": f"Path{' '+path} not found on server!, please check the Endpoint",
    }
