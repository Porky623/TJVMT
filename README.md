# vmt_Node
Thomas Jefferson High School for Science and Technology's [Varsity Math Team's website](https://activities.tjhsst.edu/vmt/).

Features added:
* Score entering process streamlined for officers
* Linked to [TJ Intranet](https://ion.tjhsst.edu), a.k.a. Ion
## Using
Primarily utilizing:
* Node JS
* Express JS
* Passport (for authentication)
* OAuth 2.0 (also for authentication)
* Mongoose (for easier MongoDB database usage)
* Handlebars (HTML engine)
* Express Flash Notifications (notifications when validation fails)
## Notes for devs trying to replicate the project locally
* express-flash-notifications
  * After doing npm install, go to node_modules => express-flash-notifications => index.js and add `item['layout']=false;` at line 72.
* server.js
  * If you move around flash.handlebars, make sure you change the corresponding *viewName* in the app.use.
* src/config/keys.js
  * You may notice there is no keys file on Github; this is intended for security. Please use Ion's [Director](http://director.tjhsst.edu) to access the contents of the file, and be careful not to accidentally release them!
* MongoDB
  * Atlas has an IP whitelist, so if you can't connect to the database please contact me (Derek) to be added.
  * Right now everything is experimental; in the future we can change the database to be based off of the VMT officers' email.
  * Be careful about using MongoDB Compass or the browser for *adding* documents to a collection; it was the source of much hassle during development as manually added documents couldn't be accessed through code, even if they looked to be in the same collection.
* URL routing
  * For some reason the actual VMT website current has an inherent /vmt. What this meant was I had to prepend '/vmt' to every redirect and href call, but not to every get request. Hopefully this can be changed in the future.
## Current To-Do List
* Try and make formatting more consistent, especially with avoiding callbacks.
* Remove unnecessary libraries from package.json
* Make styling easier to manage than page-by-page
* Clean up CSS and HTML to look better
* Update actual content from 2017-2018
* Ideas for pages to add:
  * TJAIME/TJUSAMO lecture handout/video archive
  * TJOMO submission and grading
  * Problem tracking per person
  * Managing the database to not overfill it: more important when the school year or document schemas change
