import os
from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_openai import ChatOpenAI
from deep_translator import GoogleTranslator
from fastapi.responses import JSONResponse
from langchain_core.messages import HumanMessage
import json


load_dotenv()
together_api_key = os.getenv("TOGETHER_API_KEY")

# Configurações da localização da base de dados e do modelo
CHROMA_PATH = "chroma_db"
MODEL_NAME = "mistralai/Mistral-7B-Instruct-v0.3"

# Inicia o modelo de embeddings
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
retriever = vector_store.as_retriever(search_kwargs={'k': 10})

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


def generate_suggestions(question:str, knowledge: str) -> list:
    prompt= f"""
    Based **only** on this information, suggest 3 related questions the user could ask next to get more details. The questions should be in European Portuguese and short, clear, and direct.

    User question:  
    {question}

    Relevant information:  
    {knowledge}

    Generate only 3 directly related questions, one per line, with no explanations.

    """
   

    response = llm.invoke([HumanMessage(content=prompt)])

    suggestions_text = response.content if hasattr(response, 'content') else response
    suggestions = [line.strip() for line in suggestions_text.split('\n') if line.strip()]
    return suggestions[:3]  # Limita a 3 sugestões



#Recebe a pergunta do utilizador e responde com base nos documentos
def chatbot_respond(user_input: str) -> dict:

    # Traduz de PT para EN
    translated_query = GoogleTranslator(source='pt', target='en').translate(user_input)

    docs = retriever.invoke(translated_query)
    
    #Junta os conteúdos dos documentos encontrados
    knowledge = "\n\n".join([f"Fonte: {doc.metadata['source']}\n{doc.page_content}" for doc in docs])

    sources = set()
    for doc in docs:
        src = doc.metadata.get("source", "Desconhecido")
        page = doc.metadata.get("page", "")
        if page:
            sources.add(f"{src} (página {page})")
        else:
            sources.add(f"{src}")

    #Cria o prompt do RAG, dizendo explicitamente ao modelo para responder apenas com base no conteúdo dos documentos.
    rag_prompt = f"""
    You are a strict assistant. You must only answer questions using the information explicitly found in the "Knowledge" section below.

    You must answer the user question using **only** the content found in the "Knowledge" section below.

    Rules:
    - Do not invent or add information.
    - Sumarize the information in a concise and clear manner.
    - Do not change the structure or tone; answer as directly as possible.
    - If the answer is not found, reply: "Desculpa, não encontrei essa informação nos documentos."
    - Your answer must be entirely in European Portuguese.
    - If the knowledge is in English, you must translate it faithfully to Portuguese.
    - Reply with clearly structured text, using paragraph breaks and lists where appropriate.
    The question: {user_input}

    The knowledge: {knowledge}
    """

    #Usa stream para receber a resposta em tempo real (chunk por chunk) do modelo e junta em full_response
    full_response = ""
    for chunk in llm.stream(rag_prompt):
        full_response += chunk.content

    if sources:
        info = "\n\n🔗 Fontes consultadas:\n" 

    info += "".join(f"{src}" for src in sources)


       
    related_suggestions = generate_suggestions(user_input,knowledge)
    
    return full_response , info, related_suggestions


# Endpoint para receber perguntas do frontend e responder
@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    reply , info, related_suggestions= chatbot_respond(request.text)
    return {"reply": reply, "info": info, "related_suggestions": related_suggestions}


