# Chatbot com RAG e Widget Interativo

Este projeto implementa um chatbot baseado em RAG (Retrieval-Augmented Generation) com uma interface web interativa em forma de widget. O sistema permite consultar documentos PDF através de processamento de linguagem natural utilizando um modelo LLM hospedado via Together AI.

## 📁 Estrutura do Projeto

```
├── docs/                       # Documentos PDF a serem indexados
├── interface/
│   ├── backend/
│   │   ├── ingest_database.py  # Script para indexar documentos PDF
│   │   ├── main.py             # Backend FastAPI com endpoint RAG
│   │   └── chroma_db/          # Base de dados vetorial ChromaDB
│   ├── frontend/
│   │   ├── index.html          # Página principal do widget
│   │   ├── style.css           # Estilos visuais do widget
│   │   └── script/
│   │       ├── chat-core.js    # Lógica principal do chatbot
│   │       └── chat-events.js  # Manipulação de eventos e interacções
├── runner.py                   # Script para iniciar backend e frontend juntos
├── .env                        # Chave da API e variáveis de ambiente
├── README.md                   # Documentação do projeto
└── requirements.txt            # Dependências Python
```

## ⚙️ Requisitos

- Python 3.10+
- Conta na Together AI com chave de API

## 🚀 Configuração Rápida

1. **Criar ambiente virtual:**

```bash
python -m venv venv
source venv/bin/activate   # Linux/macOS
venv\Scripts\activate      # Windows
```

2. **Instalar dependências:**

```bash
pip install -r requirements.txt
```

3. **Configurar API Key:**

Crie um arquivo `.env` com o seguinte conteúdo:

```
TOGETHER_API_KEY=sua_chave_aqui
```

## ↻ Fluxo de Trabalho

1. **Indexar documentos:**

- Coloque os PDFs na pasta `docs/`
- Execute:

```bash
cd interface/backend
python ingest_database.py
```

2. **Iniciar o sistema:**

- Opção 1 (manual):

```bash
cd interface/backend
uvicorn main:app --reload
```

Depois, abra `interface/frontend/index.html` no navegador.

- Opção 2 (automática com script):

```bash
python runner.py
```

## 🌟 Funcionalidades do Widget

- Interface flutuante e responsiva
- Contador de caracteres com alertas visuais (warning e danger)
- Botões interativos para:
  - Expandir/ocultar fonte de consulta da resposta
  - Copiar resposta para a área de transferência (clipboard)
- Sugestões de perguntas automáticas



## 🧠 Tecnologias Utilizadas

| Componente    | Tecnologias                                                          |
| ------------- | -------------------------------------------------------------------- |
| Backend       | FastAPI, ChromaDB, LangChain, HuggingFace Embeddings                 |
| LLM           | Mistral-7B-Instruct-v0.3 via Together AI                             |
| Frontend      | HTML5, CSS3, JavaScript Vanilla                                      |
| Processamento | Retrieval-Augmented Generation (RAG), Tradução via Google Translator |

## 📌 Notas Adicionais

1. Otimizações implementadas:

   - Carregamento rápido (<2s)
   - Baixo uso de memória
   - Compatibilidade com Chrome, Firefox e Edge

2. Limitações:

   - Máximo de 100 caracteres por mensagem
   - Apenas PDFs são suportados por enquanto
   - Requer internet para comunicação com API externa

3. Para desenvolvimento:

   - Edita `style.css` para mudar visual
   - Altera `chat-core.js` para modificar comportamento do bot
   - Usa `chat-events.js` para mudar eventos e animações

## 📄 Licença

Este projeto é open-source sob a licença MIT. Consulta o ficheiro `LICENSE` para mais detalhes.

Desenvolvido por Rodrigo Gonçalves e Diogo Diogo - 2025 😤

