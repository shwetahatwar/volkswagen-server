const RFIDTagMaster = require('../models').rfidTagMaster;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
var HTTPError = require('http-errors');
const TransactionTable = require('../models').transactionTable;

exports.updateRFIDMMasterAndCreateTransaction = async(rfidData)=> {
	var updateData = {};
	console.log("rfidData",rfidData)
	var rfidMasterId = rfidData["id"];
	updateData.verifiedTimestamp = Date.now();
	updateData.verifiedStation = "CP8";

	try{
		var updatedMasterData = await RFIDTagMaster.update(updateData, {
			where: {
				id: rfidMasterId
			}
		})
		if (!updatedMasterData) {
			return next(HTTPError(500, "RFID tag master data not updated"))
		}
	}
	catch (err) {
		if(err["errors"]){
			return next(HTTPError(500,err["errors"][0]["message"]))
		}
		else{
			return next(HTTPError(500,"Internal error has occurred, while updating the RFID tag master data."))
		}
	}

	transactionType = "Verify";
	var transaction = {
		rfidMasterId: rfidMasterId,
		timestamp: Date.now(),
		transactionType:transactionType
	}

	var transactionData = await TransactionTable.create(transaction);

	return transactionData;
};

exports.createUpdateTransaction = async(rfidMasterId,transactionType) =>{

  var transaction = {
    rfidMasterId: rfidMasterId,
    timestamp: Date.now(),
    transactionType:transactionType
  }

  var transactionData = await TransactionTable.create(transaction);
  return transactionData;
}