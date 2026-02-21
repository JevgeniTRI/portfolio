from pydantic import BaseModel, Field
from typing import List, Optional

class ProjectBase(BaseModel):
    title: str
    description: str
    github_link: Optional[str] = None
    images: List[str] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class User(BaseModel):
    username: str

class CVBase(BaseModel):
    about: str = ""
    experience: str = ""
    education: str = ""
    photo_url: str = ""
    skills: List[dict] = Field(default_factory=list)

class CVCreate(CVBase):
    pass

class CV(CVBase):
    id: int

    class Config:
        from_attributes = True

class TranslationBase(BaseModel):
    key: str
    value: str

class Translation(TranslationBase):
    id: int
    language: str

    class Config:
        from_attributes = True

class TranslationBulkUpdate(BaseModel):
    language: str
    translations: dict[str, str]
