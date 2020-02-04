var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ARMLTeamSchema = new Schema({
    name: {type: String, required: true},
    testName: String,
    members: [{type: String}], //members' usernames
    scoreVal: {type: Number, required: true},
    scoreDist: String,
});

//Export model
module.exports = mongoose.model('ARMLTeam', ARMLTeamSchema);