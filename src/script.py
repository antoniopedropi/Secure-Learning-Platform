import sqlite3

import hashlib

# Conectar à base de dados SQLite
conn = sqlite3.connect('database.db')
cursor = conn.cursor()

# Função para gerar a hash da senha
def generate_hash(password):
    return hashlib.sha256(password.encode())

# Dados de exemplo
students = [(f'student{x}', f'student{x}@example.com', generate_hash(f'student{x}'), True) for x in range(1, 11)]
teachers = [(f'teacher{x}', f'teacher{x}@example.com', generate_hash(f'teacher{x}'), True) for x in range(1, 11)]

# Inserir estudantes na tabela users
for student in students:
    cursor.execute("INSERT INTO users (username, email, hashed_password, is_active, role) VALUES (?, ?, ?, ?, ?)", (student[0], student[1], student[2], student[3], 'student'))

# Inserir professores na tabela users
for teacher in teachers:
    cursor.execute("INSERT INTO users (username, email, hashed_password, is_active, role) VALUES (?, ?, ?, ?, ?)", (teacher[0], teacher[1], teacher[2], teacher[3], 'teacher'))

# Salvar as mudanças e fechar a conexão
conn.commit()
conn.close()
