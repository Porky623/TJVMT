var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tst = new Schema({
    name: {
        type: String,
        required: true
    },
    participants: {
        type: [Schema.Types.ObjectId],
        ref: 'User'
    },
    writers: [String],
    submissionTimes: [Number],
    indices: [Number]
});

//export model
module.exports = mongoose.model('TST', tst);
