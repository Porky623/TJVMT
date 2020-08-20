var mongoose = require('mongoose');
const tstmodel = require('./src/app/models/tstmodel');
var Schema = mongoose.Schema;

var Contest = new Schema({
    rounds: {type: [tstmodel]}, 
    name:{type: String, required: true},
    weighting: {type: [Decimal]}
});

module.exports = mongoose.model('Contest', Contest);