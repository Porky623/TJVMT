var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var round = ({
    roundDuration: {type: Number, required: true},
    submitDuration: {type: Number, required: true},
    numQuestions: {type: Number, required: true}, 
    teamSize: {type: Number, required: true}, 
    weight: {type: Number, required: true}, 
    teams: [{
        type: Schema.objectId,
        ref: 'User'
    }]
}); 

var Tst = new Schema({
    rounds: {type: [round]}, 
    name:{type: String, required: true}
});

//export model
module.exports = mongoose.model('TST', Tst);
