#!/bin/bash

mkdir -p ./docker/solr/data
rm ./docker/solr/data/*

# jq -r 'to_entries[] | "\(.key)\t\(.value.entity)"' ./data/parsed/entities.json | while IFS=$'\t' read -r key value; do
#   touch ./docker/solr/data/"$key".json
#   echo "$value" > ./docker/solr/data/"$key".json
# done

# Split entitites.json into separate files
key_count=$(jq 'keys | length' "./data/parsed/entities.json")
echo jq 'keys | length' ./data/parsed/entities.json
echo "Split $key_count entities into single files."
mapfile -t key_arr < <(jq -r 'keys[]' ./data/parsed/entities.json)
mapfile -t value_arr < <(jq -r 'keys[] as $key | .[$key].entity | @json' ./data/parsed/entities.json)

#for i in {1..50}; do
for i in "${!value_arr[@]}"; do
  # printf "%s\t%s\n" "${key_arr[$i]}" "${value_arr[$i]}"
  echo ${value_arr[$i]} > ./docker/solr/data/${key_arr[$i]}.json
done
