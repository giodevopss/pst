#!/usr/bin/env sh
set -eu

PORT="${PORT:-3000}"
HOST="${HOST:-127.0.0.1}"
URL="http://${HOST}:${PORT}"

echo "Iniciando servidor em ${URL} ..."

if command -v lsof >/dev/null 2>&1; then
  PIDS="$(lsof -ti tcp:${PORT} || true)"
  if [ -n "${PIDS}" ]; then
    echo "Liberando porta ${PORT}..."
    echo "${PIDS}" | xargs kill -9 >/dev/null 2>&1 || true
  fi
fi

npm run dev -- --webpack --hostname "${HOST}" --port "${PORT}" &
SERVER_PID=$!

sleep 2

if command -v open >/dev/null 2>&1; then
  open "${URL}" || true
fi

echo "Browser: ${URL}"
echo "PID: ${SERVER_PID}"
echo "Para parar: kill ${SERVER_PID}"

wait "${SERVER_PID}"
