from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import request_router
import services.DSA_helper

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

app.include_router(request_router.router, prefix='/chat', tags=['Chatbot'])
app.include_router(services.DSA_helper.router, prefix='/guide', tags=['DSA Helper'])

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000, reload=True)