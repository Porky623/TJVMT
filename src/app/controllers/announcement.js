const Announcement = require('../models/announcement');
const flash = require('express-flash-notification');

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

exports.announcement_create = async (req, res) => {
  res.locals.metaTags = {
    title: 'Add Announcement',
  };
  res.render('add_announcement');
};

exports.announcement_create_post = async (req, res, next) => {
  if(await Announcement.exists({title: req.body.title})) {
    return req.flash({
      type: 'Warning',
      message: 'There is already an announcement with that title!',
      redirect: req.app.get('prefix')+'announcement/add'
    });
  }
  var curDate = new Date();
  curDate = months[curDate.getMonth()]+' '+curDate.getDate()+', '+curDate.getFullYear();
  await new Announcement({
    title: req.body.title,
    body: req.body.body,
    date: curDate
  }).save();
  return req.flash({
    type: 'Success',
    message: 'Announcement created!',
    redirect: req.app.get('prefix')+'announcement/add'
  });
};

exports.announcement_delete = async (req, res) => {
  res.locals.metaTags = {
    title: 'Delete Announcement',
  };
  res.render('delete_announcement', {announcement: await Announcement.find({})});
};

exports.announcement_delete_post = async (req, res, next) => {
  await Announcement.deleteOne({title: req.body.title});
  return req.flash({
    type: 'Success',
    message: 'Announcement removed!',
    redirect: req.app.get('prefix')+'officers'
  });
};