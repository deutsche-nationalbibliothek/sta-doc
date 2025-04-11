#!/bin/bash

npm run split-entities &&
	npm run docker:dev:solr:index &&
	echo 'done'
