var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ARMLSchema = new Schema({
    name: {type: String, required: true},
    scores: [{
        type: Schema.ObjectId,
        ref: 'ARMLScore'
    }],
    teams: [{
        type: Schema.ObjectId,
        ref: 'ARMLTeam'
    }],
    relays: [{
        type: Schema.ObjectId,
        ref: 'ARMLRelay'
    }],
    indices: [{
        type: Schema.ObjectId,
        ref: 'Ind'
    }],
    numQuestions: Number
});

//Export model
module.exports = mongoose.model('ARMLTest', ARMLSchema);