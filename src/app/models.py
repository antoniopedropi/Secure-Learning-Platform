from xmlrpc.client import DateTime

from sqlalchemy import Table, Column, Integer, String, Text, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from .database import Base

# Tabela associativa para participants de cursos
course_participants = Table('course_participants', Base.metadata,
                         Column('course_id', Integer, ForeignKey('courses.id')),
                         Column('user_id', Integer, ForeignKey('users.id')))

# Tabela associativa para owners de cursos
course_owners = Table('course_owners', Base.metadata,
                      Column('course_id', Integer, ForeignKey('courses.id')),
                      Column('user_id', Integer, ForeignKey('users.id')))

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    role = Column(String, default="student")

    owned_courses = relationship("Course", secondary=course_owners, back_populates="owners")
    participating_courses = relationship("Course", secondary=course_participants, back_populates="participants")
    forum_posts = relationship("ForumPost", back_populates="user")

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    owners = relationship("User", secondary=course_owners, back_populates="owned_courses")
    participants = relationship("User", secondary=course_participants, back_populates="participating_courses")
    topics = relationship("Topic", back_populates="course")
class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(Text)
    state = Column(String, default="draft")
    visibility = Column(String, default="private")  # 'public' or 'private'
    course_id = Column(Integer, ForeignKey("courses.id"))

    course = relationship("Course", back_populates="topics")
    forum_posts = relationship("ForumPost", back_populates="topic")

class ForumPost(Base):
    __tablename__ = "forum_posts"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text)
    topic_id = Column(Integer, ForeignKey("topics.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))  # Use datetime.now(timezone.utc)
    image_path = Column(String, nullable=True)  # Campo para armazenar o caminho da imagem


    topic = relationship("Topic", back_populates="forum_posts")
    user = relationship("User", back_populates="forum_posts")
