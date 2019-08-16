var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var IndexSchema = new Schema({
  student: {type: Schema.ObjectId, required: true},
  test: {type: Schema.ObjectId, required: true}, //or contest
  indexVal: {type: Number, required: true}
});

//Export model
module.exports = mongoose.model('Index', IndexSchema);