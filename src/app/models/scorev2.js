var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ScoreRedesignSchema = new Schema({
    TSTName: {type: String, required: true},
    Index: {type: Number, required: true},
    Participant: {
        type: Schema.ObjectId,
        ref: User2
    },
    RoundPerformance: [[false]]
});

module.exports = mongoose.model('Score2', ScoreRedesignSchema);
