import requests
from llm.groq_client import generate_code, identify_bugs, review_code, classify_intent
from llm.gemini_client import query_gemini
from fastapi import APIRouter

router = APIRouter()

@router.post('/chat')
def get_help(query: str, history: list):
    intent = classify_intent(query)
    if intent == 'code_generation':
        response = generate_code(query)
    elif intent == 'identifying_bugs':
        response = identify_bugs(query)
    elif intent == 'code_review':
        response = review_code(query)
    else:
        response = query_gemini(query)
    return response