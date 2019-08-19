var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ContestSchema = new Schema({
  name: {type: String, required: true},
  tests: [{
    type: Schema.ObjectId,
    ref: 'Test'
  }],
  weighting: [{
    type: Schema.ObjectId,
    ref: 'TestWeight'
  }],
  indices: [{
    type: Schema.ObjectId,
    ref: 'Ind'
  }]
});

//Export model
module.exports = mongoose.model('Contest', ContestSchema);