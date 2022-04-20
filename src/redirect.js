const express = require('express');
let app = express();

app.all('*', (req, res) => {
  res.redirect(`https://tjvmt.com${req.url}`)
})

const port = process.env.PORT | 3000
//For local use
app.listen(port, () => {
    console.log(`Server listening on: port ${port}`);
});