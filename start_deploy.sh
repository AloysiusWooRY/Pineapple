#!/bin/bash

cd backend && tmux new-session -d -s backend_ter 'npm run start'
cd ../frontend/build && tmux new-session -d -s frontend_ter 'serve -s'