import os
import json
from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
from deep_translator import GoogleTranslator

load_dotenv()
together_api_key = os.getenv("TOGETHER_API_KEY")

CHROMA_PATH = "chroma_db"
MODEL_NAME = "mistralai/Mistral-7B-Instruct-v0.3"

embeddings_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
llm = ChatOpenAI(
    temperature=0.0,
    openai_api_key=together_api_key,
    openai_api_base="https://api.together.xyz/v1",
    model_name=MODEL_NAME
)

vector_store = Chroma(
    collection_name="example_collection",
    embedding_function=embeddings_model,
    persist_directory=CHROMA_PATH,
)
retriever = vector_store.as_retriever(search_kwargs={'k': 10})

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    text: str

def generate_quiz(question: str, knowledge: str) -> list:
    prompt = f"""
Cria um quiz com 5 perguntas de escolha múltipla baseadas **apenas** na informação abaixo.
Cada pergunta deve ter 4 opções (A, B, C, D) e apenas uma resposta correta.
As perguntas devem estar escritas em português europeu.

Responde apenas no seguinte formato JSON:

[
    {{
        "question": "Exemplo de pergunta",
        "options": {{
            "A": "Opção A",
            "B": "Opção B",
            "C": "Opção C",
            "D": "Opção D"
        }},
        "correct_answer": "A"
    }},
    ...
]

Informação relevante:
{knowledge}
"""

    response = llm.invoke([HumanMessage(content=prompt)])
    quiz_text = response.content if hasattr(response, 'content') else str(response)

    try:
        quiz = json.loads(quiz_text)
        return quiz
    except Exception as e:
        print(f"⚠️ Erro ao processar o quiz: {e}")
        print("🔍 Conteúdo recebido:\n", quiz_text)
        return [{
            "question": "Erro ao gerar quiz. Tenta novamente.",
            "options": {
                "A": "", "B": "", "C": "", "D": ""
            },
            "correct_answer": ""
        }]

def get_knowledge(user_input: str) -> str:
    translated_query = GoogleTranslator(source='pt', target='en').translate(user_input)
    docs = retriever.invoke(translated_query)
    knowledge = "\n\n".join([doc.page_content for doc in docs])
    return knowledge

@app.post("/chat")
async def chat_endpoint(req: ChatRequest):
    user_text = req.text
    knowledge = get_knowledge(user_text)
    quiz = generate_quiz(user_text, knowledge)


    return {
        "reply": "Aqui está o quiz gerado com base na tua pergunta.",
        "quiz": quiz
    }



