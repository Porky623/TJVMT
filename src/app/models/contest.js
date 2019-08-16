var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ContestSchema = new Schema({
  name: {type: String, required: true},
  tests: [
      String //testID
  ],
  weighting: [{
    type: Schema.ObjectId,
    ref: 'TestWeight'
  }],
  indices: [{
    type: Schema.ObjectId,
    ref: 'Index'
  }]
});

//Export model
module.exports = mongoose.model('Contest', ContestSchema);