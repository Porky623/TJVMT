const express = require('express');

let app = express();
app.set('prefix', '/vmt/');

app.all('*', (req, res) => res.redirect(`https://tjvmt.com${req.url}`))

app.listen(process.env.PORT, function() {
  console.log("Server listening on: " + process.env.PORT);
});
