var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AnnouncementSchema = new Schema({
  title: String,
  body: String,
  date: String
});

//Export model
module.exports = mongoose.model('Announcement', AnnouncementSchema);