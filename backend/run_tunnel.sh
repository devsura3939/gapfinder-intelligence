#!/bin/bash
while true; do
  echo "[$(date)] Starting Serveo SSH Tunnel..."
  ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=10 -o ServerAliveCountMax=3 -R 80:localhost:3000 serveo.net
  echo "[$(date)] Tunnel disconnected. Re-establishing in 2 seconds..."
  sleep 2
done
