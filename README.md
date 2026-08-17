# STA Documentation Platform
The `sta-doc` project is the JS/React/Nextjs based UI representation of the STA Documentation Platform. The documentation data is fetched and parsed from a [MediaWiki instance](https://sta.dnb.de/wiki/Hauptseite) backend and represents the whole documentation in an explorative way to the enduser.

The MediaWiki instance (database) is holding documentation data of two different sources:

- [GND](https://gnd.network/)
  - is the largest collection of cultural and research authority data in the German-speaking countries
- [RDA](http://www.rda-rsc.org/)
  - a standard for descriptive cataloging, providing instructions and guidelines on formulating bibliographic data

In the context of this application `GND` and `RDA` are namespaces, which are having a specific highlight color for distinction.

The goal of this application is to have a unified user interface to read and search these documentation standards.
For example, the dataset about 'Preferred name: person or family' in [MediaWiki](https://sta.dnb.de/wiki/Property:P58) and in [this Application](https://sta.dnb.de/doc/GND-DF-BENENNUNG-BEVORZUGT-PERSON-FAMILIE).

## Overview
The data is pre-fetched and -parsed to compose it in a flexible way, while having no performance dependencies to MediaWiki in production.

### Update data with `npm run data`
This code is fetching, parsing and storing the static data. It runs in the context of `node` and gets relevant data from a pre-defined MediaWiki instance.

#### Data fetching from a mediawiki instance 
`npm run data:fetch`
The fetched data gets saved in `/data/raw/*.json`.

#### Data parsing the fetched raw data
`npm run data:parse`
Transforms all data from `/data/raw/*.json` and saves the result in `/data/parsed/*.json`. The most relevant data file is `/data/parsed/entities.json`, which is the last result of the composition, and it's meant to hold all relevant data for the client, pre-sorted and structured, ready for rendering.

### Update the Solr search index
After parsed entity data changed, post documents to the running Solr collection via the HTTP update API (batched, overwrite by unique key). The collection is created only if it does not exist — it is not recreated on every index.

- `npm run docker:dev:solr:index` — ensure the collection exists, then index `data/parsed/entities-de.json` and `entities-fr.json`
- `npm run solr:index` — same API index against `localhost:8983` (Solr already up, collection already created)
- `npm run solr:index -- --entity P18` — update one entity (de + fr) after `data:parse:single`
- `npm run solr:index -- --ids P18,Q2 --lang de` — update selected documents only

`split-entities` is no longer required for indexing.

#### `npm run data:fetch:properties-items`
This creates/updates two typescript files, each with an `enum`. For readable code references to Items / Properties.
Be aware, this command may break the build process and `enum` member references may need to be adapted if the corresponding label has changed.

### Running the application

The application can be run in docker containers or on the host system. The application is configured to use the `basePath` as to be `/doc`.

#### Developer Mode

Host Next.js with a local Docker Solr instance:

1. `npm install`
2. `npm run docker:dev:build` (first time / after Solr image changes)
3. `npm run docker:dev:solr:up`
4. `npm run docker:dev:solr:index` (create collection if needed + index via Solr API)
5. `npm run dev` — app at `/doc`, Solr at `http://localhost:8983`

`SOLR_HOST` / `SOLR_PORT` default to `localhost` / `8983` (see `.env`). Full docker-dev stack (Next + Solr, no Traefik):

- `npm run docker:dev:build; npm run docker:dev:up && npm run docker:dev:solr:index` — app at `http://localhost:3000/doc`, Solr at `http://localhost:8983`

#### Production Mode

Start testing the productive version with
(Test local without solr search)
- `npm run build && npm run start`
(Test with docker compose setup)
- `npm run docker:build; npm run docker:up && npm run docker:solr:index`

## Documentation

- [React](https://react.dev/reference/react)
- [Next JS](https://nextjs.org/docs)
- [Apache Solr](https://solr.apache.org/guide/solr/latest/index.html)
- [Ant Design](https://ant.design/components/overview/)
- [Emotion](https://emotion.sh/docs/introduction)
- [SWR](https://swr.vercel.app/docs/getting-started)
- [Lodash](https://lodash.com/docs)
- [react-use](https://github.com/streamich/react-use#--------------------react-use------------------)
- [useQueryParams](https://github.com/pbeshai/use-query-params#usequeryparams)
- [slugify](https://github.com/simov/slugify#slugify)
- [react-highlight-words](https://github.com/bvaughn/react-highlight-words#usage)
- [copy-to-clipboard](https://github.com/sudodoki/copy-to-clipboard#copy-to-clipboard-)
