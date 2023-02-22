FROM solr:9.1.1

COPY --chown=solr:solr ./entities-config /var/solr/data/entities/conf
COPY ./index.sh /opt/solr/
COPY ./data/* /opt/solr/data/

# todo, do indexing on build
# RUN /bin/sh -c "./bin/solr start -p 8984 & /bin/sleep 2 && sh /opt/solr/index.sh"
