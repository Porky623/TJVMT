var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TestSchema = new Schema({
  name: {type: String, required: true},
  scores: [{
    type: Schema.ObjectId,
    ref: 'Score'
  }],
  indices: [{
    type: Schema.ObjectId,
    ref: 'Index'
  }]
});

//Export model
module.exports = mongoose.model('Test', TestSchema);