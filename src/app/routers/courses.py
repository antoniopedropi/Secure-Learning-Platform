from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import crud, schemas, auth
from ..auth import get_current_active_user
from ..dependencies import get_db

router = APIRouter()



@router.post("/courses/", response_model=schemas.Course)
def create_course(course: schemas.CourseCreate, db: Session = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_admin_user)):
    return crud.create_course(db=db, course=course, owner_id=current_user.id)

@router.get("/courses/", response_model=list[schemas.Course])
def read_courses(skip: int = 0, limit: int = 10, db: Session = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_active_user)):
    courses = crud.get_courses(db, skip=skip, limit=limit)
    return courses

@router.get("/courses/{course_id}", response_model=schemas.Course)
def read_course(course_id: int, db: Session = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_active_user)):
    db_course = crud.get_course(db, course_id=course_id)
    if db_course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    return db_course

@router.put("/courses/{course_id}", response_model=schemas.Course)
def update_course(course_id: int, course: schemas.CourseCreate, db: Session = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_active_user)):
    if not crud.is_user_authorized_to_edit_course(db, current_user.id, course_id):
        raise HTTPException(status_code=403, detail="Not authorized to edit this course")
    return crud.update_course(db=db, course=course, course_id=course_id)

@router.delete("/courses/{course_id}", response_model=schemas.Course)
def delete_course(course_id: int, db: Session = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_admin_user)):
    return crud.delete_course(db, course_id=course_id)

@router.post("/courses/{course_id}/owners/{user_id}", response_model=schemas.Course)
def add_owner_to_course(course_id: int, user_id: int, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_active_user)):
    # Verificar se o current_user é um owner do curso ou admin
    db_course = crud.get_course(db, course_id)
    if current_user.role != "admin" and current_user not in db_course.owners:
        raise HTTPException(status_code=403, detail="Not enough privileges")
    return crud.add_course_owner(db, course_id=course_id, user_id=user_id)

@router.delete("/courses/{course_id}/owners/{user_id}", response_model=schemas.Course)
def remove_owner_from_course(course_id: int, user_id: int, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_active_user)):
    # Verificar se o current_user é um owner do curso ou admin
    db_course = crud.get_course(db, course_id)
    if current_user.role != "admin" and current_user not in db_course.owners:
        raise HTTPException(status_code=403, detail="Not enough privileges")
    return crud.remove_course_owner(db, course_id=course_id, user_id=user_id)

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
