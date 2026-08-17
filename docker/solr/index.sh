#!/bin/bash
set -euo pipefail

# Create the entities collection once. Document updates go through the Solr HTTP API
# (npm run solr:index) so we never recreate the collection or post files one-by-one.

if curl -sf "http://localhost:8983/solr/entities/admin/ping" >/dev/null; then
  echo "Solr collection 'entities' already exists"
  exit 0
fi

echo "Creating Solr collection 'entities'"
solr create -c entities -s 2 -rf 2 -p 8983 -d /opt/solr-9.1.1/entities
