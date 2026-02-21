from sqlalchemy import Column, Integer, String, Text, JSON
from database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    github_link = Column(String)

    images = Column(JSON, default=list) # Storing list of image URLs
    tags = Column(JSON, default=list) # Storing tags as a JSON list

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class CV(Base):
    __tablename__ = "cv"

    id = Column(Integer, primary_key=True, index=True)
    about = Column(Text, default="")
    experience = Column(Text, default="")
    education = Column(Text, default="")
    photo_url = Column(String, default="")
    skills = Column(JSON, default=list)  # Storing skills as a list of dicts

class Translation(Base):
    __tablename__ = "translations"

    id = Column(Integer, primary_key=True, index=True)
    language = Column(String, index=True)
    key = Column(String, index=True)
    value = Column(Text)
