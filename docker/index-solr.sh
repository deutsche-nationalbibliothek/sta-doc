#!/bin/bash

npm run split-entities &&
	npm run docker:solr:index &&
	echo 'done'