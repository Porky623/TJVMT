var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    gradYear: {type: Number, min: 2000, max: 3000},
    grade: Number,
    email: String,
    username: {type: String, required: true},
    isOfficer: Boolean
});

UserSchema.statics = {
    usernameExists(un) {
        return this.find({username: un})
        .then(result => {
            if (!result) throw new Error('Username not found')
        })
    },
};
//Virtual for full name
UserSchema
.virtual('name')
.get(function() {
    return this.firstName + ' ' + this.lastName;
});

//Export model
module.exports = mongoose.model('User', UserSchema);