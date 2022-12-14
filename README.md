# auto-generate-calendar

## Tech Stack and Instalation

Project was done using

- `Node.JS`
- `Typescript`

Before running the service make sure you have installed

- `Node.JS` version  `14.16.0`
- `NPM` version  `6.14.11`

All source code is inside `src` folder

## How to run

Navigate to the project folder on any terminal

Install node dependencies
`$ npm i`

Create environment variables
`$ cp .env.example .env`

Our service needs MySQL and SQS instances to run. To make it easier for developers we can run the following, which will start MySQL and SQS locally

- `$ docker-compose up mysql`
- `$ docker-compose up sqs`

Export AWS variables to run locally

```
export AWS_ACCESS_KEY_ID="your_key_id"
export AWS_SECRET_ACCESS_KEY="your_secret_key"
```

Finnally build the code and start the server
`$ npm run start`
This will also run all DB migrations creating and seeding our tables

#### Local SQS issue

The local SQS we are using (<https://github.com/roribio/alpine-sqs>) although it is good it has a known issue (<https://github.com/roribio/alpine-sqs/issues/8>) where the container GUI makes our local consumer lose some SQS messages.
The ideal state here would be to on any terminal, after the command `docker-compose up sqs` do:

Exec into the docker container
`$ docker exec -ti alpine-sqs  /bin/bash`

Inside the docker container we can now run
`$ supervisorctl stop insight`

This will stop the insight/GUI thus making our local SQS run without problems and stop losing messages.

## Routes

`GET - api/v1/health/check`

- Route to check if server is running and its correctly connected to the Database

`GET - api/v1/users/{id}/events?start=50&limit=100`

- First route use it to get user calendar events, limited to 5000 events

`POST - api/v1/users/{id}/events`

- Second route to start the creation of user calendar events. This will send a queue message that will eventually update all user calendar events

## How it was done

- On the first route/endpoint, to generate all events, we can do an HTTP GET request and get a list of items, with a default of 100 items per request (amount of items returned can also be changed with the query limit). All of those events are mocked and generated at the time of the request.
  - This route is not currently bound to existent users on the `user` table
- On the second route/endpoint we can use it to start the process of synchronization for all of the user events. This process is also automatically started every hour for 5 different users, using a simple scheduled cron job.
- By synchronization it means that the user events will be
        - All events will be retrieved using the GET endpoint above and stored on the DB on the `user_events` table
        - All users called here must be present at the `user` table. 10 mocked users are created at the server start.
        -  At a second time when all of the user events are already saved, they will be compared. If anything changes and the DB event is not the same as the one returned by the API then the DB event will be updated.

## Test

Unit tests done using JEST.

To run use `npm run test`

All tests are inside `test` folder

## Improvements

Things to be improved

- Better environment variables
- Better test coverage adding more UTs and Integration tests
- Security on requests
- Batched SQS
- Error and retry handling on async/publisher/consumer operations
- Migrate cron jobs to serverless function
- Cloudformation files for AWS deploy
