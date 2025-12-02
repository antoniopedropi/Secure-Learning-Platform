from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import crud, schemas, database, auth

router = APIRouter()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/users/", response_model=list[schemas.User])
def read_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_admin_user)):
    users = crud.get_users(db, skip=skip, limit=limit)
    # Excluir conta de admin
    users = [user for user in users if user.role != 'admin']
    return users


@router.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_admin_user)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_admin_user)):
    return crud.create_user(db=db, user=user)


@router.put("/users/{user_id}", response_model=schemas.User)
def update_user(user_id: int, user: schemas.UserCreate, db: Session = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_admin_user)):
    return crud.update_user(db, user_id=user_id, user=user)

@router.delete("/users/{user_id}", response_model=schemas.User)
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_admin_user)):
    return crud.delete_user(db, user_id=user_id)
