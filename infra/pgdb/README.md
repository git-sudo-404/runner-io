#### NOTE: This is to be run only during development

##### init.sql

- This file is copied into the docker-entrypoint-db.d folder of the pgdb container which will be done by dev.yml

##### Seeding the data:

- To seed the data run the seed script of the @repo/db package.

* _Note_: Since using ESM module it expects the file extensions , and since typescript expects the imported files to be in .js extension since that's what they'll compile into , but we don't have that yet , for seeding the data , it actually builds the db package alone and the runs the seed.ts after build is complete.
