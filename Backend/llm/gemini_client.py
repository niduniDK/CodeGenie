import os
from dotenv import load_dotenv
import requests
import google.generativeai as genai

load_dotenv()

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

genai.configure(api_key=GEMINI_API_KEY)
gemini_client = genai.GenerativeModel("gemini-2.0-flash")

def query_gemini(query: str) -> str:
    prompt = f"You are CodeGenie, an AI assistant designed to help with coding tasks. Given the following user query, generate a response that fulfills the request.\n\nQuery: \"{query}\"\nResponse:"
    try:
        response = gemini_client.generate_content(
            prompt
        )
        return response.text
    except Exception as e:
        print(f"Error querying Gemini API: {e}")
        return "Error querying Gemini API"