logger.log('Initializing api router');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const router = new express.Router();

const fs = require('fs');
const path = require('path');
const models = {};
_.each(fs.readdirSync(path.resolve(__dirname, './models')), function(model) {
    let p = path.basename(model);
    let m = p.substr(0, p.length - '.js'.length);
    models[m] = require('./models/' + model);
});

const db = {
    url: process.env.DB_URL || 'mongodb://localhost/td',
    options: { useNewUrlParser: true },
};

logger.log('Connecting to database @', db.url);
mongoose.set('useCreateIndex', true);
mongoose.connect(db.url, db.options, function(err) {
    if (err) {
        logger.error('Could not connect to database:', err.stack);
        process.exit(1);
    }
    logger.info('Successfully connected to database @', db.url);

    // initialize models
    _.each(models, function(model, name) {
        // logger.log('Initializing routes for model:', name);

        _.each(model.customRoutes, function(routes, method) {
            _.each(routes, function(fn, route) {
                // logger.debug(method, '/'+name+route);
                router[method]('/'+name+route, fn);
            });
        });

        // get single document by id
        router.get('/' + name + '/:id', function(req, res, next) {
            logger.log(req.method, req.originalUrl);

            model.model.findById(req.params.id, function(err, result) {
                if (err) return void next(err);
                res.status(200).json(result);
            });
        });

        // get entire collection
        router.get('/' + name, function(req, res, next) {
            logger.log(req.method, req.originalUrl);

            model.model.find(function(err, result) {
                if (err) return void next(err);
                res.status(200).json(result);
            });
        });

        // create new element of collection
        router.post('/' + name + '/new', bodyParser.json(), function(req, res, next) {
            logger.log(req.method, req.originalUrl, '\n', req.body);

            let doc = new model.model(req.body);
            doc.save(function(err, result) {
                if (err) return void next(err);
                res.status(200).json(result);
            });
        });

        // patch document
        router.patch('/' + name + '/:id', bodyParser.json(), function(req, res, next) {
            logger.log(req.method, req.originalUrl, '\n', req.body);

            model.model.findByIdAndUpdate(req.params.id, req.body, {
                new: true, // return new doc instead of original
            }, function(err, result) {
                if (err) return void next(err);
                res.status(200).json(result);
            });
        });

        //! TODO: add option to disable certain default methods in model exports
        // delete existing element
        router.delete('/' + name + '/:id', function(req, res, next) {
            logger.log(req.method, req.originalUrl);

            model.model.deleteOne({ _id: req.params.id }, function(err) {
                if (err) return void next(err);
                res.status(200).send('Success');
            });
        });

        // empty collection
        router.delete('/' + name, function(req, res, next) {
            logger.log(req.method, req.originalUrl);

            model.model.deleteMany({}, function(err) {
                if (err) return void next(err);
                res.status(200).send('Success');
            });
        });

        // show warning if not implemented
        router.use('/' + name + '*', function(req, res, next) {
            logger.warn(req.method, req.originalUrl, 'not implemented');
            return next();
        });
    });

    // initialize auth endpoints
    _.each(models, function(model, name) {
        _.each(model.authRoutes, function(routes, method) {
            _.each(routes, function(fn, route) {
                if (_.isArray(fn)) // has middleware
                    router[method].apply(router, ['/auth/'+name+route].concat(fn));
                else
                    router[method]('/auth/'+name+route, fn);
            });
        });
    });

    logger.info('Initialized all api routes');

    // 404 fallback if not caught by routes
    router.use(function(req, res) {
        logger.log(req.method, req.url, '-> 404');
        res.status(404).send('Not found');
    });
});

// close connection properly when exiting server process
process.on('SIGINT', function() {
    logger.log('Gracefully exiting');
    mongoose.connection.close(function() {
        logger.info('Terminated mongoose connection');
        process.exit(0);
    });
});

router.use(function(err, req, res, next) {
    logger.error(req.originalUrl, '-> 500\n' + err.stack);
    res.status(500).send('Internal server error');
});

module.exports = router;
