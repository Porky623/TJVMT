const User = require('../models/user.model.js');

exports.user_create_get = function(req,res) {

}

exports.user_create_post = function(req,res) {

}

exports.user_update_get = function(req,res) {

}

exports.user_update_post = function(req,res) {

}

exports.user_delete_get = function(req,res) {

}

exports.user_delete_post = function(req,res) {

}

exports.user_detail = function(req,res) {

}

exports.user_list = function(req,res) {

}

// Create and Save a new user
exports.create = (req, res) => {
    // Validate request
    if(!/^\d{4}[a-z]{2,15}$/.test(req.body.username)) {
        return res.status(400).send({
            message: "Username must your Ion username"
        });
    }
    if(!/^(?=.?*[a-z])(?=.?*[A-Z])(?=.?*[0-9])[a-zA-Z0-9]*$/.test(req.body.password)) {
        return res.status(400).send({
            message: "Password must consist of alphanumeric characters, with at least one lowercase and at least one"
            +" uppercase letter and at least one digit"
        });
    }
    if(!/^20\d\d$/.test(req.body.gradYear)) {
        return res.status(400).send({
            message: "Graduation year is invalid"
        });
    }
    if(!/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(req.body.email)) {
        return res.status(400).send({
            message: "Email is invalid"
        });
    }
    if(!/^[A-Z][a-z]*$/.test(req.body.firstName)||!/^[A-Z][a-z]*$/.test(req.body.lastName)) {
        return res.status(400).send({
            message: "Please enter your real name"
        })
    }

    // Create a user
    const user = new User({
        username: req.body.id,
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        gradYear: req.body.gradYear
    });

    // Save user in the database
    user.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the user."
        });
    });
};

// Update a user identified by the userId in the request
exports.update = (req, res) => {

    // Validate request
    if(!/^\d{4}[a-z]{2,15}$/.test(req.body.username)) {
        return res.status(400).send({
            message: "Username must your Ion username"
        });
    }
    if(!/^(?=.?*[a-z])(?=.?*[A-Z])(?=.?*[0-9])[a-zA-Z0-9]*$/.test(req.body.password)) {
        return res.status(400).send({
            message: "Password must consist of alphanumeric characters, with at least one lowercase and at least one"
                +" uppercase letter and at least one digit"
        });
    }
    if(!/^20\d\d$/.test(req.body.gradYear)) {
        return res.status(400).send({
            message: "Graduation year is invalid"
        });
    }
    if(!/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(req.body.email)) {
        return res.status(400).send({
            message: "Email is invalid"
        });
    }

    // Find user and update it with the request body
    User.findByIdAndUpdate(req.params.userId, {
        username: req.body.id,
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        gradYear: req.body.gradYear
    }, {new: true, useFindAndModify: false})
        .then(user => {
            if(!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            res.send(user);
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });
        }
        return res.status(500).send({
            message: "Error updating user with id " + req.params.userId
        });
    });
};

// Delete a user with the specified userId in the request
exports.delete = (req, res) => {
    User.findByIdAndRemove(req.params.userId)
        .then(user => {
            if(!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            res.send({message: "User deleted successfully!"});
        }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });
        }
        return res.status(500).send({
            message: "Could not delete user with id " + req.params.userId
        });
    });
};

