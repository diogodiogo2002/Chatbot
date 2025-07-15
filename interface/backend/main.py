# backend/main.py
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Permitir acesso do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ou coloca o teu domínio específico
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    text: str

@app.post("/chat")
async def chat(msg: Message):
    # Lógica do bot (resposta simples)
    if msg.text.lower() == "olá":
        reply = "Olá! Como estás? 👋"
    else:
        reply = "Desculpa, não percebi 🤖"
    return {"reply": reply}
