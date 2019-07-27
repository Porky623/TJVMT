const mongoose = require('mongoose');

const ContestSchema = mongoose.Schema({
    _id: String,
    tests: [String],
    content: {
        type: Map,
        of: Map,
        of: String
    }
    // content: {
    //     weighting: {
    //         testId: Number //Test ID: Weighting for that test
    //     },
    //     individuals: {
    //         studId: Number //Student ID: content index
    //     }
    // }
}, {
    timestamps: true
});

ContestSchema.pre("save", function(next){
    console.log(this);
    next();
})

module.exports = mongoose.model('Contest', ContestSchema);