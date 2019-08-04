const mongoose = require('mongoose');

const TestSchema = mongoose.Schema({
    id: String,
    Individuals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    Scores: {
        id: {
            score: Number,
            answers: {
                Number
            }
        }
    },
    Index: {
        id: Number //Student ID to index
    }
});

module.exports = mongoose.model('Test', TestSchema);