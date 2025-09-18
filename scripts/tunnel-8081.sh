#!/usr/bin/env bash
set -euo pipefail
if lsof -i:8081 >/dev/null 2>&1; then
  echo "Tunnel already up on 8081"; exit 0
fi
ssh -fN -L 8081:localhost:8080 hestia && echo "Tunnel up → http://localhost:8081"
