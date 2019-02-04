[![npm package](https://img.shields.io/npm/v/apollo-link-pouch/latest.svg)](https://www.npmjs.com/package/apollo-link-pouch)
[![npm downloads](https://img.shields.io/npm/dm/apollo-link-pouch.svg)](https://www.npmjs.com/package/apollo-link-pouch)

## apollo-link-pouch

Provides an Apollo Link to use GraphQL with a local PouchDB.

Inspired by [apollo-link-firebase](https://github.com/Canner/apollo-link-firebase).

**This is not ready for production! Use at your own risk.** Feel free to make pull requests for any suggestions - I am still rather inexperienced with Apollo and could use the help.

## Demos

[Notes app](https://apollo-link-pouch.mattjennings.io/examples/notes)

## Installation

```console
npm install apollo-link-pouchdb
```

## Getting Started

```js
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

- [x] put

  ```js
  const mutation = gql`
    fragment PersonInput on pouchdb {
      _id: String
      _rev: string
      name: String
    }

    mutation putDoc($input: PersonInput!) {
      updatePerson(input: $input) @pdbPut {
        ok
        _rev # for consistency with input, "rev" from db.put response is returned as "_rev"
        name
      }
    }
  `
  ```

  `@pdbPut` also takes an options argument for put options

- [x] post

  ```js
  const mutation = gql`
    fragment PersonInput on pouchdb {
      _id: String
      _rev: string
      name: String
    }

    mutation postDoc($input: PersonInput!) {
      createPerson(input: $input) @pdbPost {
        _id
        _rev
        name
      }
    }
  `
  ```

  `@pdbPost` also takes an options argument for post options

- [x] bulkDocs

  ```js
  const mutation = gql`
    fragment PersonInput on pouchdb {
      _id: String
      _rev: string
      name: String
    }

    mutation postDoc($input: [PersonInput]!) {
      savePeople(input: $input) @pdbBulkDocs {
        _id
        _rev
        name
      }
    }
  `
  ```

  `@pdbBulkDocs` also takes an options argument for bulkDocs options

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

- [x] query

  ```js
  const query = gql`
    query queryPeople {
      people @pdbQuery(view: "index", include_docs: true) {
        rows {
          doc {
            name
          }
        }
        total_rows
      }
    }
  `
  ```

- [x] find
      supported via `@pdbPlugin`

## Features

- [ ] subscriptions

  - using db change listeners?

- [ ] multiple databases

  - via `@db` directive or additional `db` parameter to all queries/mutations?

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
