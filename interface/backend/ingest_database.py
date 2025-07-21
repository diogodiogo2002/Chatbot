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


uuid_folder = next((f for f in os.listdir(CHROMA_PATH) if os.path.isdir(os.path.join(CHROMA_PATH, f))), None)
required_files = [
    "chroma.sqlite3",
]

index_required = [
    "data_level0.bin",
    "header.bin",
    "index_metadata.pickle",
    "length.bin",
    "link_lists.bin"
]

if os.path.exists(CHROMA_PATH):
    missing_main = [f for f in required_files if not os.path.exists(os.path.join(CHROMA_PATH, f))]
    
    if uuid_folder:
        uuid_path = os.path.join(CHROMA_PATH, uuid_folder)
        missing_index = [f for f in index_required if not os.path.exists(os.path.join(uuid_path, f))]
    else:
        missing_index = index_required  # Tudo está em falta se nem a pasta existir

    if not missing_main and not missing_index:
        print("✅ Base de dados Chroma criada com sucesso.")
    else:
        print("❌ A base de dados Chroma não foi criada corretamente.")
        if missing_main:
            print(f"  - Ficheiros principais em falta: {', '.join(missing_main)}")
        if missing_index:
            print(f"  - Ficheiros do índice em falta: {', '.join(missing_index)}")
        exit(1)
else:
    print("❌ A pasta da base de dados Chroma não existe.")
    exit(1)
