----------- External Libraries -----------------

body-parser: for parsing the body data from the API

sequelize: ORM used for managing the postgres database

bcrypt: For hashing the password to store in the database and verify the password when user is trying to login

dotenv: For managing the environment variables

express: Creating the server

express-validation: It is used for validating the incoming request that are request parameters are present before processing the request

joi: Nodejs validation library for request parameters

jsonwebtoken: For authentication of users

luxon, moment: Date and time manipulation library

sentiment: For creating data insights from the message

pg, pg-hstore: Postgres database


--------------- Steps for running the application --------------------------------

1. Clone the repository
2. Copy .env provided in the email attachment in the root of the repository
3. npm i
4. npm run start