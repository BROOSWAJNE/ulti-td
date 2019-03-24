require('./lib/globals');
logger.log('Starting server');

const path = require('path');
const fs = require('fs');

const express = require('express');
const https = require('https');
const helmet = require('helmet');
const session = require('express-session');
const csrf = require('csurf');

const { inject } = require('./lib/utils');

const app = express();
app.use(helmet());

const secret = process.env.CSRF_SECRET;
app.use(session({ secret: secret, resave: false, saveUninitialized: false }));
app.use(csrf());

logger.wrap(app);

// api routing
app.use('/api', require('./api/router'));

function routeIndex(req, res, next) {
    const injectData = {
        csrfToken: req.csrfToken(),
    };
    inject(path.join(__dirname, '../dist/index.html'), injectData)
        .then((index) => res.send(index))
        .catch((err) => {
            logger.error('Error injecting index.html', err);
            next(err);
        });
}
// if file exists in dist, serve it
fs.readdirSync(path.resolve(__dirname, '../dist')).forEach((file) => {
    app.get('/'+file, file === 'index.html' ? routeIndex : function(req, res) {
        res.sendFile(path.join(__dirname, '../dist/'+file));
    });
});
app.get('*', routeIndex);

const port = process.env.PORT || 4000;
if (process.env.NODE_ENV === 'production') { // TODO: enable https for prod
    app.listen(port, function() {
        logger.info('Production server started successfully. Listening @' + port);
    });
} else {
    https.createServer({
        key: fs.readFileSync('config/keys/key.pem'),
        cert: fs.readFileSync('config/keys/server.crt'),
    }, app).listen(port, function() {
        logger.info('Server started successfully. Listening @ 127.0.0.1:' + port);
    });
}
