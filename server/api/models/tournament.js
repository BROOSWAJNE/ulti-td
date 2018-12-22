const mongoose = require('mongoose');
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
                logger.log(req.method, req.originalUrl, '\nmoniker:', encodeURIComponent(req.params.moniker));

                TournamentModel.findOne({
                    moniker: encodeURIComponent(req.params.moniker)
                }, function(err, result) {
                    if (err) return next(err);
                    res.status(200).json(result);
                });
            }
        }
    }
};
