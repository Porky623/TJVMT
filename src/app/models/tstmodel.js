var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var round = ({
    roundStart: {type: Date, required: true},
    roundDuration: {type: Number, required: true},
    submitDuration: {type: Number, required: true},
    submitStart: {type: Date, required: true},
    numQuestions: {type: Number, required: true},    
}); 

var TstModel = new Schema({
    participants: [String], 
    rounds: {type: [round]}, 
    name:{type: String, required: true},
    submissionTimes: [Number],
    scores: [Number]
});

//export model
module.exports = mongoose.model('TSTModel', TstModel);
