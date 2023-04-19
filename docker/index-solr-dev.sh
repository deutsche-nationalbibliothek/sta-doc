#!/bin/bash

yarn split-entities &&
	yarn docker:dev:solr:index &&
	echo 'done'
