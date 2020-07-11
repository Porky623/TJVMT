var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ContestRedesignSchema = new Schema({
    name: {type: String, required: true},
    tsts: [{
        type: Schema.objectId,
        ref: 'TSTModel',
        weighting: Number
    }]
});
module.exports = mongoose.model('Contest2', ContestRedesignSchema);