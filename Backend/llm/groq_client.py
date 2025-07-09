import os
import requests
from dotenv import load_dotenv
import time
from requests.exceptions import ChunkedEncodingError, ConnectionError, Timeout
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = "llama3-70b-8192"

# Create a session with connection pooling and retry strategy
session = requests.Session()
retry_strategy = Retry(
    total=3,
    status_forcelist=[429, 500, 502, 503, 504],
    backoff_factor=1
)
adapter = HTTPAdapter(max_retries=retry_strategy)
session.mount("http://", adapter)
session.mount("https://", adapter)

def query_groq(prompt: str, max_retries: int = 3) -> str:
    """Query Groq API with retry logic for network errors"""
    
    for attempt in range(max_retries):
        try:
            response = session.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    'model': GROQ_MODEL,
                    "messages": [{
                        'role': 'user',
                        'content': prompt
                    }]
                },
                timeout=30  # Add timeout to prevent hanging
            )

            if response.ok:
                data = response.json()
                return data['choices'][0]['message']['content']
            else:
                print(f"Error: {response.status_code} - {response.text}")
                if attempt < max_retries - 1:
                    time.sleep(2 ** attempt)  # Exponential backoff
                    continue
                return "Error querying Groq API"
                
        except (ChunkedEncodingError, ConnectionError, Timeout) as e:
            print(f"Network error on attempt {attempt + 1}: {e}")
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)  # Exponential backoff
                continue
            return "Network error: Unable to connect to Groq API"
        except Exception as e:
            print(f"Unexpected error: {e}")
            return "Unexpected error occurred while querying Groq API"
    
    return "Failed to get response after multiple attempts"
    

def classify_intent(query: str, history: list) -> str:
    prompt = f"""
    You are an expert in understanding user queries and classifying their intent. Use {history} to understand the query better.
    Given the following user query, classify its intent into one of the following categories:
    [code_generation, identifying_bugs, code_review]
    Query: "{query}"
    Intent:
"""
    return query_groq(prompt).strip()




def generate_code(query: str, history: list) -> str:
    prompt = f"""
    You are an expert code generator. Given the following user query, generate the code that fulfills the request.
    Format the code with proper indentation and ensure it is syntactically correct. Use {history} to understand the context better.
    Query: "{query}"
    Code:
"""
    return query_groq(prompt).strip()


def identify_bugs(code: str, history: list) -> str:
    prompt = f"""
    You are an expert in identifying bugs in code. Given the following code, identify any bugs and provide a detailed explanation of the issues.
    Show step by step debugging process. Use {history} to understand the context better.
    Code:
    {code}
    Bugs:
"""
    return query_groq(prompt).strip()

def review_code(code: str, history: list) -> str:
    prompt = f"""
    You are an expert code reviewer. Given the following code, provide a detailed review including suggestions for improvements, best practices, and potential issues.
    Use {history} to understand the context better.
    Code:
    {code}
    Review:
"""
    return query_groq(prompt).strip()