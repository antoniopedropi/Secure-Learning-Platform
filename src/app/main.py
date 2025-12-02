import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.staticfiles import StaticFiles

from app import models
from app.database import engine
from app.routers import courses, auth, users, topics, forums

app = FastAPI()

# Permitir acessos apenas de domínios confiáveis
origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)
# Montar o diretório de uploads para servir arquivos estáticos

upload_directory = "uploads/"
if not os.path.exists(upload_directory):
    os.makedirs(upload_directory)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


app.include_router(courses.router)
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(topics.router)
app.include_router(forums.router)

