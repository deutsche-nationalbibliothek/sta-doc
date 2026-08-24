#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

if [[ -z "${NEXT_PUBLIC_URL:-}" ]]; then
  echo "NEXT_PUBLIC_URL must be set in .env" >&2
  exit 1
fi

if [[ -z "${IP_ADDRESS:-}" ]]; then
  echo "IP_ADDRESS must be set in .env" >&2
  exit 1
fi

# extra_hosts needs hostname:ip. Derive the hostname from NEXT_PUBLIC_URL
# unless MEDIAWIKI_HOST is already set.
if [[ -z "${MEDIAWIKI_HOST:-}" ]]; then
  MEDIAWIKI_HOST="${NEXT_PUBLIC_URL#http://}"
  MEDIAWIKI_HOST="${MEDIAWIKI_HOST#https://}"
  MEDIAWIKI_HOST="${MEDIAWIKI_HOST%%/*}"
fi
export MEDIAWIKI_HOST IP_ADDRESS

exec docker-compose "$@"
