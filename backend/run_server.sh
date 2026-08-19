#!/bin/bash
cd /home/user/backend
PYTHON_BIN=$(which python3)
if [ -f "/usr/local/bin/python3" ]; then
  PYTHON_BIN="/usr/local/bin/python3"
fi

while true; do
  echo "[$(date)] Starting FastAPI backend server on port 3000 using $PYTHON_BIN..."
  $PYTHON_BIN main.py
  EXIT_CODE=$?
  echo "[$(date)] Server process exited with code $EXIT_CODE. Restarting in 1 second..."
  sleep 1
done
