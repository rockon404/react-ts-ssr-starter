const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const serverSideRendering = require('../dist/server.bundle').default;

const port = 3000;

app.use(cookieParser());

app.use(express.static('./dist'));

app.get('*', serverSideRendering);

app.listen(port, function () {
  const host = this.address().address;
  console.log("Server launched at http://%s:%s", host, port);
});