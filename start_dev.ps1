# Start Backend
Start-Process -FilePath "python" -ArgumentList "-m uvicorn main:app --reload --port 8000" -WorkingDirectory "backend"

# Start Frontend
Start-Process -FilePath "npm.cmd" -ArgumentList "run dev" -WorkingDirectory "frontend"
