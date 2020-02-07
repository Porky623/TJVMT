var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var armlTeamSchema = new Schema({
    teamName: String,
    usernames: [String],
    testName: String,
    scoreVal: {type: Number, required: true},
    scoreDist: String
});

//Export model
module.exports = mongoose.model('ARMLTeam', armlTeamSchema);