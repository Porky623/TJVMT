const mongoose = require('mongoose');

const TestSchema = mongoose.Schema({
    id: String,
    Individuals: {
        id: {
            score: Number,
            answers: {
                Number
            }
        }
    },
    Index: {
        Individuals: {
            id: Number //Score for a student's ID
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Test', TestSchema);