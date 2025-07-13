from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from .rag import get_relevant_docs
from fastapi import APIRouter
from .DSARequestModel import DSARequestModel
import os
import google.generativeai as genai

from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
genai.configure(api_key=GEMINI_API_KEY)

router = APIRouter()

# llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0.2)
llm = genai.GenerativeModel("gemini-2.0-flash")

template = """
    You are CodeGenie DSAExpert, an AI assistant design to help users with the DSA problems provided with step by step.
    Given the data structures and algorithms problem, generate a response to guide the user step by step to the solution.
    Don't give complete answer at once and don't give all the steps, instead break it down into smaller steps and provide the current steps and hints for the next step. If the user still struggles, complete that step and provide hint to the next step of the solution.
    Keep the steps in your memory and provide the current step (one step at a time) based on the previous chats and steps use the {history} if needed.
    If the user asks for code, provide the code snippet for that step only.
    If the user asks for explanation, provide a detailed explanation of the step.

    Use the context provided.
    And use the history for better understanding of the problem.
    Tell the user to ask for the next step if they are still struggles in solving the problem.

    Context: {context}
    Problem: {problem}
    history: {history}
    """

prompt = PromptTemplate(
    input_variables=["context", "problem", "history"],
    template=template
)

# qa_chain = LLMChain(llm=llm, prompt=prompt)

@router.post("/dsa_guide")
def get_dsa_solution(data: DSARequestModel):
    problem = data.problem
    context = get_relevant_docs(problem)
    prompt_str = prompt.format(context=context, problem=problem, history=data.history)
    response = llm.generate_content(prompt_str)
    return response.text