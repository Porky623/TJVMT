var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ScoreSchema = new Schema({
    tstName: {
        type: Schema.ObjectId,
        ref: TST
    },
    participant: {
        type: Schema.ObjectId,
        ref: User
    },
    roundScore: {type: Number, required: true},
    roundPerformance: [[false]]
});

module.exports = mongoose.model('Score', ScoreSchema);
