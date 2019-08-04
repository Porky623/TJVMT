var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    gradYear: {type: Number, min: 2000, max: 3000},
    email: String,
    username: {type: String, required: true}
});

//Virtual for full name
UserSchema
.virtual('name')
.get(function() {
    return this.firstName + ' ' + this.lastName;
});

// Virtual for user's profile
UserSchema
    .virtual('url')
    .get(function () {
        return '/profile/' + this._id;
    });

//Export model
module.exports = mongoose.model('User', UserSchema);