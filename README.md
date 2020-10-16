# Modern Health Interview Assignment

This project contains a GraphQL API that interacts with a PostgreSQL database using the Sequelize ORM. I used the [graphql-sequelize](https://github.com/mickhansen/graphql-sequelize) library to easily create a graphql API out of the Sequelize models. In addition to this I used [dataloader-sequelize](https://github.com/mickhansen/dataloader-sequelize) to ensure the same data isn't fetched from the database twice.

## Prerequisites

- [Docker](https://www.docker.com/get-started)
- Node v13 (optional)

## Getting started

To start the database and run the api server, run the following command:

```shell
docker-compose up
```

By default, some data is created and added to the database. If you want to run the project without seed data, change `SEED_DATA` to `"false"` in `docker-compose.yml`. To test the api, you can open `http://localhost:4000` in your browser and execute queries in the GraphQL Playground. An example query that expands all the data is below:

```
{
  programs {
    id
    name
    description
    sections {
      id
      name
      description
      overviewImage
      order
      activities {
        id
        content
        options {
          id
          text
        }
      }
    }
  }
}
```

In addition to GraphQL Playground, I added a `test.js` which adds some data and queries it to simulate a client. To run the test file in the docker container, run `docker ps` and copy the `modern-health-assignment_api`'s ID. Then paste it in the command below:

```
CONTAINER=<paste id here>
docker exec -it $CONTAINER sh -c "npm test"
```

You can run these tests locally as well provided you have node installed and there aren't dependency version issues with node and npm. I used node v13.13.0 during development. To run the tests locally, just run `npm i` followed by `npm test`.
