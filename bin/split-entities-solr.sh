#!/bin/bash

mkdir -p ./docker/solr/data
rm ./docker/solr/data/*

jq -r 'to_entries[] | "\(.key)\t\(.value.entity)"' ./data/parsed/entities.json | while IFS=$'\t' read -r key value; do
  touch ./docker/solr/data/"$key".json
  echo "$value" > ./docker/solr/data/"$key".json
done
