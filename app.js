var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
const cors = require("cors");

// var masterRouter = require('./routes/master.routes');
var rfidTagMasterRouter = require('./routes/rfidtagmaster.routes');
var transactionRouter = require('./routes/transactiontable.routes');
var deviceRouter = require('./routes/devicetable.routes');
var deviceTransactionRouter = require('./routes/devicetransactiontable.routes');
var shiftRouter = require('./routes/shifttable.routes');
var userRouter = require('./routes/userdetail.routes');

const app = express();

app.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    next();
});

// parse requests of content-type - application/json
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// app.use('/masters', masterRouter);
app.use('/rfidtagmasters', rfidTagMasterRouter);
app.use('/transactiontables', transactionRouter);
app.use('/devices', deviceRouter);
app.use('/devicetransactions', deviceTransactionRouter);
app.use('/shifts', shiftRouter);
app.use('/userdetails', userRouter);
//sync
const db = require("./models");
db.sequelize.sync();

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to BRiOT application." });
});

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json({ error: err })
});

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

