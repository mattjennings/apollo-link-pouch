## Apollo-link-pouchdb

Provides an Apollo Link to use GraphQL with a local PouchDB.

Inspired by [apollo-link-firebase](https://github.com/Canner/apollo-link-firebase).

## Installation

```console
npm install apollo-link-pouchdb
```

## Getting Started

```typescript
import { createPouchLink } from 'apollo-link-pouch'
import PouchDB from 'pouchdb'

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
      person @pouchGet(id: "1") {
        _id
        _rev
        name
      }
    }
  `
  ```

- [ ] bulkGet

- [ ] put

- [ ] bulkDocs

- [ ] query

- [ ] find

## Features

- [ ] subscriptions (using sync listeners?)
