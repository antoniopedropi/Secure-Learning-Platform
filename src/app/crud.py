from typing import Optional

from sqlalchemy.orm import Session

from . import models, schemas, auth


# Funções de gerenciamento de cursos
# Funções de gerenciamento de cursos
def get_courses(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Course).offset(skip).limit(limit).all()

def get_course(db: Session, course_id: int):
    return db.query(models.Course).filter(models.Course.id == course_id).first()

def create_course(db: Session, course: schemas.CourseCreate, owner_id: int):
    db_course = models.Course(title=course.title, description=course.description)
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    # Adicionar o owner ao curso
    owner = db.query(models.User).filter(models.User.id == owner_id).first()
    db_course.owners.append(owner)
    db.commit()
    db.refresh(db_course)
    return db_course

def is_user_authorized_to_edit_course(db: Session, user_id: int, course_id: int) -> bool:
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if course.owners == user_id:
        return True
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user.role == "admin":
        return True
    return False


def update_course(db: Session, course_id: int, course: schemas.CourseCreate):
    db_course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if db_course:
        db_course.title = course.title
        db_course.description = course.description
        db.commit()
        db.refresh(db_course)
    return db_course

def delete_course(db: Session, course_id: int):
    db_course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if db_course:
        db.delete(db_course)
        db.commit()
    return db_course

# Adicionar owner ao curso
def add_course_owner(db: Session, course_id: int, user_id: int):
    db_course = db.query(models.Course).filter(models.Course.id == course_id).first()
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_course and db_user:
        db_course.owners.append(db_user)
        db.commit()
        db.refresh(db_course)
    return db_course

# Remover owner do curso
def remove_course_owner(db: Session, course_id: int, user_id: int):
    db_course = db.query(models.Course).filter(models.Course.id == course_id).first()
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_course and db_user:
        db_course.owners.remove(db_user)
        db.commit()
        db.refresh(db_course)
    return db_course

def add_course_participant(db: Session, course_id: int, user_id: int):
    db_course = db.query(models.Course).filter(models.Course.id == course_id).first()
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_course and db_user:
        db_course.participants.append(db_user)
        db.commit()
        db.refresh(db_course)
    return db_course

def remove_course_participant(db: Session, course_id: int, user_id: int):
    db_course = db.query(models.Course).filter(models.Course.id == course_id).first()
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_course and db_user:
        db_course.participants.remove(db_user)
        db.commit()
        db.refresh(db_course)
    return db_course

# Funções de gerenciamento de usuários
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

# Funções de gerenciamento de usuários
def get_users(db: Session, skip: int = 0, limit: int = None):  # Ajuste o limite padrão para None
    query = db.query(models.User)
    if limit:
        query = query.offset(skip)
    return query.all()

def get_user_courses(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user:
        owned_courses = user.owned_courses
        participating_courses = user.participating_courses
        return owned_courses, participating_courses
    return None, None

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(username=user.username, email=user.email, hashed_password=hashed_password, role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: int, user: schemas.UserCreate):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        db_user.username = user.username
        db_user.email = user.email
        db_user.role = user.role
        if user.password:
            db_user.hashed_password = user.password
        db.commit()
        db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
    return db_user

def get_courses(db: Session, skip: int = 0, limit: int = 10, search: str = None):
    query = db.query(models.Course)
    if search:
        query = query.filter(models.Course.title.contains(search))
    return query.offset(skip).limit(limit).all()


# Funções de gerenciamento de tópicos
def get_topics(db: Session, course_id: int, skip: int = 0, limit: int = 10):
    return db.query(models.Topic).filter(models.Topic.course_id == course_id).offset(skip).limit(limit).all()

def get_topic(db: Session, topic_id: int):
    return db.query(models.Topic).filter(models.Topic.id == topic_id).first()

def create_topic(db: Session, topic: schemas.TopicCreate, course_id: int):
    db_topic = models.Topic(title=topic.title, content=topic.content, course_id=course_id, state=topic.state, visibility=topic.visibility)
    db.add(db_topic)
    db.commit()
    db.refresh(db_topic)
    return db_topic

def update_topic(db: Session, topic_id: int, topic: schemas.TopicCreate):
    db_topic = db.query(models.Topic).filter(models.Topic.id == topic_id).first()
    if db_topic:
        db_topic.title = topic.title
        db_topic.content = topic.content
        db_topic.state = topic.state
        db_topic.visibility = topic.visibility
        db.commit()
        db.refresh(db_topic)
    return db_topic

def delete_topic(db: Session, topic_id: int):
    db_topic = db.query(models.Topic).filter(models.Topic.id == topic_id).first()
    if db_topic:
        db.delete(db_topic)
        db.commit()
    return db_topic

def publish_topic(db: Session, topic_id: int):
    db_topic = db.query(models.Topic).filter(models.Topic.id == topic_id).first()
    if db_topic:
        db_topic.state = "published"
        db.commit()
        db.refresh(db_topic)
    return db_topic



# Funções de gerenciamento de fóruns
def get_forum_posts(db: Session, topic_id: int, skip: int = 0, limit: int = 10):
    return db.query(models.ForumPost).filter(models.ForumPost.topic_id == topic_id).offset(skip).limit(limit).all()

def create_forum_post(db: Session, post: schemas.ForumPostCreate, topic_id: int, user_id: int, image_path: Optional[str] = None):
    db_post = models.ForumPost(content=post.content, topic_id=topic_id, user_id=user_id, image_path=image_path)
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

# def create_forum_post(db: Session, post: schemas.ForumPostCreate, topic_id: int, user_id: int, image_path: Optional[str] = None):
#     db_post = models.ForumPost(
#         content=post.content,
#         topic_id=topic_id,
#         user_id=user_id,
#         image_path=image_path
#     )
#     db.add(db_post)
#     db.commit()
#     db.refresh(db_post)
#     return db_post


import os

def delete_forum_post(db: Session, post_id: int):
    db_post = db.query(models.ForumPost).filter(models.ForumPost.id == post_id).first()
    if db_post:
        # Excluir a imagem associada, se existir
        if db_post.image_path:
            try:
                os.remove(db_post.image_path)
            except Exception as e:
                print(f"Error deleting image file {db_post.image_path}: {e}")

        db.delete(db_post)
        db.commit()
    return db_post


def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def is_user_authorized_to_edit_or_delete_topic(db: Session, user_id: int) -> bool:
    user = get_user_by_id(db, user_id)
    return user.role in ["admin", "teacher"]
