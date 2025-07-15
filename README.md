
# 📚 RAG Chatbot com LangChain, FastAPI e Widget Web

Este projeto é um **chatbot com RAG (Retrieval-Augmented Generation)** que responde a perguntas baseando-se em documentos PDF carregados. O sistema utiliza **LangChain**, **ChromaDB**, **FastAPI** no backend, e um **widget simples em HTML/CSS/JS** no frontend.

---

## 🧠 Tecnologias Utilizadas

- **FastAPI** — API moderna e rápida para backend
- **LangChain** — Framework para RAG (Recuperação + Geração)
- **ChromaDB** — Base vetorial local para recuperação semântica
- **HuggingFace Transformers** — Modelo de embeddings
- **Together.ai API** — LLM Mistral-7B-Instruct para respostas
- **HTML/CSS/JavaScript** — Interface do widget

---

## 📁 Estrutura do Projeto

```
.
├── backend/
│   ├── ingest.py               # Indexação de documentos PDF
│   ├── main.py                 # Backend FastAPI com RAG
│   └── chroma_db/              # Base de dados vetorial persistente
├── docs/                       # PDF(s) a serem carregados
├── frontend/
│   ├── index.html              # Interface do widget
│   ├── style.css               # Estilos visuais
│   └── script.js               # Lógica do frontend
├── .env                        # Chave TOGETHER_API_KEY
├── README.md                   # Este ficheiro
```

---

## ⚙️ Instalação

### 1. Instalar dependências

```bash
pip install -r requirements.txt
```

**Exemplo de `requirements.txt`:**
```
fastapi
uvicorn
python-dotenv
langchain
langchain-community
langchain-chroma
sentence-transformers
together
```

### 2. Criar o ficheiro `.env`

Cria um ficheiro `.env` com a tua chave da API:

```
TOGETHER_API_KEY=sk-xxxxx
```

### 3. Colocar os PDFs

Coloca os teus documentos PDF dentro da pasta `docs/`.

### 4. Indexar os documentos

```bash
python backend/ingest.py
```

### 5. Iniciar o backend

```bash
uvicorn backend.main:app --reload
```

---

## 💬 Como Funciona

### Passo 1: Ingestão

O script `ingest.py`:
- Lê todos os PDFs da pasta `docs/`
- Divide os documentos em pequenos trechos (chunks)
- Cria embeddings com o modelo `sentence-transformers/all-MiniLM-L6-v2`
- Armazena os embeddings na base vetorial local (`chroma_db/`)

### Passo 2: Chat

Quando o utilizador envia uma pergunta:
1. A API recebe a mensagem via `POST /chat`
2. Os `top 5` trechos mais relevantes são recuperados da base vetorial
3. Um prompt RAG é construído com os trechos e a pergunta
4. O modelo `Mistral-7B-Instruct` da Together API responde com base no conteúdo
5. A resposta é enviada de volta ao frontend

---

## 🧑‍💻 Frontend

O `index.html` contém um widget com:
- Um botão flutuante 💬
- Um formulário de envio de mensagens
- Um script JS (`script.js`) que comunica com o backend

⚠️ **O widget comunica com `http://127.0.0.1:8000/chat` — garante que o backend está ativo.**

---

## 🛡️ Segurança e Produção

- Limita `CORS` a domínios específicos em produção
- Usa autenticação para proteger endpoints
- Encripta o `.env` e nunca o faz `commit` público

---

## ✅ Exemplo de uso

```bash
# 1. Coloca o PDF em /docs
# 2. Corre ingest.py para criar os embeddings
# 3. Arranca o backend FastAPI
# 4. Abre index.html no navegador
# 5. Escreve uma pergunta sobre o conteúdo do PDF
```

---

## 🧾 Licença

MIT — Sente-te à vontade para modificar e usar.

---

## ✨ Feito por

Rodrigo Gonçalves e equipa 🚀
