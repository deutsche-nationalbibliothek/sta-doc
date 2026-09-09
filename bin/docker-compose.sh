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

host_from_url() {
  local url="$1"
  url="${url#http://}"
  url="${url#https://}"
  printf '%s' "${url%%/*}"
}

if [[ -z "${MEDIAWIKI_HOST:-}" ]]; then
  MEDIAWIKI_HOST="$(host_from_url "$NEXT_PUBLIC_URL")"
fi
if [[ -z "${API_URL_PROD_HOST:-}" ]]; then
  API_URL_PROD_HOST="$(host_from_url "${API_URL_PROD:-https://edit.sta.dnb.de}")"
fi
# Optional EXTRA_HOST_IP when Docker cannot reach MediaWiki via IP_ADDRESS
# (public/SCP IP vs internal docker-network IP).
if [[ -n "${EXTRA_HOST_IP:-}" ]]; then
  IP_ADDRESS="$EXTRA_HOST_IP"
fi

# Compose 5 rejects duplicate extra_hosts hostnames. Mapping keys are unique.
cat > .compose-extra-hosts.yml <<EOF
services:
  nextjs:
    extra_hosts:
      ${MEDIAWIKI_HOST}: ${IP_ADDRESS}
EOF
if [[ "$API_URL_PROD_HOST" != "$MEDIAWIKI_HOST" ]]; then
  cat >> .compose-extra-hosts.yml <<EOF
      ${API_URL_PROD_HOST}: ${IP_ADDRESS}
EOF
fi

exec docker-compose -f .compose-extra-hosts.yml "$@"
