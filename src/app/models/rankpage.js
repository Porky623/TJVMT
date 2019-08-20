var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RankPageSchema = new Schema({
  out: [],
  testName: String
});

//Export model
module.exports = mongoose.model('RankPage', RankPageSchema);