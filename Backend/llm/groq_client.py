import os
import requests
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = "codellama-34b"

def query_groq(prompt: str) -> str:
    response = requests.post(
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
        }
    )

    if response.ok:
        data = response.json()
        return data['choices'][0]['message']['content']
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return "Error querying Groq API"
    

def classify_intent(query: str) -> str:
    prompt = f"""
    You are an expert in understanding user queries and classifying their intent.
    Given the following user query, classify its intent into one of the following categories:
    [code_generation, identifying_bugs, code_review]
    Query: "{query}"
    Intent:
"""
    return query_groq(prompt).strip()




def generate_code(query: str) -> str:
    prompt = f"""
    You are an expert code generator. Given the following user query, generate the code that fulfills the request.
    Query: "{query}"
    Code:
"""
    return query_groq(prompt).strip()


def identify_bugs(code: str) -> str:
    prompt = f"""
    You are an expert in identifying bugs in code. Given the following code, identify any bugs and provide a detailed explanation of the issues.
    Show step by step debugging process.
    Code:
    {code}
    Bugs:
"""
    return query_groq(prompt).strip()

def review_code(code: str) -> str:
    prompt = f"""
    You are an expert code reviewer. Given the following code, provide a detailed review including suggestions for improvements, best practices, and potential issues.
    Code:
    {code}
    Review:
"""
    return query_groq(prompt).strip()