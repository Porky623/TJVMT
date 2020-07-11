const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema;

let UserRedesignSchema = new Schema({
    ionUsername: {type: String, required: true},
    email: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    gradYear: {type: Number, required: true, min: 2000, max: 3000},
    password: String,
    isOfficer: {type: Boolean, default: false}
});

UserRedesignSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

UserRedesignSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

UserRedesignSchema.statics = {
    usernameExists(un) {
        return this.find({ionUsername: un})
        .then(result => {
            if (!result) throw new Error('Username not found')
        })
    },
};
//Virtual for full name
UserRedesignSchema
.virtual('name')
.get(function() {
    return this.firstName + ' ' + this.lastName;
});

//Export model
module.exports = mongoose.model('User2', UserRedesignSchema);