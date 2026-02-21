from sqlalchemy.orm import Session
import models, schemas

def get_projects(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Project).offset(skip).limit(limit).all()

def get_project(db: Session, project_id: int):
    return db.query(models.Project).filter(models.Project.id == project_id).first()

def create_project(db: Session, project: schemas.ProjectCreate):
    # Convert list of tags to JSON string if needed, or rely on SQLAlchemy's JSON type
    db_project = models.Project(**project.model_dump())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

def delete_project(db: Session, project_id: int):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if project:
        db.delete(project)
        db.commit()
    return project

def update_project(db: Session, project_id: int, project: schemas.ProjectCreate):
    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if db_project:
        for key, value in project.model_dump().items():
            setattr(db_project, key, value)
        db.commit()
        db.refresh(db_project)
    return db_project

def get_cv(db: Session):
    cv = db.query(models.CV).first()
    if not cv:
        # Create an empty CV if none exists
        cv = models.CV(about="", experience="", education="", photo_url="", skills=[])
        db.add(cv)
        db.commit()
        db.refresh(cv)
    return cv

def update_cv(db: Session, cv: schemas.CVCreate):
    db_cv = db.query(models.CV).first()
    if not db_cv:
        db_cv = models.CV(**cv.model_dump())
        db.add(db_cv)
    else:
        for key, value in cv.model_dump().items():
            setattr(db_cv, key, value)
    db.commit()
    db.refresh(db_cv)
    return db_cv

def get_translations(db: Session):
    return db.query(models.Translation).all()

def upsert_translations(db: Session, language: str, translations: dict):
    # First, fetch existing translations for the language
    existing_translations = db.query(models.Translation).filter(
        models.Translation.language == language
    ).all()
    
    existing_map = {t.key: t for t in existing_translations}

    for key, value in translations.items():
        if key in existing_map:
            # Update
            existing_map[key].value = value
        else:
            # Insert
            new_translation = models.Translation(language=language, key=key, value=value)
            db.add(new_translation)
            
    db.commit()
