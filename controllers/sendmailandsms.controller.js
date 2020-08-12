const DeviceTable = require('../models').deviceTable;
var HTTPError = require('http-errors');
var ping = require('ping');
const deviceTransactionFunction = require('../functions/createDeviceTransaction');
var nodemailer = require ('nodemailer');
// var text = require('textbelt');

var selfSignedConfig = {
  host: 'smtp.zoho.com',
  port: 465,
  secure: true, 
  auth: {
    user: "servicedesk@briot.in",
    pass: "UQvm0upjLKBy"
  }
};

module.exports = {
  async checkDeviceStatus(){
    console.log("Inside device status check")
    var hosts = await DeviceTable.findAll();
    for(var i=0;i<hosts.length;i++){
      console.log(hosts[i]["deviceIp"])
      var data = await ping.promise.probe(hosts[i]["deviceIp"]);
      var status = "Connected";
      if(!data["alive"]){
        status = "Disconnected";
      //send mail code
    }
    var createTransactionData = await deviceTransactionFunction.updateDeviceAndCreateTransaction(status,hosts[i]["deviceId"],hosts[i]["station"])
    if(status == "Disconnected"){
      var mail = sendEmail(hosts[i]);
    }
  }
},


}

async function sendEmail(device){
     // var text = require('textbelt');
//   console.log("text",text)
//   text.sendText('8605400543', 'A sample text message!', 'intl', function(err) {
//   if (err) {
//     console.log(err);
//   }
// });

var transporter = nodemailer.createTransport(selfSignedConfig);
var result ="Hi Sir, <br/><br/>";
result = result + "Writing just to let you know that below device is disconnected at station "+device["station"]+".";
result += "<br/>";
result += "<br/>";
result += "<table border=1>";
result += "<th>Device Id</td>";
result += "<th>Device IP</td>";
result += "<th>Station</td>";
result += "<th>Connection Status</td>";        
result += "<tr>";
result += "<td><b>"+device["deviceId"]+"</b></td>";
result += "<td><b>"+device["deviceIp"]+"</b></td>";
result += "<td><b>"+device["station"]+"</b></td>";
result += "<td><b>"+"Disconnected"+"</b></td>";
result += "</tr>";
result += "</table>";
result += "<br/>";
result +="Have a great day!";
console.log("result",result);
var mailOptions = {
  from: "servicedesk@briot.in", 
  to: "sagar@briot.in;servicedesk@briot.in",
  subject: "Device Connection Alert", 
  html: ''+result+'',
};
transporter.sendMail(mailOptions, function(error, info) {
  if(error){
    return error;
    console.log(error);
  } else {
    console.log('Message sent: ' + info.response);
    return "mail sent";
  }
});

}