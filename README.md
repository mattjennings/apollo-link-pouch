## Apollo-link-pouchdb

Provides an Apollo Link to use GraphQL with a local PouchDB.

Inspired by [apollo-link-firebase](https://github.com/Canner/apollo-link-firebase).

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
