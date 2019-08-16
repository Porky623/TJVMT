var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var testWeightSchema = new Schema({
  contestName: String,
  testId: String,
  weighting: Number
});

//Export model
module.exports = mongoose.model('TestWeight', testWeightSchema);