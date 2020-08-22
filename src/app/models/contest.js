var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ContestSchema = new Schema({
    name: {type: String, required: true},
    tsts: [{
        type: Schema.objectId,
        ref: 'TSTModel',
        weighting: Number
    }]
});
module.exports = mongoose.model('Contest', ContestSchema);