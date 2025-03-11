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

### Prepare single entities to be used to fill the solr index
#### `npm run split-entities (Linux)`
This command runs the bash script located at `/bin/split-entities-solr.sh`
It is used to split the whole parsed entities into single representatives (like P18.json, Q2.json, ...) and stores all of them in `docker/solr/data`.
#### `npm run split-entities-powershell (Windows)`
This command runs the bash script located at `/bin/split-entities-solr.ps1` for Windows developers.

#### `npm run data:fetch:properties-items`
This creates/updates two typescript files, each with an `enum`. For readable code references to Items / Properties.
Be aware, this command may break the build process and `enum` member references may need to be adapted if the corresponding label has changed.

### Running the application

The application can be run in docker containers or on the host system. The application is configured to use the `basePath` as to be `/doc`.

#### Developer Mode

Start developing with 
- `npm run install && npm run dev` or 
- `npm run docker:dev:build; npm run docker:dev:up && sh ./docker/index-solr-dev.sh`

#### Production Mode

Start testing the productive version with
(Test local without solr search)
- `npm run build && npm run start`
(Test with docker compose setup)
- `npm run docker:build; npm run docker:up && sh ./docker/index-solr.sh`

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
- [solr-client](https://lbdremy.github.io/solr-node-client/)
- [slugify](https://github.com/simov/slugify#slugify)
- [react-highlight-words](https://github.com/bvaughn/react-highlight-words#usage)
- [copy-to-clipboard](https://github.com/sudodoki/copy-to-clipboard#copy-to-clipboard-)
