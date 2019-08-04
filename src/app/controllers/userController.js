const User = require('../models/user');

const HttpStatus = require('http-status');

const Todo = (req, res) => {
  res.status(HttpStatus.NOT_IMPLEMENTED);
  res.send('Method not implemented');
};

// Display list of all users.
exports.user_list = async (req,res,next) => {
  User.find({}, function(err, users) {
    res.render('user_list', {users});
  });
};

// Display detail page for a specific user.
exports.user_detail = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (user == null) {
    res.status(HttpStatus.NOT_FOUND);
    res.send('No user found');
  }
  //Successful, so render
  res.render('user_detail', {title: 'User Detail', user});
};

// Display user create form on GET.
exports.user_create_get = function(req, res) {
  return res.render('user_create_get');
};


// Handle user create on POST.
exports.user_create_post = function(req, res) {
  res.send('NOT IMPLEMENTED: user create POST');
};

// Display user delete form on GET.
exports.user_delete_get = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (user == null) {
    res.status(HttpStatus.NOT_FOUND);
    res.send('No user found');
  }
  //Successful, so render
  res.render('user_delete_get', {user});
};

exports.user_delete_post = function(req, res) {
  User.findByIdAndRemove(req.params.id)
  .then(() => {
    var response = { message : "User deleted successfully!",
      state : true};
    return res.render('user_delete_post', res.json(response));
  })
}

// Display user update form on GET.
exports.user_update_get = Todo

// Handle user update on POST.
exports.user_update_post = Todo