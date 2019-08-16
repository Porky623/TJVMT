var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ScoreSchema = new Schema({
  student: {type: Schema.ObjectId, required: true},
  test: {type: Schema.ObjectId, required: true},
  scoreVal: {type: Number, required: true},
  scoreDist: String
});

//Export model
module.exports = mongoose.model('Score', ScoreSchema);