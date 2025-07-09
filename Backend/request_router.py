import requests
from llm.groq_client import generate_code, identify_bugs, review_code, classify_intent
from llm.gemini_client import query_gemini
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class ChatRequest(BaseModel):
    query: str
    history: list

@router.post('/chat')
def get_help(msg: ChatRequest):
    query = msg.query
    history = msg.history
    intent = classify_intent(query,history)
    if intent == 'code_generation':
        response = generate_code(query,history)
    elif intent == 'identifying_bugs':
        response = identify_bugs(query,history)
    elif intent == 'code_review':
        response = review_code(query,history)
    else:
        response = query_gemini(query,history)
    return response