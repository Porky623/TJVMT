const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const score = new Schema({
    userIonUsername: {
        type: String,
        required: true
    },
    tst: {
        type: String,
        required: true
    },
    correct: {
        type: [Number],
        required: true,
        default: []
    },
    index: {
        type: Number,
        required: true,
        default: 2000
    }
});

module.exports = mongoose.model('Score', score);