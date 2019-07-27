const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: String, //Student ID (w.r.t Ion)
    email: String,
    gradYear: Number, //Graduation year
    firstName: String,
    lastName: String,
    password: String
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);