
# Chatbot com RAG e Widget Interativo

Este projeto é um chatbot baseado em RAG (Retrieval-Augmented Generation) que permite ao utilizador interagir com documentos PDF carregados no sistema. A interface é fornecida através de um widget web leve, que comunica com um backend FastAPI.

## 📁 Estrutura do Projeto

```
├─ docs                       # PDF(s) a serem carregados
├─ interface/
|  ├── backend/
|  │   ├── ingest.py               # Indexação de documentos PDF
|  │   ├── main.py                 # Backend FastAPI com RAG
|  │   └── chroma_db/              # Base de dados vetorial persistente
|  ├── frontend/
|  │   ├── index.html              # Interface do widget
|  │   ├── style.css               # Estilos visuais
|  │   └── script.js               # Lógica do frontend
├── .env                        # Chave TOGETHER_API_KEY
├── README.md                   # Este ficheiro
```

## ⚙️ Instalação

1. **Criar ambiente virtual (opcional mas recomendado):**

```bash
python -m venv venv
source venv/bin/activate   # Linux/macOS
venv\Scripts\activate      # Windows
```

2. **Instalar dependências:**

```bash
pip install -r requirements.txt
```

> ⚠️ Certifica-te de ter o Python 3.10+ instalado.

3. **Criar o ficheiro (já criado) `.env` com a tua chave da API Together:**

```
TOGETHER_API_KEY=coloca_aqui_a_tua_chave
```

## 📥 Indexar Documentos

Coloca os ficheiros `.pdf` na pasta `docs/`.

Depois corre o script de ingestão:

```bash
cd interface/backend
python ingest.py
```

Este passo carrega os documentos e armazena os embeddings na base de dados vetorial (`chroma_db/`).

## 🚀 Iniciar o Backend

A partir da pasta `interface/backend`, corre:

```bash
uvicorn main:app --reload
```

A API ficará disponível em `http://localhost:8000`.

## 🖥️ Usar o Widget

Abre o ficheiro `interface/frontend/index.html` diretamente num browser ou serve-o com um servidor local (por exemplo, extensão *Live Server* no VSCode).

Este widget conecta-se ao backend e permite fazer perguntas relacionadas com os documentos carregados.

## 🧠 Tecnologias Utilizadas

- **FastAPI** — Framework web para o backend
- **ChromaDB** — Base de dados vetorial local
- **LangChain** — Orquestração do sistema RAG
- **Together AI** — Modelo LLM (via API)
- **HTML/CSS/JS** — Interface simples e funcional

## 📌 Notas Finais

- O sistema foi desenvolvido para uso local e educativo.
- A API da Together pode ter limites gratuitos. Usa com moderação ou configura uma conta paga se necessário.

---

Desenvolvido com 💻 por Rodrigo Gonçalves
