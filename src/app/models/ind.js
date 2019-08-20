var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var IndSchema = new Schema({
  studentUsername: String,
  studentName: String,
  studentGradYear: String,
  testName: String,
  indexVal: {type: Number, required: true},
  rank: {type: Number},
  scoreDist: String
});

//Export model
module.exports = mongoose.model('Ind', IndSchema);