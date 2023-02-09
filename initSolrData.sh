#!/bin/bash
data_input_path=$1
solr_bin_path=$2
data_output_path=$3

mapfile -t key_arr < <(jq -r 'keys[]' $data_input_path/entities.json)
mapfile -t value_arr < <(jq -r 'keys[] as $key | .[$key].entity | @json' $data_input_path/entities.json)
# printf "%s\n" "${key_arr[0]}"
# printf "%s\n" "${value_arr[0]}"
for i in "${!value_arr[@]}"; do 
  # printf "%s\t%s\n" "${key_arr[$i]}" "${value_arr[$i]}"
  echo ${value_arr[$i]} > $data_output_path/${key_arr[$i]}.json
done

$solr_bin_path/post -c doku3 data_output_path/*.json

echo "First argument: ${data_input_path}"
echo "Second argument: ${solr_bin_path}"
echo "Third argument: ${data_output_path}"

echo Done loading initial document data.
