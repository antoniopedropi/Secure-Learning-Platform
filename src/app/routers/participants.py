from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..auth import get_current_active_user
from ..dependencies import get_db

router = APIRouter()


@router.post("/courses/{course_id}/participants/{user_id}", response_model=schemas.Course)
def add_participant_to_course(course_id: int, user_id: int, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_active_user)):
    db_course = crud.get_course(db, course_id)
    if current_user.role != "admin" and current_user not in db_course.owners:
        raise HTTPException(status_code=403, detail="Not enough privileges")
    return crud.add_course_participant(db, course_id=course_id, user_id=user_id)

@router.delete("/courses/{course_id}/participants/{user_id}", response_model=schemas.Course)
def remove_participant_from_course(course_id: int, user_id: int, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_active_user)):
    db_course = crud.get_course(db, course_id)
    if current_user.role != "admin" and current_user not in db_course.owners:
        raise HTTPException(status_code=403, detail="Not enough privileges")
    return crud.remove_course_participant(db, course_id=course_id, user_id=user_id)
