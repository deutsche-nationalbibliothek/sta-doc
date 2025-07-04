# split-entities-solr.ps1

# Create the directory if it doesn't exist
New-Item -ItemType Directory -Path "./docker/solr/data" -Force

# Remove all files in the directory
Remove-Item -Path "./docker/solr/data/*" -Force

# Load the JSON file
$json = Get-Content -Path "./data/parsed/entities-de.json" -Raw | ConvertFrom-Json

# Split the entities into separate files
foreach ($key in $json.PSObject.Properties.Name) {
  $value = $json.$key.entity | ConvertTo-Json
  $value | Out-File -FilePath "./docker/solr/data/$key.json" -Encoding utf8
}