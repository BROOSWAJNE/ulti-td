const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScoreSchema = new Schema({
    created_at: {
        type: Date,
        default: Date.now
    },
    tournament: [{
        type: Schema.Types.ObjectId,
        ref: 'Tournament',
        required: true
    }],
    teams: [{
        team: {
            type: Schema.Types.ObjectId,
            ref: 'Team',
            required: true
        },
        points: {
            type: Number,
            required: true
        }
    }]
});

const ScoreModel = mongoose.model('Score', ScoreSchema);

module.exports = {
    model: ScoreModel
};
