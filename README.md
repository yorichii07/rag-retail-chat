# 🧠 Retail Document Intelligence (RAG System)

An end-to-end **Retrieval-Augmented Generation (RAG)** system that allows users to upload retail documents (PDFs) and interact with them using AI-powered question answering.

---

## 🚀 Features

- 📄 Upload retail documents (PDFs)
- ✂️ Automatic text extraction & chunking
- 🔎 Semantic search using Vector Database
- 🤖 Context-aware AI answers using LLM
- 💬 Interactive chat interface
- 🌐 Full-stack project (Frontend + Backend)

---

## 🏗️ Tech Stack

- **Backend:** Python, FastAPI  
- **Frontend:** HTML, CSS, JavaScript  
- **Vector Database:** ChromaDB  
- **Embeddings:** SentenceTransformers  
- **LLM API:** Groq / OpenAI  


---

### 🔹 Detailed Working

1️⃣ **Document Upload**
- User uploads a PDF from the frontend  
- File is sent to FastAPI backend  

2️⃣ **Text Extraction**
- PDF is processed using `PyPDF`  
- Raw text is extracted  

3️⃣ **Chunking**
- Text is split into smaller chunks (e.g., 500 characters)  
- Helps in better retrieval accuracy  

4️⃣ **Embedding Generation**
- Each chunk is converted into a vector using `SentenceTransformers`  

5️⃣ **Vector Storage**
- Embeddings + text stored in `ChromaDB`  

---

### 🔍 Query Flow

6️⃣ **User Question**
- User asks a question from UI  

7️⃣ **Embedding Query**
- Question is converted into embedding  

8️⃣ **Similarity Search**
- Top relevant chunks retrieved from vector DB  

9️⃣ **LLM Generation**
- Context + Question passed to LLM  
- Model generates grounded answer  

🔟 **Response Display**
- Answer shown in chat UI  

---



---

## 📌 Project Architecture
