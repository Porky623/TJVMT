var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var armlScoreSchema = new Schema({
    studentUsername: String,
    studentName: String,
    studentGradYear: String,
    studentGrade: Number,
    testName: String,
    teamScore: Number,
    relayScore: Number,
    indScore: Number,
    scoreVal: {type: Number, required: true},
    scoreDist: String
});

//Export model
module.exports = mongoose.model('ARMLScore', armlScoreSchema);