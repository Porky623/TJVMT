const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tst = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    year: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ["short_answer_unweighted, short_answer_weighted, proof, arml"],
        default: "short_answer_unweighted"
    },
    info: {
        type: Map,
        of: String
    },
    writers: {
        type: [String],
        default: []
    }
});

//export model
module.exports = mongoose.model('TST', tst);
