import os
from dotenv import load_dotenv
import requests
import google.generativeai as genai
import time

load_dotenv()

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

genai.configure(api_key=GEMINI_API_KEY)
gemini_client = genai.GenerativeModel("gemini-2.0-flash")

def query_gemini(query: str, history: list, max_retries: int = 3) -> str:
    """Query Gemini API with retry logic for network errors"""
    prompt = f"You are CodeGenie, an AI assistant designed to help with coding tasks. Given the following user query, generate a response that fulfills the request. Use {history} to understand the context better don't give json like responses..\n\nQuery: \"{query}\"\nResponse:"
    
    for attempt in range(max_retries):
        try:
            response = gemini_client.generate_content(prompt)
            return response.text
            
        except Exception as e:
            print(f"Error querying Gemini API on attempt {attempt + 1}: {e}")
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)  # Exponential backoff
                continue
            return "Error querying Gemini API"
    
    return "Failed to get response after multiple attempts"