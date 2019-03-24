# ulti-td

## Instructions

### Local Development

1. Run mongodb: `sudo service mongod start`
can check that it's running correctly with
`grep "waiting for" /var/log/mongodb/mongod.log`

2. Run server: `env CSRF_SECRET='foo' nodemon server/server.js`.

3. Build and watch frontend: `npm run watch`.

### Production

Required env variables: `CSRF_SECRET`, `DB_URL`

1. Build frontend: `npm run build`.

2. Run server: `npm run start`.
