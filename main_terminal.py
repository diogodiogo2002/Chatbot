import os
from dotenv import load_dotenv
from langchain_chroma import Chroma
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.chat_models import ChatOpenAI

# Carregar variáveis de ambiente
load_dotenv()
together_api_key = os.getenv("TOGETHER_API_KEY")

# Configurações
CHROMA_PATH = "chroma_db"
MODEL_NAME = "mistralai/Mistral-7B-Instruct-v0.1"

# Inicializar modelo de embeddings
embeddings_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Inicializar modelo LLM via Together
llm = ChatOpenAI(
    temperature=0.5,
    openai_api_key=together_api_key,
    openai_api_base="https://api.together.xyz/v1",
    model_name=MODEL_NAME
)

# Conectar ao ChromaDB
vector_store = Chroma(
    collection_name="example_collection",
    embedding_function=embeddings_model,
    persist_directory=CHROMA_PATH,
)

# Configurar retriever
retriever = vector_store.as_retriever(search_kwargs={'k': 5})

# Loop de chat
def chat_loop():
    print("🤖 Chatbot pronto! (digite 'sair' para encerrar)\n")


    while True:
        user_input = input("Você: ")
        if user_input.lower() in ["sair", "exit", "quit"]:
            print("Encerrando o chat. Até logo!")
            break

        # Obter conhecimento do retriever
        docs = retriever.invoke(user_input)
        knowledge = "\n\n".join([f"Fonte: {doc.metadata['source']}\n{doc.page_content}" for doc in docs])


        # Construir prompt com RAG
        rag_prompt = f"""
        You are an assistant which answers questions based solely on the information provided in "The knowledge" section.
        Do not use your internal knowledge.

        The question: {user_input}

        The knowledge: {knowledge}
        """

        # Resposta do modelo
        print("Bot():", end=" ", flush=True)
        full_response = ""
        for chunk in llm.stream(rag_prompt):
            print(chunk.content, end="", flush=True)
            full_response += chunk.content

        print("\n")
        

if __name__ == "__main__":
    chat_loop()

