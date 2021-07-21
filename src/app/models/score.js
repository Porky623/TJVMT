var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var score = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true
    },
    tst: {
        type: Schema.Types.ObjectId,
        required: true
    }
});

module.exports = mongoose.Model('Score', score);