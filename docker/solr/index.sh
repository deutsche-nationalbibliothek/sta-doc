#!/bin/bash

# Create a new Solr collection
solr create -c entities -s 2 -rf 2 -p 8983 -d /var/solr/data/entities

cd /opt/solr/data # || echo 'no data found' && exit

# Index each split file into the new collection
for file in *.json; do
  /opt/solr-9.1.1/bin/post -c entities "$file"
done

