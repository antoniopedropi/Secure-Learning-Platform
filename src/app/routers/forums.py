from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import crud, schemas, database, auth

router = APIRouter()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/topics/{topic_id}/forum_posts/", response_model=schemas.ForumPost)
def create_forum_post(topic_id: int, post: schemas.ForumPostCreate, db: Session = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_active_user)):
    return crud.create_forum_post(db=db, post=post, topic_id=topic_id, user_id=current_user.id)

@router.get("/topics/{topic_id}/forum_posts/", response_model=list[schemas.ForumPost])
def read_forum_posts(topic_id: int, skip: int = 0, limit: int = 10, db: Session = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_active_user)):
    posts = crud.get_forum_posts(db, topic_id=topic_id, skip=skip, limit=limit)
    return posts

@router.delete("/forum_posts/{post_id}", response_model=schemas.ForumPost)
def delete_forum_post(post_id: int, db: Session = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_active_user)):
    return crud.delete_forum_post(db, post_id=post_id)
