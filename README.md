## Install procedure ##

1. Install and run [Mongodb](http://www.mongodb.org/) on standard port
1. Copy config file ```config/default.js.sample``` to ```config/default.js``` and fill in the appropriate fields

## 'run' file ##

- ```./run sandbox``` to run the web app server locally with default port of 4000 (hostname of localhost:4000). Additionally, you can get pretty output via ```./run sandbox | util/pretty.js```
- ```./run prod``` to run the server locally using client-side optimized output. This also uses ```config/prod.js```
- ```./run test``` to run unit tests
- ```./run lint``` to run js linter

## High level framework documentation ##

The framework is built in layers. Layers can be asynchronous.

1. Routes -- routes for a single resource only to transform parameters (app/routes/)
  - calls middleware for parameter checks (app/middleware)
1. Handlers -- handles insertion into history (app/handlers/)
  - returns data when read operations
  - writes minimal amount of data to log what happened in history for write operations (history/history)
1. Historian -- business logic of what tables to populate based on what has happened (historian/)
  - can become async, but right now synchronously called right after a history element is inserted

## Rebase workflow ##

For collaborators, I prefer [rebase workflow](http://randyfay.com/node/91) as opposed to merge workflow.
