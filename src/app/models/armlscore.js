var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ARMLScoreSchema = new Schema({
    studentUsername: String,
    studentName: String,
    studentGradYear: String,
    studentGrade: Number,
    testName: String,
    scoreVal: {type: Number, required: true},
    indivScore: Number,
    teamScore: Number,
    relayScore: Number,
    indivScoreDist: String
});

//Export model
module.exports = mongoose.model('ARMLScore', ARMLScoreSchema);