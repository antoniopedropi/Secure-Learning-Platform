# Lista de Diagramas

### 1. Diagrama de Casos de Uso (Use Case Diagram)

**Componentes:**

- **Atores:** Admin, Teacher, Student, Public User
- **Casos de Uso:**
  - Criar Curso
  - Editar Curso
  - Deletar Curso
  - Visualizar Curso
  - Publicar Tópico
  - Editar Tópico
  - Deletar Tópico
  - Enviar Pergunta
  - Visualizar Perguntas
  - Responder Pergunta
  - Fazer Upload de Arquivo/Imagem
  - Autenticar Usuário
  - Gerenciar Usuários

### 2. Diagrama de Classes (Class Diagram)

**Componentes:**

- **Classes Principais:**
  - User (Admin, Teacher, Student)
  - Course
  - Topic
  - ForumPost
  - FileUpload
- **Atributos e Métodos Importantes:** Listar os principais atributos e métodos de cada classe.
- **Relações:** Associação, Herança, Composição, Agregação.

### 3. Diagrama de Sequência (Sequence Diagram)

**Componentes:**

- **Cenários Importantes:**
  - Processo de Autenticação
  - Criação de Curso
  - Publicação de Tópico
  - Envio de Pergunta no Fórum
  - Upload de Arquivo/Imagem
  - Resposta à Pergunta no Fórum
- **Interações:** Entre os objetos principais, como User, Course, Topic, ForumPost, e o servidor.

### 4. Diagrama de Atividades (Activity Diagram)

**Componentes:**

- **Atividades Chave:**
  - Processo de Registro e Autenticação
  - Fluxo de Criação e Edição de Curso
  - Fluxo de Criação e Publicação de Tópico
  - Fluxo de Envio e Visualização de Perguntas no Fórum
  - Processo de Upload de Arquivo/Imagem

### 5. Diagrama de Componentes (Component Diagram)

**Componentes:**

- **Componentes do Sistema:**
  - Frontend (React, Bootstrap)
  - Backend (FastAPI)
  - Banco de Dados (SQLAlchemy)
  - Servidor de Arquivos (para uploads)
- **Interfaces:** Descrever as interfaces entre esses componentes, como endpoints REST.

### 6. Diagrama de Implantação (Deployment Diagram)

**Componentes:**

- **Nodos de Implantação:**
  - Servidor Web
  - Servidor de Banco de Dados
  - Servidor de Aplicação
  - Balanceador de Carga (se aplicável)
- **Artefatos:** Aplicações implantadas em cada nodo.

### Exemplos de Diagramas:

#### Diagrama de Casos de Uso

```plaintext
Atores: Admin, Teacher, Student, Public User

Casos de Uso:
- Admin: Criar Curso, Editar Curso, Deletar Curso, Gerenciar Usuários
- Teacher: Publicar Tópico, Editar Tópico, Deletar Tópico
- Student: Visualizar Curso, Enviar Pergunta, Visualizar Perguntas, Fazer Upload de Arquivo/Imagem
- Public User: Visualizar Curso (para cursos públicos), Fazer Perguntas Anônimas (se permitido)
```

#### Diagrama de Classes

```plaintext
Classes Principais:
- User
  - Atributos: id, username, password, role
  - Métodos: authenticate(), getRole()
- Course
  - Atributos: id, title, description, ownerId, isPublic
  - Métodos: addTopic(), editCourse(), deleteCourse()
- Topic
  - Atributos: id, title, content, courseId, status
  - Métodos: publish(), editTopic(), deleteTopic()
- ForumPost
  - Atributos: id, content, topicId, userId, createdAt, fileId
  - Métodos: addPost(), editPost(), deletePost()
- FileUpload
  - Atributos: id, filename, filepath, uploadedBy, uploadedAt
  - Métodos: uploadFile(), deleteFile()
```

#### Diagrama de Sequência (Exemplo: Processo de Criação de Curso)

```plaintext
Actor: Admin
Objetos: Admin, Frontend, Backend, Database

1. Admin inicia a criação de curso na interface do Frontend.
2. Frontend envia solicitação para Backend (/create_course).
3. Backend processa a solicitação e valida dados.
4. Backend insere novo curso no Database.
5. Database confirma inserção.
6. Backend retorna confirmação para Frontend.
7. Frontend notifica Admin da criação bem-sucedida.
```

#### Diagrama de Atividades (Exemplo: Fluxo de Autenticação)

```plaintext
Atividades:
- Início
- Inserir Credenciais
- Enviar Credenciais para Backend
- Validar Credenciais
  - Se válidas: Conceder Acesso
  - Se inválidas: Mostrar Mensagem de Erro
- Fim
```

Esses diagramas ajudam a ilustrar a arquitetura do sistema, os fluxos de processos principais e a interação entre diferentes componentes, atores e dados. Eles fornecem uma visão clara e estruturada que é essencial para a documentação e a análise da segurança do sistema.
