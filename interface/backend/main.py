import os
from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_openai import ChatOpenAI


load_dotenv()
together_api_key = os.getenv("TOGETHER_API_KEY")

# Configurações da localização da base de dados e do modelo
CHROMA_PATH = "chroma_db"
MODEL_NAME = "google/gemma-3n-E4B-it"

#Cria o modelo de embeddings e o modelo de linguagem
embeddings_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
llm = ChatOpenAI(
    temperature=0.0, # Temperatura 0 para respostas mais consistentes
    openai_api_key=together_api_key,
    openai_api_base="https://api.together.xyz/v1",
    model_name=MODEL_NAME
)

#Cria a base vetorial e transforma num retriever para consulta de documentos de 5 chunks
vector_store = Chroma(
    collection_name="example_collection",
    embedding_function=embeddings_model,
    persist_directory=CHROMA_PATH,
)
retriever = vector_store.as_retriever(search_kwargs={'k': 5})

app = FastAPI()

# Permitir CORS para o frontend (importante para comunicação)
#Integração da API com o frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, muda para o domínio da tua página web
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#Define a estrutura de dados para a requisição e resposta do chatbot
class ChatRequest(BaseModel):
    text: str

class ChatResponse(BaseModel):
    reply: str


#Recebe a pergunta do utilizador e responde com base nos documentos
def chatbot_respond(user_input: str) -> str:
    docs = retriever.invoke(user_input)
    #Junta os conteúdos dos documentos encontrados
    knowledge = "\n\n".join([f"Fonte: {doc.metadata['source']}\n{doc.page_content}" for doc in docs])

    #Cria o prompt do RAG, dizendo explicitamente ao modelo para responder apenas com base no conteúdo dos documentos.
    rag_prompt = f"""
    You are a strict assistant. You must only answer questions using the information explicitly found in the "Knowledge" section below.

    - If the answer is not present in the knowledge, reply with: "Desculpa, não encontrei essa informação nos documentos."
    - Do not use any of your own knowledge or make assumptions.
    - Do not translate, paraphrase or expand the content.
    - Only use what is explicitly written.

    The question: {user_input}

    The knowledge: {knowledge}
    """
    #Usa stream para receber a resposta em tempo real (chunk por chunk) do modelo e junta em full_response
    full_response = ""
    for chunk in llm.stream(rag_prompt):
        full_response += chunk.content
    return full_response

# Endpoint para receber perguntas do frontend e responder
@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    reply = chatbot_respond(request.text)
    return {"reply": reply}

