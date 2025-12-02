# Diagrama de Casos de Uso

```plantuml
@startuml
left to right direction
skinparam packageStyle rectangle

actor Admin
actor Professor
actor Estudante

rectangle "Sistema de Gestão de Cursos" {
    usecase "Iniciar/Terminar Sessão" as UC1

    usecase "Gerir Cursos" as UC2
    usecase "Visualizar Cursos" as UC3

    usecase "Gerir Tópicos" as UC4
    usecase "Visualizar Tópicos" as UC5

    usecase "Participar nos Fóruns" as UC6
    usecase "Gerir Posts no Fórum" as UC7

    usecase "Gerir Utilizadores" as UC8
}

Admin --> UC1
Admin --> UC2
Admin --> UC3
Admin --> UC4
Admin --> UC5
Admin --> UC6
Admin --> UC7
Admin --> UC8

Professor --> UC1
Professor --> UC3
Professor --> UC4
Professor --> UC5
Professor --> UC6
Professor --> UC7

Estudante --> UC1
Estudante --> UC3
Estudante --> UC5
Estudante --> UC6
@enduml
```

### Descrição dos Casos de Uso

1. **Iniciar/Terminar Sessão (UC1)**
   
   - **Descrição**: Permite que o utilizador inicie e termine sessão no sistema.
   - **Atores**: Admin, Professor, Estudante

2. **Gerir Cursos (UC2)**
   
   - **Descrição**: Permite que o administrador crie, edite e elimine cursos.
   - **Atores**: Admin

3. **Visualizar Cursos (UC3)**
   
   - **Descrição**: Permite que os utilizadores visualizem a lista de cursos disponíveis.
   - **Atores**: Admin, Professor, Estudante

4. **Gerir Tópicos (UC4)**
   
   - **Descrição**: Permite que o administrador e o professor criem, editem e eliminem tópicos.
   - **Atores**: Admin, Professor

5. **Visualizar Tópicos (UC5)**
   
   - **Descrição**: Permite que os utilizadores visualizem os tópicos disponíveis em um curso.
   - **Atores**: Admin, Professor, Estudante

6. **Participar nos Fóruns (UC6)**
   
   - **Descrição**: Permite que os utilizadores criem posts nos fóruns.
   - **Atores**: Admin, Professor, Estudante

7. **Gerir Posts no Fórum (UC7)**
   
   - **Descrição**: Permite que o administrador e o professor eliminem posts no fórum.
   - **Atores**: Admin, Professor

8. **Gerir Utilizadores (UC8)**
   
   - **Descrição**: Permite que o administrador crie, edite e elimine utilizadores do sistema.
   - **Atores**: Admin

