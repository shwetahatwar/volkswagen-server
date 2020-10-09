var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
const cors = require("cors");
var morgan = require('morgan');
var jwt = require("jsonwebtoken");
var winston = require('./config/winston');

var smsAndEmail = require('./controllers/sendmailandsms.controller');

// var masterRouter = require('./routes/master.routes');
var rfidTagMasterRouter = require('./routes/rfidtagmaster.routes');
var transactionRouter = require('./routes/transactiontable.routes');
var deviceRouter = require('./routes/devicetable.routes');
var deviceTransactionRouter = require('./routes/devicetransactiontable.routes');
var shiftRouter = require('./routes/shifttable.routes');
var userRouter = require('./routes/userdetail.routes');
var roleRouter = require('./routes/role.routes');
var setupdataRouter = require('./routes/setupdata.routes');
var accessRouter = require('./routes/access.routes');
var roleAccessRelationRouter = require('./routes/roleaccessrelation.routes');

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

//logger
app.use(morgan('combined', { stream: winston.stream }));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jwt.verify(req.headers.authorization.split(' ')[1], 'VOLKSWAGENINDIA', async function(err, decode) {
      if (err) req.user = undefined;
      const User = db.userDetails;
      await User.findAll({
        where:{
          name: decode["name"]
        }
      }).then(data=>{
        if(data[0] != null || data[0] != undefined)
          req.user = data[0]["dataValues"]
      });
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
});


// app.use('/masters', masterRouter);
app.use('/rfidtagmasters', rfidTagMasterRouter);
app.use('/transactiontables', transactionRouter);
app.use('/devices', deviceRouter);
app.use('/devicetransactions', deviceTransactionRouter);
app.use('/shifts', shiftRouter);
app.use('/userdetails', userRouter);
app.use('/roles', roleRouter);
app.use('/setupdata', setupdataRouter);
app.use('/access', accessRouter);
app.use('/roleaccessrelations', roleAccessRelationRouter);
//sync
const db = require("./models");
db.sequelize.sync();

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to BRiOT application." });
});

setInterval(async function(){
    smsAndEmail.checkDeviceStatus();
  },600000);

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json({ error: err })
});

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, process.env.OPENSHIFT_NODEJS_IP || process.env.IP || '192.168.43.119', () => {
  console.log(process.env.OPENSHIFT_NODEJS_IP);
  console.log(`Server is running on port ${PORT}.`);
});
// 80, process.env.OPENSHIFT_NODEJS_IP || process.env.IP || '127.0.0.1'