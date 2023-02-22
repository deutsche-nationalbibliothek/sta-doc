#!/bin/bash

yarn split-entities && \
  yarn docker:build && \
  docker-compose start solr && \
  yarn docker:solr:index && \
  docker-compose stop solr && \
  echo 'done'
