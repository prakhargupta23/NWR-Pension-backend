cat << 'EOF' > README.md
# NWR Pension & Expenditure Backend

A backend system built using Azure Functions (Node.js) and TypeScript.

---

## 🚀 Tech Stack

### Core Framework & Language

- Azure Functions (Node.js runtime)
- TypeScript
- Node.js

---

### Artificial Intelligence & LLMs

- Azure OpenAI Service (GPT-4o)
- OpenAI Assistants API
- tiktoken (tokenization library)

---

### Database & Storage

- Azure SQL Database
- Sequelize
- SQLite
- Azure Blob Storage
- Azure Queue Storage
- mssql (SQL Server driver)

---

### Document & Image Processing

- Azure AI Document Intelligence
- Tesseract.js
- pdf-lib
- pdfjs-dist
- pdf-parse

---

### Data Visualization & Security

- Chart.js
- chartjs-node-canvas
- jsonwebtoken
- bcrypt
- Microsoft Entra ID

---

# 🧠 RAG (Retrieval-Augmented Generation) Architecture

## What is Used

### LLM Layer

- Azure OpenAI Service (GPT-4o)
- OpenAI Assistants API

### Embeddings

- Azure OpenAI Embedding models

### Vector Storage Options

- Azure SQL (vector-enabled)
- SQLite (local embedding cache)
- Azure Blob Storage (document storage)

---

## RAG Flow in Backend

### 1️⃣ Document Ingestion

- Upload documents (PDF, DOCX, Images)
- OCR via Azure AI Document Intelligence / Tesseract.js
- Text extraction using pdf-parse / mammoth

### 2️⃣ Chunking & Tokenization

- Split into semantic chunks
- Token count management using tiktoken

### 3️⃣ Embedding Generation

- Generate embeddings via Azure OpenAI
- Store embeddings in:
  - Azure SQL (vector column)
  - SQLite (local cache)

### 4️⃣ Retrieval

- Convert user query → embedding
- Perform similarity search (cosine similarity)
- Retrieve top-K relevant chunks

### 5️⃣ Augmented Generation

- Inject retrieved context into GPT-4o prompt
- Generate:
  - Natural language response
  - SQL queries
  - Validation notes
  - Financial summaries

---

## RAG Stack Summary

- LLM: Azure OpenAI (GPT-4o)
- Embeddings: Azure OpenAI Embedding Models
- Vector Store: Azure SQL / SQLite
- Storage: Azure Blob Storage
- Orchestration: OpenAI Assistants API
- Token Management: tiktoken

---

If you'd like, I can also convert this into:

- Resume-ready 1-page technical summary
- Enterprise architecture diagram
- GitHub production-grade README
- 3-minute interview explanation version

EOF