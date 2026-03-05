#!/bin/bash
cd /data01/virt146264/domeenid/www.jevgeniworks.ee/portfolio/backend
source venv/bin/activate
nohup uvicorn main:app --uds /data01/virt146264/tmp/portfolio_backend.sock > backend.log 2>&1 &
echo "Backend started on port 8000 [PID: $!]"
