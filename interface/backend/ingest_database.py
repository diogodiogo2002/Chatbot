from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from uuid import uuid4
import os
import shutil
from tqdm import tqdm

# import the .env file
from dotenv import load_dotenv
load_dotenv()



# 
DATA_PATH = r"docs" #Localização da pasta com os documentos PDF
CHROMA_PATH = r"interface/backend/chroma_db" #Localização onde será criada a base de dados Chroma

#Remove a base de dados Chroma se já existir e cria uma nova

if os.path.exists(CHROMA_PATH):
    shutil.rmtree(CHROMA_PATH)
    print("Base de dados Chroma eliminada com sucesso.")
else:
    print("Pasta chroma_db não encontrada.")

# Inicia o modelo de embeddings
embeddings_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Inicia a base de dados Chroma
vector_store = Chroma(
    collection_name="example_collection",
    embedding_function=embeddings_model,
    persist_directory=CHROMA_PATH,
)

# Faz o load dos documentos PDF
loader = PyPDFDirectoryLoader(DATA_PATH)

raw_documents = loader.load()

print("Documentos carregados")

#Retorna uma lista de Document com page_content e metadata
for doc in raw_documents:
    doc.metadata["source"] = os.path.basename(doc.metadata["source"])
    doc.metadata["page"] = doc.metadata.get("page", 1)
# Divide o texto em chunks
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=300,
    chunk_overlap=100,
    length_function=len,
    is_separator_regex=False,
)


chunks = text_splitter.split_documents(raw_documents)
print("chunks criados")


# Cria ids unicos para cada chunk
uuids = [str(uuid4()) for _ in range(len(chunks))]

# Mostra barra de progresso ao adicionar os documentos
print("A adicionar documentos à base de dados Chroma...")
batch_size = 100
for i in tqdm(range(0, len(chunks), batch_size), desc="Carregando"):
    chunk_batch = chunks[i:i+batch_size]
    uuid_batch = uuids[i:i+batch_size]
    vector_store.add_documents(documents=chunk_batch, ids=uuid_batch)

print("✅ Base de dados Chroma criada com sucesso.")