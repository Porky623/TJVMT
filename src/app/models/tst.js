var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tst = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    year: {
        type: Number,
        required: true
    },
    numProblems: {
        type: Number,
        required: true,
    },
    scoreWeighted: {
        type: Boolean,
        required: true,
        default: false
    },
    writers: {
        type: [String],
        default: []
    }
});

//export model
module.exports = mongoose.model('TST', tst);
