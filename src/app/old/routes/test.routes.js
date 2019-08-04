module.exports = (app) => {
    const tests = require('../controllers/test.controllers.js');

    // Create a new test
    app.post('/tests', tests.create);

    // Retrieve all tests
    app.get('/tests', tests.findAll);

    // Retrieve a single test with testId
    app.get('/tests/:testId', tests.findOne);

    // Update a test with testId
    app.put('/tests/:testId', tests.update);

    // Delete a test with testId
    app.delete('/tests/:testId', tests.delete);
}