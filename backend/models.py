from sqlalchemy import Column, Integer, String, Text, JSON
from database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(JSON, default=dict) # {"en": "Title", "ru": "Название", "et": "Pealkiri"}
    description = Column(JSON, default=dict)
    github_link = Column(String(255))

    images = Column(JSON, default=list) # Storing list of image URLs
    tags = Column(JSON, default=list) # Storing tags as a JSON list

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, index=True)
    hashed_password = Column(String(255))

class CV(Base):
    __tablename__ = "cv"

    id = Column(Integer, primary_key=True, index=True)
    about = Column(Text, default="")
    experience = Column(Text, default="")
    education = Column(Text, default="")
    photo_url = Column(String(255), default="")
    skills = Column(JSON, default=list)  # Storing skills as a list of dicts

class Translation(Base):
    __tablename__ = "translations"

    id = Column(Integer, primary_key=True, index=True)
    language = Column(String(255), index=True)
    key = Column(String(255), index=True)
    value = Column(Text)
