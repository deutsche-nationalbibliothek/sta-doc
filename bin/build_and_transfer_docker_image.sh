#!/bin/bash

# Check if the .env file exists
echo "Check for .env file set properly..."
if [ ! -f .env ]; then
  echo "Error: .env file not found. Please create the file and add the IP address."
  exit 1
fi

# Read the IP address from the .env file
echo "Read the IP"
IP_ADDRESS=$(grep IP_ADDRESS= .env | cut -d '=' -f 2)

# Build the image for the nextjs project
#npm run docker:build nextjs

# Tag the Docker image
echo "Tagging the Docker image..."
docker tag sta-doc-nextjs sta-doc_nextjs

# Save the Docker image to a tar file
echo "Saving the Docker image to a tar file..."
docker save sta-doc_nextjs:latest > sta-doc-multilingual-edit.tar

# Copy the tar file to a remote server using scp
echo "Copying the tar file to a remote server..."
scp sta-doc-multilingual-edit.tar wikiuser@$IP_ADDRESS:/home/wikiuser/sta-doc/
#ssh wikiuser@10.10.14.210 "mkdir -p /home/wikiuser/docker_images && tar -xvf -" < sta-doc-multilingual-edit.tar

echo "Jobs done."
