const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Schema = mongoose.Schema;

const TournamentSchema = new Schema({
    created_at: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        required: true
    },
    moniker: {
        type: String,
        required: true,
        unique: true,
        dropDups: true,
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    invites: [{
        name: {
            type: String,
            required: true,
            unique: true
        },
        team: {
            type: Schema.Types.ObjectId,
            ref: 'Team'
        }
    }],
    settings: {
        type: Object,
        default: {}
    }
});

const TournamentModel = mongoose.model('Tournament', TournamentSchema);

module.exports = {
    model: TournamentModel,
    custom_routes: {
        'get': {
            '/moniker/:moniker': function(req, res, next) {
                logger.log(req.method, req.originalUrl);

                TournamentModel.findOne({
                    moniker: encodeURIComponent(req.params.moniker)
                }, function(err, result) {
                    if (err) return next(err);
                    res.status(200).json(result);
                });
            }
        },
        'patch': {
            '/:id': [
                bodyParser.json(),
                function(req, res, next) {
                    logger.log(req.method, req.originalUrl, '\n', req.body);

                    TournamentModel.findById(req.params.id, '+password', function(err, tournament) {
                        if (err) return next(err);
                        _.each(req.body, (value, key) => {
                            if (tournament[key] === value) return;
                            tournament[key] = value;
                        });
                        tournament.save(function(err, result) {
                            if (err) return next(err);
                            res.status(200).json(result);
                        });
                    });
                }
            ]
        }
    },
    auth_routes: {
        'post': {
            '/moniker/:moniker': [
                bodyParser.json(),
                function(req, res, next) {
                    logger.log(req.method, req.originalUrl, '\n', req.body);

                    if (!req.body.password) return res.status(422).send('Invalid request body');

                    TournamentModel.findOne({
                        moniker: encodeURIComponent(req.params.moniker)
                    }, '+password', function(err, result) {
                        if (err) return next(err);

                        if (req.body.password === result.password)
                            res.status(200).json(result);
                        else
                            res.status(401).send('Unauthorized');
                    });
                }
            ]
        }
    }
};
