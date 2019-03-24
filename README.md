# ulti-td

### Local Development

Make sure mongodb is running with  
`sudo service mongod start`  
can check that it's running correctly with  
`grep "waiting for" /var/log/mongodb/mongod.log`

Run server backend with `npm run start`, build and watch frontend with `npm run watch`.

### Production

Run `npm run build` to build frontend, then `npm run start`
