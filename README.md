# auto-generate-calendar


# Runnning
`npm i`

`cp .env.example .env`

`docker-compose up mysql`

`npm run build && npm run start`

# Routes 

`GET - api/v1/health/check`
- Route to check if server is running and its correctly connected to the Database


# Improvements

Things that should be improved in order to really user this service

- Division of concerns 
- - Controller doing too much, harder to test

- Better environment variables


- Better code coverage
- Add integration tests