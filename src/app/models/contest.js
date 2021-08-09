const mongoose = require('mongoose');
const TST = require('./tst');
const Schema = mongoose.Schema;

const Contest = new Schema({
    name: {
        type: String, 
        required: true
    },
    year: {
        type: Number,
        required: true,
    },
    tsts: {
        type: [String],
        default: []
    },
    weightings: {
        type: [Number],
        default: []
    }
});

module.exports = mongoose.model('Contest', Contest);