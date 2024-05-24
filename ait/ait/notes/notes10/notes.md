Environment variables - available to a process
process.env.HOME

PORT=1234 node app.mjs

accessing mongo
* cli client
* libraries
    * mongodb - official lib
    * mongoose - odm
    * prisma

mongoose
* application level constraints
    * what are the props of each doc
    * what are the types
    * others (min length, part of enum)
* connecting to an actual running instance of mongodb
* maps documents to actual JavaScript objects

2 categories
* sql (relational databases)
* nosql

sql
* tabular data
* data organized in separate tables
* rows and columns
* u have to specify a tables cols and their types before inserting data
* transactions
    * multiple operations that are taken as a whole (atomic)
    * atomic - all or nothing
    * consistent - when transaction is done, db is left in valid state
    * isolated - if transaction fails does not affect others
    * durable - if u shutdown ur server, then all transactions that have finished will still be there
* typically, pretty rigid
* exmaples:
    * mariadb/mysql - js
    * postgres - python
    * sqlite
    * sqlserver - .net

nosql
1. document store (data is stored in json, xml, in some doc format)
    * mongodb
2. object
    * postgres
3. key value store
4. graph
    * neo4j

mongodb
* setup is easy
* format is json (we know this)
* query language (js)
* support - many node libraries
    * mongoose
    * mongodb
    * prisma