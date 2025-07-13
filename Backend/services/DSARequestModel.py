from pydantic import BaseModel

class DSARequestModel(BaseModel):
    problem: str
    history: list