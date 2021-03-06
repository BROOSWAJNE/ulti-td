const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
    'created_at': {
        type: Date,
        default: Date.now,
    },
    'name': {
        type: String,
        required: true,
    },
    'password': {
        type: String,
        select: false,
    },
    'tournaments': [{
        type: Schema.Types.ObjectId,
        ref: 'Tournament',
    }],
    'players': [{
        type: String,
    }],
});

const TeamModel = mongoose.model('Team', TeamSchema);

module.exports = {
    model: TeamModel,
    customRoutes: {
        'get': {
            '/tournament/:id': function(req, res, next) {
                logger.log(req.method, req.originalUrl);

                TeamModel.find({
                    tournaments: req.params.id,
                }, function(err, result) {
                    if (err) return void next(err);
                    res.status(200).json(result);
                });
            },
        },
    },
};
