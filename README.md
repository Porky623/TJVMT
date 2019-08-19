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
Install nodemon with `npm install nodemon` in the terminal (once you're already in the project's directory), and run with `npm run dev`. Also check the package.json file and install all the packages with `npm install <package>`.
* express-flash-notifications
  * After doing npm install, go to node_modules => express-flash-notifications => index.js and add `item['layout']=false;` at line 72.
* server.js
  * If you move around flash.handlebars, make sure you change the corresponding *viewName* in the app.use.
* src/config/keys.js, database.config.js
  * You may notice there are no keys or database config files on Github; this is intended for security. Please use Ion's [Director](http://director.tjhsst.edu) to access the contents of these files, and be careful not to accidentally release them!
* MongoDB
  * Atlas has an IP whitelist
  * The live database is now set to an account off the vmtofficers email; if you need to add to a whitelist, log in yourself. If you would like to work with testing data, switch the setting in src/config/database.config.js to the local version.
  * Be careful about using MongoDB Compass or the browser for *adding* documents to a collection; it was the source of much hassle during development as manually added documents couldn't be accessed through code, even if they looked to be in the same collection.
* URL routing
  * For some reason the actual VMT website current has an inherent /vmt. Now, in src/config/url-config.js you can set the "prefix" to be used; for local sites it should just be `/` but for the actual site it should be `/vmt/`.
* Make sure to check src/server.js, src/config/url-config.js, src/config/passport-setup.js, and possibly src/app/routes/main_routes.js for settings that differ between the live site and local development.
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
