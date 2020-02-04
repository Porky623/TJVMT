# TJVMT
Thomas Jefferson High School for Science and Technology's [Varsity Math Team's website](https://activities.tjhsst.edu/vmt/).

Features added:
* Score entering and viewing process streamlined for officers and members, respectively
* Linked to [TJ Intranet](https://ion.tjhsst.edu), a.k.a. Ion
* Announcement system!
## Using
Primarily utilizing:
* Node JS
* Express JS
* Passport (for authentication)
* OAuth 2.0 (also for authentication)
* Mongoose (for easier MongoDB database usage)
* Handlebars (HTML engine)
* Express Flash Notifications (notifications when validation fails; currently adding for successful operations)
* Bootswatch (styling: using Sandstone template)
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
  * The live database is now set to an account off the vmtofficers email; if you need to add to the whitelist, log in yourself. If you would like to work with testing data, switch the setting in src/config/database.config.js to the local version.
  * Be careful about using MongoDB Compass or the browser for *adding* documents to a collection; it was the source of much hassle during development as manually added documents couldn't be accessed through code, even if they looked to be in the same collection.
* URL routing
  * For some reason the actual VMT website current has an inherent /vmt. Now simply running `npm run local` should suffice. HOWEVER be sure to check errata.txt for unresolved differences between the local and live sites.
* Make sure to check src/server.js, src/config/url-config.js, src/config/passport-setup.js, and possibly src/app/routes/main_routes.js for settings that differ between the live site and local development.
* **PLEASE** push to dev or another branch instead of directly to the master branch.
## A note about async/await
MongoDB is a remote database, so Javascript or NodeJS or ExpressJS or whatever the cause uses what are called *asynchronous operations*. What this means is the code doesn't necessarily run linearly. Consider the flow of code being run as a stream. From the Java and/or Python we are used to, this models the process exactly; after line n is run, line n+1 is run. However, because the database is remote, when a database call is made, the Javascript doesn't necessarily know if the call will be successful. Because of this, it returns a promise saying, "OK, trust that this call is successful. In the meantime, let's move on with our side of things." The database call and the Javascript code run simultaneously, in parallel. Counterintuitively (as least to me), *asynchronous*, or *async*, means "at the same time," or "in parallel." So in the stream analogy, an asynchronous call would create a new branch in the stream while not affecting the main branch it came from.

So what if we want to make a database call, say to get a User, and use the object returned later on? If we simply make the call, we aren't guaranteed the request will finish and we'll have our User by the time we get the to Javascript code that actually uses it! To fix this we label a function call with *await*. More intuitively than *async*, it literally tells the main branch of code, "Wait for this call to finish before proceeding." In the stream analogy, think of it as a giant boulder that redirects the stream elsewhere, but eventually returns to the main waterway, with no water running from the split to the rendezvous point.

*Async/await* calls are actually a newer way of dealing with "promises." Suppose you wanted to use `User.find()` with async/await functionality but without labelling the function with await and putting the call inside an async function. Then you could do something of the form `User.find(filter).then(f).catch(g)` for functions `f` and `g`, but what if you wanted to use `User.find()`, `Test.find()`, *and* `Score.find()`, then use all three of them to do some calculation? This is doable with `.then().catch()`, but becomes very messy very fast. For this reason, I prefer `async/await` and used them instead in my code. I'm not too sure about performance, but it's definitely much easier to read and debug in my opinion.
## Current To-Do List
* [x] Try and make formatting more consistent
* [x] Display weights with contest rankings
* [ ] Make styling easier to manage than page-by-page
  * [ ] Fix styles.css not being applied
* [x] Clean up CSS and HTML to look better
* [ ] Ideas for pages to add:
  * [ ] TJAIME/TJUSAMO lecture handout/video archive
  * [ ] TJOMO submission and grading
  * [ ] Problem tracking per person
  * [ ] Managing the database to not overfill it: more important when the school year or document schemas change
* [x] Improve announcement creation options; maybe support Markdown ~~(currently embeds body directly into HTML through Handlebars)~~
* [ ] Visual notification for new announcements
* [ ] Speed up page loading, especially for mobile devices, by reducing Javascript
* [ ] Test more complex flash notification systems
* [ ] Link email list subscriptions/unsubscribing
* [ ] Write to log when an officer performs an action
