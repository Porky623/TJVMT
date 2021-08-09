const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    ionUsername: {type: String, required: true},
    email: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    gradYear: {type: Number, required: true, min: 2000, max: 3000},
    isOfficer: {type: Boolean, default: false},
    onEmailList: {type: Boolean, default: false}
});

UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

UserSchema.statics = {
    usernameExists(un) {
        return this.find({ionUsername: un})
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