var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var armlRelaySchema = new Schema({
    relayName: String,
    usernames: [String],
    testName: String,
    scoreVal: {type: Number, required: true},
    scoreDist: String
});

//Export model
module.exports = mongoose.model('ARMLRelay', armlRelaySchema);