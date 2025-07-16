from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from uuid import uuid4
import os
import shutil
# import the .env file
from dotenv import load_dotenv
load_dotenv()



# configuration
DATA_PATH = r"docs"
CHROMA_PATH = r"interface/backend/chroma_db"

if os.path.exists(CHROMA_PATH):
    shutil.rmtree(CHROMA_PATH)
    print("Base de dados Chroma eliminada com sucesso.")
else:
    print("Pasta chroma_db não encontrada.")

# initiate the embeddings model
embeddings_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# initiate the vector store
vector_store = Chroma(
    collection_name="example_collection",
    embedding_function=embeddings_model,
    persist_directory=CHROMA_PATH,
)

# loading the PDF document
loader = PyPDFDirectoryLoader(DATA_PATH)

raw_documents = loader.load()

for doc in raw_documents:
    doc.metadata["source"] = os.path.basename(doc.metadata["source"])

# splitting the document
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=300,
    chunk_overlap=100,
    length_function=len,
    is_separator_regex=False,
)

# creating the chunks
chunks = text_splitter.split_documents(raw_documents)

# creating unique ID's
uuids = [str(uuid4()) for _ in range(len(chunks))]

# adding chunks to vector store
vector_store.add_documents(documents=chunks, ids=uuids)