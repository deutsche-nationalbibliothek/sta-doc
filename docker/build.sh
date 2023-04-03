#!/bin/bash

yarn split-entities &&
	yarn docker:build &&
	yarn docker:up solr &&
	yarn docker:solr:index &&
	docker-compose down solr &&
	echo 'done'
