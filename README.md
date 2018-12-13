## Apollo-link-pouchdb

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

- [ ] allDocs

- [ ] query

- [ ] find

## Features

- [ ] subscriptions (using sync listeners?)
