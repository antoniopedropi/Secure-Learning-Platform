# Diagramas de Sequência

## Diagrama de Sequência: Processo de Autenticação

![Diagrama de Sequência: Processo de Autenticação.png](assets/4%20-%20Diagramas%20de%20Sequência/3b92b81238f6f5e6a0dca35a08497ac72e429677.png)

```plantuml
@startuml
skinparam ParticipantPadding 10
skinparam BoxPadding 10
skinparam ArrowFontSize 12
skinparam SequenceFontSize 12
skinparam ParticipantFontSize 15
skinparam ActorFontSize 15
skinparam LifelineStrategy solid
skinparam MaxMessageSize 200

actor Utilizador
participant "LoginPage.js" as LoginPage
participant "FastAPI" as FastAPI
participant "auth.py" as Auth
participant "crud.py" as CRUD
database "Database" as DB

Utilizador -> LoginPage: Submete formulário de login (username, password)
LoginPage -> LoginPage: Hash da password (SHA-256)
LoginPage -> FastAPI: Envia dados de login (username, hashed_password)
FastAPI -> Auth: Chama authenticate_user()
Auth -> CRUD: get_user_by_username (username)
CRUD -> DB: SELECT * FROM users WHERE username = :username
DB -> CRUD: Retorna User
CRUD -> Auth: Retorna User
Auth -> Auth: Verifica password hash
Auth -> FastAPI: Retorna User
FastAPI -> Auth: Chama create_access_token()
Auth -> Auth: Gera JWT token
Auth -> FastAPI: Retorna JWT token
FastAPI -> LoginPage: Retorna JWT token (access_token)
LoginPage -> LocalStorage: Armazena access_token
LoginPage -> FastAPI: Chama /users/me com Authorization: Bearer access_token
FastAPI -> Auth: Chama get_current_user(token)
Auth -> Auth: Decodifica e verifica JWT token
Auth -> CRUD: get_user_by_username (username)
CRUD -> DB: SELECT * FROM users WHERE username = :username
DB -> CRUD: Retorna User
CRUD -> Auth: Retorna User
Auth -> FastAPI: Retorna User
FastAPI -> LoginPage: Retorna User
LoginPage -> Utilizador: Exibe informações do utilizador (redireciona para página apropriada)

@enduml
```

### Diagrama de Sequência: Criação de Curso

![Diagrama de Sequência: Criação de Curso.png](assets/4%20-%20Diagramas%20de%20Sequência/11288dfad00a919601e10b86c0a0937178c982c3.png)

```plantuml
@startuml
skinparam ParticipantPadding 10
skinparam BoxPadding 10
skinparam ArrowFontSize 12
skinparam SequenceFontSize 12
skinparam ParticipantFontSize 15
skinparam ActorFontSize 15
skinparam LifelineStrategy solid
skinparam MaxMessageSize 200

actor Utilizador
participant "Frontend (CourseForm.js)" as FE
participant "FastAPI (courses.py)" as API
participant "CRUD (crud.py)" as CRUD
database "Database" as DB

Utilizador -> FE: Submete formulário\n de criação de curso
FE -> API: Envia dados do curso\n(title, description, owners, participants)
API -> CRUD: Chama create_course\n(title, description, owner_id)
CRUD -> DB: INSERT INTO courses\n(title, description, owner_id)
DB -> CRUD: Retorna novo curso
CRUD -> API: Retorna novo curso
API -> FE: Retorna novo curso
FE -> Utilizador: Exibe informações\n do novo curso

alt Adicionar Owners
    loop para cada owner selecionado
        FE -> API: Adiciona owner\n(course_id, owner_id)
        API -> CRUD: Chama add_course_owner\n(course_id, owner_id)
        CRUD -> DB: INSERT INTO course_owners\n(course_id, owner_id)
        DB -> CRUD: Retorna curso atualizado
        CRUD -> API: Retorna curso atualizado
        API -> FE: Retorna curso atualizado
    end
end

alt Adicionar Participantes
    loop para cada participante selecionado
        FE -> API: Adiciona participante\n(course_id, participant_id)
        API -> CRUD: Chama add_course_participant\n(course_id, participant_id)
        CRUD -> DB: INSERT INTO course_participants\n(course_id, participant_id)
        DB -> CRUD: Retorna curso atualizado
        CRUD -> API: Retorna curso atualizado
        API -> FE: Retorna curso atualizado
    end
end

@enduml
```

### Diagrama de Sequência: Post Forum e Upload de Arquivo/Imagem

![Diagrama de Sequência Post Forum e Upload de Arquivomagem.png](assets/4%20-%20Diagramas%20de%20Sequência/8cf629c552f242b7aef2e7d66b095b18b9e6f503.png)

```plantuml
@startuml
skinparam ParticipantPadding 10
skinparam BoxPadding 10
skinparam ArrowFontSize 12
skinparam SequenceFontSize 12
skinparam ParticipantFontSize 15
skinparam ActorFontSize 15
skinparam LifelineStrategy solid
skinparam MaxMessageSize 200

actor Utilizador
participant "Frontend" as FE
participant "FastAPI" as API
participant "File System" as FS

Utilizador -> FE: Submete upload\n de arquivo/imagem
FE -> API: Envia arquivo/imagem
API -> FS: Salva arquivo/imagem\n no sistema de arquivos
FS -> API: Retorna caminho do arquivo/imagem
API -> FE: Retorna URL do arquivo/imagem
FE -> Utilizador: Exibe URL do\n arquivo/imagem

@enduml
```

### Diagrama de Sequência: Publicação de Tópico

```plantuml
@startuml
skinparam ParticipantPadding 10
skinparam BoxPadding 10
skinparam ArrowFontSize 12
skinparam SequenceFontSize 12
skinparam ParticipantFontSize 15
skinparam ActorFontSize 15
skinparam LifelineStrategy solid
skinparam MaxMessageSize 200

actor Utilizador
participant "Frontend (TopicPage.js)" as FE
participant "FastAPI (topics.py)" as API
participant "CRUD (crud.py)" as CRUD
database "Database" as DB

Utilizador -> FE: Acede à página do tópico\n e clica em "Publicar"
FE -> API: Envia pedido para publicar\n o tópico (topic_id)
API -> CRUD: Chama publish_topic\n(topic_id, current_user)
CRUD -> DB: UPDATE topics SET state='published'\nWHERE id=topic_id
DB -> CRUD: Retorna tópico atualizado
CRUD -> API: Retorna tópico atualizado
API -> FE: Retorna tópico atualizado
FE -> Utilizador: Exibe estado atualizado\n do tópico publicado

@enduml
```

### Diagrama de Sequência: Envio de Pergunta no Fórum

```plantuml
@startuml
skinparam ParticipantPadding 10
skinparam BoxPadding 10
skinparam ArrowFontSize 12
skinparam SequenceFontSize 12
skinparam ParticipantFontSize 15
skinparam ActorFontSize 15
skinparam LifelineStrategy solid
skinparam MaxMessageSize 200

actor Utilizador
participant "Frontend (ForumPostForm.js)" as FE
participant "FastAPI (forums.py)" as API
participant "CRUD (crud.py)" as CRUD
database "Database" as DB

Utilizador -> FE: Submete pergunta\n no fórum
FE -> API: Envia dados da pergunta\n(topic_id, user_id, content, file)
API -> CRUD: Chama create_forum_post\n(topic_id, post, user_id)
CRUD -> DB: INSERT INTO forum_posts\n(content, topic_id, user_id, image_path)
DB -> CRUD: Retorna nova pergunta
CRUD -> API: Retorna nova pergunta
API -> FE: Retorna nova pergunta
FE -> Utilizador: Exibe a nova\n pergunta no fórum

@enduml
```

### Diagrama de Sequência: Upload de Arquivo/Imagem

```plantuml
@startuml
skinparam ParticipantPadding 10
skinparam BoxPadding 10
skinparam ArrowFontSize 12
skinparam SequenceFontSize 12
skinparam ParticipantFontSize 15
skinparam ActorFontSize 15
skinparam LifelineStrategy solid
skinparam MaxMessageSize 200

actor Utilizador
participant "Frontend" as FE
participant "FastAPI" as API
participant "File System" as FS

Utilizador -> FE: Submete upload\n de arquivo/imagem
FE -> API: Envia arquivo/imagem
API -> FS: Salva arquivo/imagem\n no sistema de arquivos
FS -> API: Retorna caminho do arquivo/imagem
API -> FE: Retorna URL do arquivo/imagem
FE -> Utilizador: Exibe URL do\n arquivo/imagem

@enduml
```
