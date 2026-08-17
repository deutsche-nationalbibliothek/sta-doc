#!/bin/bash
set -euo pipefail

COMPOSE_FILES="-f docker-compose.yml -f docker-compose.prod.yml"

docker-compose $COMPOSE_FILES exec -T solr bash index.sh

if curl -sf "http://localhost:8983/solr/entities/admin/ping" >/dev/null; then
  SOLR_HOST=localhost SOLR_PORT=8983 npm run solr:index -- "$@"
else
  docker-compose $COMPOSE_FILES run --rm --no-deps \
    -v "$PWD/data:/srv/data" \
    -e SOLR_HOST=solr \
    -e SOLR_PORT=8983 \
    nextjs npm run solr:index -- "$@"
fi
