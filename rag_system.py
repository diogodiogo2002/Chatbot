import os
from langchain.document_loaders import TextLoader, CSVLoader, PyPDFLoader, JSONLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain.chains.retrieval_qa.base import RetrievalQA

from arquivo_ai import LocalAIClient


class RAGSystem:
    def __init__(self, folder_path):
        self.folder_path = folder_path
        self.ai_client = LocalAIClient()
        self.setup_rag()

    def setup_rag(self):
        # Carregar todos os documentos da pasta
        documents = []
        for filename in os.listdir(self.folder_path):
            file_path = os.path.join(self.folder_path, filename)
            if filename.endswith(".txt"):
                loader = TextLoader(file_path)
            elif filename.endswith(".csv"):
                loader = CSVLoader(file_path)
            elif filename.endswith(".pdf"):
                loader = PyPDFLoader(file_path)
            elif filename.endswith(".json"):
                loader = JSONLoader(file_path, jq_schema='.texto')  
            else:
                continue  # Ignora outros formatos
            try:
                docs = loader.load()
                documents.extend(docs)
                print(f"🔍 {len(docs)} documentos carregados de: {filename}")
            except Exception as e:
                print(f"❌ Erro ao carregar {filename}: {e}")

        print(f"😤 Total de documentos carregados: {len(documents)}")

        # Dividir documentos em chunks
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=512, chunk_overlap=50)
        self.texts = text_splitter.split_documents(documents)
        print(f"📄 {len(self.texts)} chunks criados.")

        # Criar banco vetorial com FAISS
        embedding = self.ai_client.get_embeddings()
        print("⏰ Criando banco de dados vetorial...")
        db = FAISS.from_documents(self.texts, embedding)
        self.retriever = db.as_retriever(search_kwargs={"k": 5})

        print("🔍 Banco de dados vetorial criado com sucesso!")

        self.question = RetrievalQA.from_chain_type(
            llm=self.ai_client.get_llm(),
            chain_type="stuff",
            retriever=self.retriever,
            return_source_documents=True
        )
        print("🤖 Sistema RAG configurado com sucesso!")

    def ask(self, question):
        result = self.question.invoke({"query": question})
        return {
            "answer": result["result"],
            "sources": [doc.metadata.get("source", "N/A") for doc in result["source_documents"]]
        }


if __name__ == "__main__":
    
    try:
        rag = RAGSystem("informacao.txt")
        print("✅ RAGSystem configurado com sucesso!")
    except Exception as e:
        print(f"❌ Erro ao configurar RAGSystem: {e}")





