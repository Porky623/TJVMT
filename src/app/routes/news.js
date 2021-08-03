// libraries
const express = require('express');
const router = express.Router();
const marked = require('marked');

// models
const Announcement = require('../models/announcement');
const officerCheck = require('./officer_routes').officerCheck;

const nodemailer = require('nodemailer');
const mailAuth = require('../../config/keys').gmail;

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'oauth2',
        user: mailAuth.user,
        clientId: mailAuth.clientID,
        clientSecret: mailAuth.clientSecret,
        refreshToken: mailAuth.refreshToken,
        accessToken: mailAuth.accessToken
    }
});

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

router.get('/news', async (req, res) => {
    res.locals.metaTags = {
        title: 'News',
    };
    let announcements = []
    let allAnnounce = await Announcement.find({});
    for (var i = 0; i < allAnnounce.length; i++) {
        announcements.push({
            title: allAnnounce[i].title,
            body: marked(allAnnounce[i].body),
            date: allAnnounce[i].date
        })
    }
    res.render('news', {isOfficer: (req.user && req.user.isOfficer), announcement: announcements});
});

router.post('/announcement', async (req, res) => {
    if (await Announcement.exists({title: req.body.title})) {
        return req.flash({
            type: "Warning",
            message: "An announcement with that title already exists.",
            redirect: req.app.get('prefix') + 'news'
        });
    }
    
    var curDate = new Date();
    curDate = months[curDate.getMonth()] + ' ' + curDate.getDay() + ', ' + curDate.getFullYear();
    await new Announcement({
        title: req.body.title,
        body: reœq.body.body,
        date: curDate
    }).save();

    if (req.body.sendEmail) {
        let mailOptions = {
            from: 'vmtofficers@gmail.com',
            to: 'pranavmathur001@gmail.com',
            subject: req.body.title,
            text: req.body.body
        }

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }

    return req.flash({
        type: "Success",
        message: "Announcement created",
        redirect: req.app.get('prefix') + '/news'
    });
});

router.delete('/announcement', officerCheck, async (req, res) => {
    await Announcement.deleteOne({title: req.body.title});
    return req.flash({
        type: "Success",
        message: "Announcement deleted",
        redirect: req.app.get('prefix') + 'news'
    });
});

module.exports = router;