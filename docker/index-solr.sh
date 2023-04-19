#!/bin/bash

yarn split-entities &&
	yarn docker:solr:index &&
	echo 'done'
