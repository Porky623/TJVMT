const Contest = require('../models/contest.model.js');

// Create and Save a new contest
exports.create = (req, res) => {
    // Validate request
    if(!req.body.id) {
        return res.status(400).send({
            message: "Contest ID can not be empty"
        });
    }
    if(!req.body.tests) {
        return res.status(400).send({
            message: "Counted tests can not be empty"
        });
    }
    if(Object.keys(req.body.content.weighting).length!=req.body.tests.length) {
        return res.status(400).send({
            message: "Number of weights must match number of tests"
        });
    }

    // Create a contest
    const contest = new Contest({
        _id: req.body._id,
        tests: req.body.tests,
        content: req.body.content
    });

    console.log(contest)

    // Save contest in the database
    contest.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the contest."
        });
    });


};

// Retrieve and return all contests from the database.
exports.findAll = (req, res) => {
    Contest.find()
        .then(contests => {
            res.send(contests);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving contests."
        });
    });
};

// Find a single contest with a contestId
exports.findOne = (req, res) => {
    Contest.findById(req.params.contestId)
        .then(contest => {
            if(!contest) {
                return res.status(404).send({
                    message: "contest not found with id " + req.params.contestId
                });
            }
            res.send(contest);
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "contest not found with id " + req.params.contestId
            });
        }
        return res.status(500).send({
            message: "Error retrieving contest with id " + req.params.contestId
        });
    });
};

// Update a contest identified by the contestId in the request
exports.update = (req, res) => {

    // Validate request
    if(!req.body.id) {
        return res.status(400).send({
            message: "Contest ID can not be empty"
        });
    }
    if(!req.body.tests) {
        return res.status(400).send({
            message: "Counted tests can not be empty"
        });
    }
    if(Object.keys(req.body.content.weighting).length!=req.body.tests.length) {
        return res.status(400).send({
            message: "Number of weights must match number of tests"
        });
    }

    // Find contest and update it with the request body
    Contest.findByIdAndUpdate(req.params.contestId, {
        id: req.body.id,
        tests: req.body.tests,
        content: req.body.content
    }, {new: true})
        .then(contest => {
            if(!contest) {
                return res.status(404).send({
                    message: "Contest not found with id " + req.params.contestId
                });
            }
            res.send(contest);
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Contest not found with id " + req.params.contestId
            });
        }
        return res.status(500).send({
            message: "Error updating contest with id " + req.params.contestId
        });
    });
};

// Delete a contest with the specified contestId in the request
exports.delete = (req, res) => {
    Contest.findByIdAndRemove(req.params.contestId)
        .then(contest => {
            if(!contest) {
                return res.status(404).send({
                    message: "Contest not found with id " + req.params.contestId
                });
            }
            res.send({message: "Contest deleted successfully!"});
        }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Contest not found with id " + req.params.contestId
            });
        }
        return res.status(500).send({
            message: "Could not delete contest with id " + req.params.contestId
        });
    });
};

