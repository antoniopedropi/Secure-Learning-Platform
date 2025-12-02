from app import models
from app.database import engine

# Criar as tabelas
models.Base.metadata.create_all(bind=engine)

print("Tables created successfully.")
