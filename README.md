[![npm package](https://img.shields.io/npm/v/apollo-link-pouch/latest.svg)](https://www.npmjs.com/package/apollo-link-pouch)
[![npm downloads](https://img.shields.io/npm/dm/apollo-link-pouch.svg)](https://www.npmjs.com/package/apollo-link-pouch)

## Apollo-link-pouch

Provides an Apollo Link to use GraphQL with a local PouchDB.

Inspired by [apollo-link-firebase](https://github.com/Canner/apollo-link-firebase).

## Installation

```console
npm install apollo-link-pouchdb
```

## Getting Started

```typescript
import PouchDB from 'pouchdb'
import { createPouchLink } from 'apollo-link-pouch'

const client = new ApolloClient({
  link: createPouchLink({
    database: new PouchDB('my-database')
  }),
  cache: new InMemoryCache()
})
```

# Roadmap

## PouchDB API

- [x] get

  ```js
  const query = gql`
    query getPerson {
      person @pdbGet(id: "1") {
        _id
        _rev
        name
      }
    }
  `
  ```

- [x] bulkGet

  ```js
  const query = gql`
    query bulkGet {
      people @pdbBulkGet(docs: [{ id: "1" }, { id: "2" }]) {
        results {
          docs {
            ok {
              _id
              _rev
              name
            }
          }
        }
      }
    }
  `
  ```

- [ ] put

- [ ] bulkDocs

- [x] allDocs

  ```js
  const query = gql`
    query allDocs {
      people @pdbAllDocs(keys: ["1", "2"], include_docs: true) {
        rows {
          id
          rev
          doc
          value
        }
        total_rows
        offset
      }
    }
  `
  ```

- [ ] query

- [ ] find

## Features

- [ ] subscriptions (using sync listeners?)

- [x] plugins (queries only for now)

  using [pouchdb-quick-search](https://github.com/pouchdb-community/pouchdb-quick-search)

  ```js
  PouchDB.plugin(require('pouchdb-quick-search'))

  const query = gql`
    query searchPlugin {
      search @pdbPlugin @search(query: "bob", fields: ["name"]) {
        rows {
          id
          score
        }
        total_rows
      }
    }
  `
  ```
