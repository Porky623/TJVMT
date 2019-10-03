var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ScoreSchema = new Schema({
  studentUsername: String,
  studentName: String,
  studentGradYear: String,
  studentGrade: Number,
  testName: String,
  scoreVal: {type: Number, required: true},
  scoreDist: String
});

//Export model
module.exports = mongoose.model('Score', ScoreSchema);