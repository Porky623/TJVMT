var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var armlTestSchema = new Schema({
    name: {type: String, required: true},
    teams: [{
        type: Schema.ObjectId,
        ref: 'ARMLTeam'
    }],
    relays: [{
        type: Schema.ObjectId,
        ref: 'ARMLRelay'
    }],
    scores: [{
        type: Schema.ObjectId,
        ref: 'ARMLScore'
    }],
    indices: [{
        type: Schema.ObjectId,
        ref: 'Ind'
    }]
});

//Export model
module.exports = mongoose.model('ARMLTest', armlTestSchema);