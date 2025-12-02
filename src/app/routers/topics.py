import imghdr
import os
import bleach
from typing import Optional
from uuid import uuid4
import re

from fastapi import APIRouter, Depends, HTTPException, UploadFile, Form
from sqlalchemy.orm import Session

from .. import crud, schemas, auth
from ..auth import get_current_active_user
from ..dependencies import get_db

router = APIRouter()


@router.post("/courses/{course_id}/topics/", response_model=schemas.Topic)
def create_topic(course_id: int, topic: schemas.TopicCreate, db: Session = Depends(get_db),
                 current_user: schemas.User = Depends(auth.get_current_active_user)):
    return crud.create_topic(db=db, topic=topic, course_id=course_id)


@router.get("/courses/{course_id}/topics/", response_model=list[schemas.Topic])
def read_topics(course_id: int, skip: int = 0, limit: int = 10, db: Session = Depends(get_db),
                current_user: schemas.User = Depends(auth.get_current_active_user)):
    return crud.get_topics(db, course_id=course_id, skip=skip, limit=limit)


@router.get("/topics/{topic_id}", response_model=schemas.Topic)
def read_topic(topic_id: int, db: Session = Depends(get_db),
               current_user: schemas.User = Depends(get_current_active_user)):
    db_topic = crud.get_topic(db, topic_id=topic_id)
    if db_topic is None:
        raise HTTPException(status_code=404, detail="Topic not found")
    # db_course = crud.get_course(db, db_topic.course_id)
    # if current_user not in db_course.owners and current_user not in db_course.participants:
    #     raise HTTPException(status_code=403, detail="Not enough privileges")
    return db_topic


@router.put("/topics/{topic_id}", response_model=schemas.Topic)
def update_topic(topic_id: int, topic: schemas.TopicUpdate, db: Session = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    if not crud.is_user_authorized_to_edit_or_delete_topic(db, current_user.id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to edit this topic")
    db_topic = crud.get_topic(db, topic_id=topic_id)
    if db_topic is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Topic not found")
    return crud.update_topic(db=db, topic=topic, topic_id=topic_id)

@router.delete("/topics/{topic_id}", response_model=schemas.Topic)
def delete_topic(topic_id: int, db: Session = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    if not crud.is_user_authorized_to_edit_or_delete_topic(db, current_user.id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this topic")
    db_topic = crud.get_topic(db, topic_id=topic_id)
    if db_topic is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Topic not found")
    return crud.delete_topic(db=db, topic_id=topic_id)


@router.put("/topics/{topic_id}/publish", response_model=schemas.Topic)
def publish_topic(topic_id: int, db: Session = Depends(get_db),
                  current_user: schemas.User = Depends(auth.get_current_active_user)):
    return crud.publish_topic(db, topic_id=topic_id)

def sanitize_content(content: str) -> str:
    allowed_tags = ['b', 'i', 'u', 'a', 'p', 'br', 'ul', 'li', 'ol', 'strong', 'em']
    allowed_attributes = {'a': ['href', 'title']}
    return bleach.clean(content, tags=allowed_tags, attributes=allowed_attributes, strip=True)

@router.post("/topics/{topic_id}/forum_posts/", response_model=schemas.ForumPost)
def create_forum_post(
        topic_id: int,
        content: str = Form(...),  # Usar Form para aceitar dados de formulário
        db: Session = Depends(get_db),
        current_user: schemas.User = Depends(auth.get_current_active_user),
        file: Optional[UploadFile] = None  # Usar UploadFile para aceitar arquivos
):  # Diretório para armazenar uploads de arquivos

    upload_directory = "uploads/"
    if not os.path.exists(upload_directory):
        os.makedirs(upload_directory)

    pattern = r'[<>]'
    if re.search(pattern, content):
        raise ValueError("Content contains forbidden pattern")

    image_path = None
    if file:
        # Verificar tipo de arquivo permitido
        file_extension = file.filename.split(".")[-1].lower()
        # print("FILE_EXT: ", file_extension)
        allowed_extensions = {"jpg", "jpeg", "png", "gif", "txt", "pdf", "docx"}
        if file_extension not in allowed_extensions:
            raise HTTPException(status_code=400, detail="File type not allowed")
        
        # # Verificar tipo de arquivo verdadeiro
        # try:
        #     file_type = imghdr.what(file.file)
        #     if file_type not in allowed_extensions:
        #         raise HTTPException(status_code=400, detail="Invalid file type")
        # except Exception:
        #     raise HTTPException(status_code=400, detail="Invalid file type")

        # Limitar tamanho do arquivo (ex: 2MB)
        max_file_size = 2 * 1024 * 1024
        file.file.seek(0, os.SEEK_END)
        file_size = file.file.tell()
        file.file.seek(0, os.SEEK_SET)
        if file_size > max_file_size:
            raise HTTPException(status_code=400, detail="File too large")

        # Salvar arquivo com nome seguro
        unique_filename = f"{uuid4()}.{file_extension}"
        file_path = os.path.join(upload_directory, unique_filename)
        with open(file_path, "wb") as image:
            image.write(file.file.read())
        image_path = file_path

    sanitized_content = bleach.clean(
    content,
    tags=['b', 'i', 'u', 'a', 'p', 'br', 'ul', 'li', 'ol', 'strong', 'em'],
    attributes={'a': ['href', 'title']},
    strip=True
    )

    return crud.create_forum_post(
        db=db,
        post=schemas.ForumPostCreate(content=sanitized_content),
        topic_id=topic_id,
        user_id=current_user.id,
        image_path=image_path
    )

    # return crud.create_forum_post(db=db, post=schemas.ForumPostCreate(content=content), topic_id=topic_id,
    #                               user_id=current_user.id, image_path=image_path)


@router.get("/topics/{topic_id}/forum_posts/", response_model=list[schemas.ForumPost])
def read_forum_posts(topic_id: int, skip: int = 0, limit: int = 10, db: Session = Depends(get_db),
                     current_user: schemas.User = Depends(auth.get_current_active_user)):
    posts = crud.get_forum_posts(db, topic_id=topic_id, skip=skip, limit=limit)
    return posts


@router.delete("/forum_posts/{post_id}", response_model=schemas.ForumPost)
def delete_forum_post(post_id: int, db: Session = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_active_user)):
    return crud.delete_forum_post(db, post_id=post_id)
