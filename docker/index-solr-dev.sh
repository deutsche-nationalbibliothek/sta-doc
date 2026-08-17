#!/bin/bash
set -euo pipefail

docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec -T solr bash index.sh
SOLR_HOST=localhost SOLR_PORT=8983 npm run solr:index -- "$@"
