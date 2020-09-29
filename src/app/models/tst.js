var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var round = ({
    roundStart: {type: Date, required: true},
    roundDuration: {type: Number, required: true},
    submitDuration: {type: Number, required: true},
    submitStart: {type: Date, required: true},
    numQuestions: {type: Number, required: true},    
}); 

var tst = new Schema({
    name: {
        type: String,
        required: true
    },
    writers: [String],
    participants: [String],
    rounds: {type: [round]}, 
    submissionTimes: [Number],
    scores: [Number]
});

//export model
module.exports = mongoose.model('TST', tst);
