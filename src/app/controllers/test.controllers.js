const Test = require('../models/test.model.js');

// Create and Save a new test
exports.create = (req, res) => {
    // Validate request
    if(!req.body.id) {
        return res.status(400).send({
            message: "Test ID can not be empty"
        });
    }

    // Create a Test
    const test = new Test({
        id: req.body.id
    });

    // Save Test in the database
    test.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the test."
        });
    });
};

// Retrieve and return all tests from the database.
exports.findAll = (req, res) => {
    Test.find()
        .then(tests => {
            res.send(tests);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving tests."
        });
    });
};

// Find a single test with a testId
exports.findOne = (req, res) => {
    Test.findById(req.params.testId)
        .then(test => {
            if(!test) {
                return res.status(404).send({
                    message: "Test not found with id " + req.params.testId
                });
            }
            res.send(test);
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Test not found with id " + req.params.testId
            });
        }
        return res.status(500).send({
            message: "Error retrieving test with id " + req.params.testId
        });
    });
};

// Update a test identified by the testId in the request
exports.update = (req, res) => {
    // Validate request
    if(!req.body.id) {
        return res.status(400).send({
            message: "Test ID can not be empty"
        });
    }

    // Find test and update it with the request body
    Test.findByIdAndUpdate(req.params.testId, {
        id: req.body.id
    }, {new: true})
        .then(test => {
            if(!test) {
                return res.status(404).send({
                    message: "Test not found with id " + req.params.testId
                });
            }
            res.send(test);
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Test not found with id " + req.params.testId
            });
        }
        return res.status(500).send({
            message: "Error updating test with id " + req.params.testId
        });
    });
};

// Delete a test with the specified testId in the request
exports.delete = (req, res) => {
    Test.findByIdAndRemove(req.params.testId)
        .then(test => {
            if(!test) {
                return res.status(404).send({
                    message: "Test not found with id " + req.params.testId
                });
            }
            res.send({message: "Test deleted successfully!"});
        }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Test not found with id " + req.params.testId
            });
        }
        return res.status(500).send({
            message: "Could not delete test with id " + req.params.testId
        });
    });
};

