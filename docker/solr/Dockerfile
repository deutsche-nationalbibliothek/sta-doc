FROM solr:9.1.1

# USER 8983

# RUN mkdir -p /opt/solr/data/

COPY --chown=solr:solr ./entities-config /opt/solr-9.1.1/entities/conf
COPY --chown=solr:solr ./index.sh /opt/solr-9.1.1/
COPY --chown=solr:solr ./data /opt/solr-9.1.1/data

RUN /bin/chown -R solr:solr /opt/solr-9.1.1/data

# todo, do indexing on build
# RUN /bin/sh -c "./bin/solr start -p 8984 & /bin/sleep 2 && sh /opt/solr/index.sh"
