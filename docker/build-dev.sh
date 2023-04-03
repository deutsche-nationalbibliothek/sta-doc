#!/bin/bash

yarn split-entities &&
	yarn docker:dev:build &&
	yarn docker:dev:up solr &&
	yarn docker:dev:solr:index &&
	docker-compose down solr &&
	echo 'done'
