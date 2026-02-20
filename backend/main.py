from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
from datetime import timedelta
import models, schemas, crud, auth
from database import engine, get_db, SessionLocal

# Create tables
models.Base.metadata.create_all(bind=engine)

import os
from dotenv import load_dotenv
load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create initial admin user if not exists
    db = SessionLocal()
    try:
        admin_username = os.getenv("ADMIN_USERNAME", "admin")
        admin_password = os.getenv("ADMIN_PASSWORD", "admin123")
        admin = db.query(models.User).filter(models.User.username == admin_username).first()
        if not admin:
            hashed_password = auth.get_password_hash(admin_password)
            db_user = models.User(username=admin_username, hashed_password=hashed_password)
            db.add(db_user)
            db.commit()
    finally:
        db.close()
    yield  # App runs here

app = FastAPI(title="DevPortfolio API", lifespan=lifespan)

# CORS setup

origins = [
    os.getenv("FRONTEND_URL", "http://localhost:5173"),
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/media", StaticFiles(directory="media"), name="media")

from fastapi import File, UploadFile
import uuid

ALLOWED_UPLOAD_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"}
MAX_UPLOAD_BYTES = int(os.getenv("MAX_UPLOAD_BYTES", 5 * 1024 * 1024))
UPLOAD_CHUNK_SIZE = 1024 * 1024

@app.post("/upload")
async def upload_file(file: UploadFile = File(...), current_user: models.User = Depends(auth.get_current_user)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename is required")

    original_name = os.path.basename(file.filename)
    _, file_extension = os.path.splitext(original_name)
    file_extension = file_extension.lower()
    if file_extension not in ALLOWED_UPLOAD_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    os.makedirs("media", exist_ok=True)

    # Create unique filename
    filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join("media", filename)

    size = 0
    try:
        with open(file_path, "wb") as buffer:
            while True:
                chunk = await file.read(UPLOAD_CHUNK_SIZE)
                if not chunk:
                    break
                size += len(chunk)
                if size > MAX_UPLOAD_BYTES:
                    raise HTTPException(status_code=413, detail="File too large")
                buffer.write(chunk)
    except HTTPException:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise
    finally:
        await file.close()

    # Return absolute URL
    url = f"{os.getenv('BACKEND_URL', 'http://127.0.0.1:8000')}/media/{filename}"
    return {"url": url}

@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/auth/verify")
def verify_token(current_user: models.User = Depends(auth.get_current_user)):
    return {"status": "ok", "user": current_user.username}

@app.get("/projects/", response_model=List[schemas.Project])
def read_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    projects = crud.get_projects(db, skip=skip, limit=limit)
    return projects

@app.get("/projects/{project_id}", response_model=schemas.Project)
def read_project(project_id: int, db: Session = Depends(get_db)):
    db_project = crud.get_project(db, project_id=project_id)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project

import traceback

@app.post("/projects/", response_model=schemas.Project)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    try:
        return crud.create_project(db=db, project=project)
    except Exception as e:
        print("------------- ERROR CREATING PROJECT -------------")
        print(f"Error: {e}")
        traceback.print_exc()
        print("--------------------------------------------------")
        raise e

@app.delete("/projects/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return crud.delete_project(db=db, project_id=project_id)

@app.put("/projects/{project_id}", response_model=schemas.Project)
def update_project(project_id: int, project: schemas.ProjectCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_project = crud.update_project(db=db, project_id=project_id, project=project)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project

@app.get("/")
def read_root():
    return {"message": "Welcome to DevPortfolio API"}

