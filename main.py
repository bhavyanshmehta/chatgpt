import os
import asyncio
import uuid
import PIL.Image
from fastapi import FastAPI, HTTPException, Request, Form, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
import database
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
genai.configure(api_key=os.environ.get("GEMINI_API_KEY", ""))
model = genai.GenerativeModel("gemini-2.5-flash")

app = FastAPI()

# Make sure uploads directory exists
UPLOAD_DIR = "static/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Mount the static directory
app.mount("/static", StaticFiles(directory="static"), name="static")

# Database initialization
database.init_db()

class ChatCreateRequest(BaseModel):
    title: str

@app.get("/", response_class=HTMLResponse)
async def read_root():
    index_path = os.path.join("static", "index.html")
    if not os.path.exists(index_path):
        return HTMLResponse(content="static/index.html not found", status_code=404)
    with open(index_path, "r") as f:
        html_content = f.read()
    return HTMLResponse(content=html_content, status_code=200)

@app.post("/api/chats")
async def create_new_chat(req: ChatCreateRequest):
    chat_id = database.create_chat(req.title)
    if chat_id:
         return {"id": chat_id, "title": req.title}
    raise HTTPException(status_code=500, detail="Could not create chat")

@app.get("/api/chats")
async def get_all_chats():
    return database.get_chats()

@app.get("/api/chats/{chat_id}")
async def get_chat_messages(chat_id: int):
    return database.get_messages(chat_id)

@app.post("/api/chats/{chat_id}/messages")
async def send_message(chat_id: int, content: str = Form(...), image: UploadFile = File(None)):
    image_path = None
    if image and image.filename:
        # Generate a unique filename
        filename = f"{uuid.uuid4()}_{image.filename}"
        image_path = os.path.join(UPLOAD_DIR, filename)
        with open(image_path, "wb") as f:
            f.write(await image.read())
            
    # Save user message
    database.add_message(chat_id, "user", content, image_path)
    
    try:
        # Load all messages for context
        past_msgs = database.get_messages(chat_id)
        
        history = []
        # exclude the very last user message from history because it will be passed to send_message
        for msg in past_msgs[:-1]: 
            role = "user" if msg["role"] == "user" else "model"
            parts = [msg["content"]]
            if msg.get("image_path") and os.path.exists(msg["image_path"]):
                parts.append(PIL.Image.open(msg["image_path"]))
            history.append({"role": role, "parts": parts})
        
        chat = model.start_chat(history=history)
        
        current_parts = [content]
        if image_path and os.path.exists(image_path):
            current_parts.append(PIL.Image.open(image_path))
            
        response = chat.send_message(current_parts)
        ai_response = response.text
        
    except Exception as e:
        ai_response = f"I'm having trouble connecting to my AI brain. Did you forget to set the GEMINI_API_KEY in the .env file? Details: {str(e)}"

    database.add_message(chat_id, "assistant", ai_response)
    
    return {"role": "assistant", "content": ai_response}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
