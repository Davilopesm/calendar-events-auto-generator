# auto-generate-calendar

## Tech Stack and Instalation

Project was done using
`Node.JS`
`Typescript`
`Jest` for testing
`ESlint` for code styling guidelines

Before running the service make sure you have installed
`Node.JS` version  `14.16.0`
`NPM` version  `6.14.11`

All source code is inside `src` folder

## How to run

Navigate to the project folder on any terminal

Install node dependencies
`npm i`

Create environment variables
`cp .env.example .env`

We can use a locally running MySQL but to make it easier for local development we can also run the following, which will start MySQL
`docker-compose up mysql`

Finnally start the server
`npm run build && npm run start`

## Routes

`GET - api/v1/health/check`

- Route to check if server is running and its correctly connected to the Database

`GET - api/v1/users/{id}/events?start=50&limit=100`

- Route to get user calendar events, limited to 5000 events

## Test

Unit tests done using JEST.

To run use `npm run test`

All tests are inside `test` folder

## Improvements

Things that should be improved in order to really user this service

- Division of concerns
  - Controller doing too much, harder to test

- Better environment variables

- Better code coverage
- Add integration tests
