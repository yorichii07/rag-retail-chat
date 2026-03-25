from http import client
from groq import Groq
from pypdf import PdfReader
import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer
import config

client = Groq(api_key=config.GROQ_API_KEY)
model = SentenceTransformer("all-MiniLM-L6-v2")

chroma_client = chromadb.Client(
    Settings(persist_directory=config.VECTOR_DB_PATH)
)

collection = chroma_client.get_or_create_collection(
    name="retail_documents"
)


def extract_text(file_path):

    reader = PdfReader(file_path)
    text = ""

    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text

    return text


def chunk_text(text, chunk_size=500):

    chunks = []

    for i in range(0, len(text), chunk_size):
        chunks.append(text[i:i + chunk_size])

    return chunks


def create_embedding(text):

    embedding = model.encode(text)

    return embedding.tolist()


def store_in_vector_db(chunks):

    for i, chunk in enumerate(chunks):

        embedding = create_embedding(chunk)

        collection.add(
            documents=[chunk],
            embeddings=[embedding],
            ids=[str(i)]
        )

    


def retrieve_chunks(question):

    query_embedding = create_embedding(question)

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=3
    )

    return results["documents"][0]


def generate_answer(question, chunks):

    context = "\n".join(chunks)

    prompt = f"""
Answer the question using ONLY the context below.

Context:
{context}

Question:
{question}
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    return response.choices[0].message.content