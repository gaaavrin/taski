#!/bin/bash
# Taski launcher – starts Python server then opens the app

DIR="$(cd "$(dirname "$0")" && pwd)"
PORT=27852

# Kill any existing instance on this port
lsof -ti tcp:$PORT | xargs kill -9 2>/dev/null

# Start server
python3 "$DIR/server.py" &
SERVER_PID=$!

# Trap to kill server on exit
trap "kill $SERVER_PID 2>/dev/null" EXIT INT TERM

wait $SERVER_PID
