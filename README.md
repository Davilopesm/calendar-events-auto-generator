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
$ export AWS_ACCESS_KEY_ID="your_key_id"
$ export AWS_SECRET_ACCESS_KEY="your_secret_key"
```

Finnally start the server
`$ npm run build && npm run start`

## Routes

`GET - api/v1/health/check`

- Route to check if server is running and its correctly connected to the Database

`GET - api/v1/users/{id}/events?start=50&limit=100`

- First route use it to get user calendar events, limited to 5000 events
- 
`POST - api/v1/users/{id}/events`

- Second route to start the creation of user calendar events. This will send a queue message that will eventually update all user calendar events

## How it was done

- On the first route/endpoint, to generate all events, we can do an HTTP GET request and get a list of items, with a default of 100 items per request (amount of items returned can also be changed with the query limit). All of those events are mocked and generated at the time of the request.
- On the second route/endpoint we can use it to start the process of synchronization for all of the user events. This process is also automatically started every hour for 5 different users, using a simple scheduled cron job.
- By synchronization it means that all of the user events will be
        - All events will be retrieved using the GET endpoint above and stored on the DB on the `user_events` 
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