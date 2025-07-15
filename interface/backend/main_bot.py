import os
from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from langchain_chroma import Chroma
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.chat_models import ChatOpenAI

load_dotenv()
together_api_key = os.getenv("TOGETHER_API_KEY")

# Configurações
CHROMA_PATH = "chroma_db"
MODEL_NAME = "mistralai/Mistral-7B-Instruct-v0.1"

embeddings_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
llm = ChatOpenAI(
    temperature=0.5,
    openai_api_key=together_api_key,
    openai_api_base="https://api.together.xyz/v1",
    model_name=MODEL_NAME
)
vector_store = Chroma(
    collection_name="example_collection",
    embedding_function=embeddings_model,
    persist_directory=CHROMA_PATH,
)
retriever = vector_store.as_retriever(search_kwargs={'k': 5})

app = FastAPI()

# Permitir CORS para o frontend (importante para comunicação)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, muda para o domínio da tua página web
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    text: str

class ChatResponse(BaseModel):
    reply: str

def chatbot_respond(user_input: str) -> str:
    docs = retriever.invoke(user_input)
    knowledge = "\n\n".join([f"Fonte: {doc.metadata['source']}\n{doc.page_content}" for doc in docs])
    rag_prompt = f"""
    You are an assistant which answers questions based solely on the information provided in "The knowledge" section.
    Do not use your internal knowledge.

    The question: {user_input}

    The knowledge: {knowledge}
    """
    full_response = ""
    for chunk in llm.stream(rag_prompt):
        full_response += chunk.content
    return full_response

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    reply = chatbot_respond(request.text)
    return {"reply": reply}

