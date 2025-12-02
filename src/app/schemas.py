from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

class UserBase(BaseModel):
    id: int
    username: str
    email: str
    role: str

    class Config:
        from_attributes = True

class UserCreate(UserBase):
    password: str

class User(UserBase):
    is_active: bool
    owned_courses: List['Course'] = []
    participating_courses: List['Course'] = []

    class Config:
        from_attributes = True

class CourseBase(BaseModel):
    title: str
    description: str

    class Config:
        from_attributes = True

class CourseCreate(CourseBase):
    pass

class Course(CourseBase):
    id: int
    owners: List[UserBase] = []
    participants: List[UserBase] = []

    class Config:
        from_attributes = True


class TopicBase(BaseModel):
    title: str
    content: str
    state: str
    visibility: str

class TopicCreate(TopicBase):
    pass

class TopicUpdate(TopicBase):
    pass

class Topic(TopicBase):
    id: int
    course_id: int

    class Config:
        from_attributes = True



class ForumPostBase(BaseModel):
    content: str

class ForumPostCreate(ForumPostBase):
    pass

class ForumPost(ForumPostBase):
    id: int
    topic_id: int
    user_id: int
    created_at: datetime
    user: UserBase
    image_path: Optional[str] = None

    class Config:
        from_attributes = True