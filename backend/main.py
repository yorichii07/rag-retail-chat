from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil
import rag_pipeline as rag
import config

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = config.DOCUMENT_PATH


@app.post("/upload")

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    try:
        file_location = UPLOAD_DIR + file.filename

        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        print("File saved:", file_location)

        text = rag.extract_text(file_location)
        print("Text extracted")

        chunks = rag.chunk_text(text)
        print("Chunks created:", len(chunks))

        rag.store_in_vector_db(chunks)
        print("Stored in vector DB")

        return {"message": "Document stored in Vector DB successfully"}

    except Exception as e:
        print("ERROR:", e)
        return {"error": str(e)}


@app.post("/ask")

async def ask_question(data: dict):

    question = data["question"]

    chunks = rag.retrieve_chunks(question)

    answer = rag.generate_answer(question, chunks)

    return {"answer": answer}