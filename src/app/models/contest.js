var mongoose = require('mongoose');
const TST = require('./tst');
var Schema = mongoose.Schema;

var Contest = new Schema({
    name: {
        type: String, 
        required: true
    },
    year: {
        type: Number,
        required: true,
    },
    tsts: {
        type: [Schema.Types.ObjectId],
        ref: 'TST'
    },
    weighting: {type: [Number]}
});

module.exports = mongoose.model('Contest', Contest);