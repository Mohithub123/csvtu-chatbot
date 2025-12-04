from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import random
from app.data import responses, related

# Try-except me imports; agar missing ho to fallback define hoga
try:
    from models.interpreter import Interpreter
    
    from my_app.greetings import get_updated_string
    from my_app.spelling_fix import correct_spelling

except ImportError as e:
    print(f"Error importing a module: {e}")
    Interpreter = None
    responses = []
    related = []
    get_updated_string = lambda s: s
    correct_spelling = lambda s: s

# Interpreter object load karna
__interpreter = None
if Interpreter:
    try:
        __interpreter = Interpreter.load_interpreter("new_stem")
        __interpreter.parse("hello")
    except Exception as e:
        print(f"Error loading interpreter: {e}")
        __interpreter = None

# FastAPI app object
app = FastAPI(
    title="CSVTUBOT",
    description="A College Enquiry Chat bot of CSVTU UTD Bhilai"
)

# CORS settings
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

# Root Endpoint
@app.get("/")
async def root():
    return {
        "status": 200,
        "message": "Chatbot Backend Running - Use /query/{your_message} or /direct/{intent}"
    }

# Query Endpoint
@app.get("/query/{q}")
async def query(q: str):
    if not __interpreter or not responses:
        return {"status": 500, "message": "Backend components failed to load."}

    q = correct_spelling(q)
    try:
        klass = __interpreter.parse(q)
        response = ""
        for res in responses:
            if res["intent"] == klass:
                response = random.choice(res["responses"])
                if klass == "welcomegreeting":
                    response = get_updated_string(response)
                break
        related_items = []
        for rel in related:
            if rel["intent"] == klass:
                related_items = rel["related"]
                break
        return {
            "status": 200,
            "message": response,
            "related": related_items,
        }
    except Exception as e:
        return {
            "status": 400,
            "message": str(e)
        }

# Direct Endpoint
@app.get("/direct/{klass}")
async def direct(klass: str):
    if not responses:
        return {"status": 500, "message": "Backend data not loaded."}

    response = ""
    related_items = []
    for res in responses:
        if res["intent"] == klass:
            response = random.choice(res["responses"])
            if klass == "welcomegreeting":
                response = get_updated_string(response)
            break
    for rel in related:
        if rel["intent"] == klass:
            related_items = rel["related"]
            break

    return {
        "status": 200,
        "message": response,
        "related": related_items,
    }

# 404 Not Found Endpoint - Catch all other paths
@app.get("/{path:path}")
async def not_found_404(path: str):
    return {
        "status": 404,
        "message": f"Path '{path}' not found on server! Please check the endpoint.",
    }
