FROM solr:9.1.1

# USER 8983

# RUN mkdir -p /opt/solr/data/

COPY --chown=solr:solr ./entities-config /opt/solr-9.1.1/entities/conf
COPY --chown=solr:solr ./index.sh /opt/solr-9.1.1/

# Documents are posted via the Solr HTTP API (npm run solr:index), not baked into the image.
