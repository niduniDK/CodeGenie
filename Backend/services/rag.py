from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import Chroma
import os
from dotenv import load_dotenv
import google.generativeai as genai
from langchain.embeddings import HuggingFaceEmbeddings

load_dotenv()

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

genai.configure(api_key=GEMINI_API_KEY)

pdf_dir = "F:/My Projects/CodeGenie/Backend/Notes/Lec note"
all_docs = []

for filename in os.listdir(pdf_dir):
    print(f"Loading {filename}...")
    if filename.endswith(".pdf"):
        print(f"Loading {filename}...")
        loader = PyPDFLoader(os.path.join(pdf_dir, filename))
        all_docs.extend(loader.load())

print(f"Loaded {len(all_docs)} documents from {pdf_dir}")

text_splitter = CharacterTextSplitter(chunk_size=500, chunk_overlap=50)
split_docs = text_splitter.split_documents(all_docs)

# embedding_model = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
embedding_model = HuggingFaceEmbeddings(
    model_name = "sentence-transformers/all-MiniLM-L6-v2"
)

db = Chroma.from_documents(split_docs, embedding_model, persist_directory="./chroma_db")
db.persist()

retriver = db.as_retriever()

def get_relevant_docs(query: str):
    results = retriver.get_relevant_documents(query)
    context = "\n".join([doc.page_content for doc in results])
    return context