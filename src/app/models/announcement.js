const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnnouncementSchema = new Schema({
  title: String,
  body: String,
  date: Date
});

//Export model
module.exports = mongoose.model('Announcement', AnnouncementSchema);