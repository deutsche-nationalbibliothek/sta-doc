#!/bin/bash

# Check if the .env file exists
echo "Check for .env file set properly..."
if [ ! -f .env ]; then
  echo "Error: .env file not found. Please create the file and add the IP address."
  exit 1
fi

# Read the IP address from the .env file
echo "Read the IP of the remote server."
IP_ADDRESS=$(grep IP_ADDRESS= .env | cut -d '=' -f 2)

# Copy the tar file to a remote server using scp
echo "Copying solr index data to remote server..."
scp -r docker/solr/data wikiuser@$IP_ADDRESS:/home/wikiuser/sta-doc/docker/solr

