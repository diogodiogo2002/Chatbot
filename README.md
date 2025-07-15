```markdown
# 📚 RAG Chatbot com LangChain, FastAPI e Widget Web

Este projeto é um **chatbot com RAG (Retrieval-Augmented Generation)** que responde a perguntas baseando-se em documentos PDF carregados. O sistema utiliza **LangChain**, **ChromaDB**, **FastAPI** no backend, e um **widget simples em HTML/CSS/JS** no frontend.

---

## 🧠 Tecnologias Utilizadas

- [cite_start]**FastAPI** — API moderna e rápida para backend [cite: 5]
- **LangChain** — Framework para RAG (Recuperação + Geração)
- [cite_start]**ChromaDB** — Base vetorial local para recuperação semântica [cite: 5]
- [cite_start]**HuggingFace Embeddings** — Modelo de embeddings [cite: 5]
- [cite_start]**Together.ai API** — LLM Mistral-7B-Instruct para respostas [cite: 5]
- [cite_start]**HTML/CSS/JavaScript** — Interface do widget [cite: 3, 4]

---

## 📁 Estrutura do Projeto

```

├─ docs                \# PDF(s) a serem carregados
├─interface/
|  ├── backend/
|  │   ├── ingest\_database.py    \# Indexação de documentos PDF
|  │   ├── main.py               \# Backend FastAPI com RAG
|  │   └── chroma\_db/            \# Base de dados vetorial persistente
|  ├── frontend/
|  │   ├── index.html            \# Interface do widget
|  │   ├── style.css             \# Estilos visuais
|  │   └── script.js             \# Lógica do frontend
├─ .env                \# Chave TOGETHER\_API\_KEY
├─ README.md           \# Este ficheiro

````

---

## ⚙️ Instalação

### 1. Pré-requisitos

Certifique-se de ter **Python 3.8+** e **pip** instalados.

### 2. Clonar o Repositório

```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd <nome_da_pasta_do_repositorio>
````

### 3\. Criar e Ativar o Ambiente Virtual

```bash
python -m venv venv
```

**No Windows:**

```bash
.\venv\Scripts\activate
```

**No macOS/Linux:**

```bash
source venv/bin/activate
```

### 4\. Instalar dependências

Crie um arquivo `requirements.txt` na raiz do projeto com o seguinte conteúdo:

```
fastapi
uvicorn
python-dotenv
langchain
langchain-chroma
langchain-community
langchain-huggingface
langchain-openai
pydantic
PyPDF2
sentence-transformers
```

Então, instale as dependências:

```bash
pip install -r requirements.txt
```

### 5\. Criar o ficheiro `.env`

Crie um ficheiro `.env` na raiz do seu projeto com a sua chave da API da Together.ai:

```
TOGETHER_API_KEY=<SUA_CHAVE_AQUI>
```

Substitua `<SUA_CHAVE_AQUI>` pela sua chave real obtida em [Together.ai](https://www.together.ai/).

### 6\. Colocar os PDFs

Coloque os seus documentos PDF na pasta `docs/`. O chatbot irá usar estes documentos como base para as respostas.

### 7\. Indexar os documentos

Navegue até a pasta `interface/backend` e execute o script de ingestão:

```bash
cd interface/backend
python ingest_database.py
```

Este passo cria a base de dados vetorial `chroma_db/`.

### 8\. Iniciar o backend

Na pasta `interface/backend`, inicie o servidor FastAPI:

```bash
uvicorn main:app --reload
```

O servidor estará acessível em `http://127.0.0.1:8000`.

-----

## 💬 Como Funciona

### Passo 1: Ingestão

[cite\_start]O script `ingest_database.py`[cite: 1]:

  - [cite\_start]Lê os documentos PDF da pasta `docs/`[cite: 1].
  - [cite\_start]Divide os documentos em trechos (chunks)[cite: 1].
  - [cite\_start]Cria embeddings para esses trechos usando o modelo `sentence-transformers/all-MiniLM-L6-v2`[cite: 1].
  - [cite\_start]Armazena esses embeddings numa base de dados vetorial persistente chamada `chroma_db/`[cite: 1].

### Passo 2: Chat

[cite\_start]Quando o utilizador envia uma pergunta através da interface web[cite: 3]:

1.  [cite\_start]O backend recebe a mensagem via um pedido `POST` para `/chat`[cite: 5].
2.  [cite\_start]O sistema recupera os 5 trechos mais relevantes da base de dados vetorial (`chroma_db`) com base na pergunta do utilizador[cite: 5].
3.  [cite\_start]Um prompt de RAG é construído, combinando a pergunta do utilizador com o conhecimento recuperado dos documentos[cite: 5].
4.  [cite\_start]O modelo de linguagem `Mistral-7B-Instruct-v0.1` (via Together.ai API) gera uma resposta com base neste prompt[cite: 5].
5.  [cite\_start]A resposta é enviada de volta para a interface do utilizador[cite: 5].

-----

## 🧑‍💻 Frontend

A pasta `interface/frontend` contém os seguintes ficheiros:

  - [cite\_start]`index.html`: A estrutura principal do widget do chatbot[cite: 4].
  - [cite\_start]`style.css`: Define os estilos visuais para o chatbot, como cores, tamanhos e layout[cite: 2].
  - [cite\_start]`script.js`: Contém a lógica JavaScript que gere a interação do utilizador, a abertura/fecho do widget e a comunicação com o backend FastAPI[cite: 3].

⚠️ **O widget comunica com `http://127.0.0.1:8000/chat` — garanta que o backend está ativo e acessível nesta porta.**

-----

## 🛡️ Segurança e Produção

  * **CORS (Cross-Origin Resource Sharing):** No arquivo `main.py`, a configuração de CORS (`app.add_middleware`) está definida para `allow_origins=["*"]` para facilitar o desenvolvimento. Em produção, **recomenda-se fortemente** que esta configuração seja alterada para permitir apenas o domínio específico do seu frontend, aumentando a segurança.
  * **Chave de API:** Mantenha a sua `TOGETHER_API_KEY` segura e nunca a inclua diretamente no código-fonte ou faça commit em repositórios públicos. O uso do `.env` é uma boa prática.

-----

## ✅ Exemplo de uso

```bash
# 1. Coloque os seus PDFs na pasta 'docs/'
# 2. Navegue até 'interface/backend' e execute: python ingest_database.py
# 3. Na mesma pasta 'interface/backend', inicie o backend: uvicorn main:app --reload
# 4. Abra o ficheiro 'interface/frontend/index.html' no seu navegador
# 5. Clique no ícone do chat e comece a fazer perguntas relacionadas aos seus PDFs!
```

-----

## 🧾 Licença

Este projeto está sob a licença MIT. Sinta-se à vontade para modificar e usar.

-----

## ✨ Feito por

Rodrigo Gonçalves e equipa 🚀

```
```
