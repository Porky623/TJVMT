const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContestSchema = Schema({
    name: String,
    tests: [{type: Schema.Types.ObjectId, ref: 'Test'}],
    weighting: {
        testId: Number
    },
    individuals: [{type: Schema.Types.ObjectId, ref: 'User'}],
    indices: {
        studId: Number
    }
});

ContestSchema.pre("save", function(next){
    next();
})

module.exports = mongoose.model('Contest', ContestSchema);