const Sequelize = require("sequelize");
const Op = Sequelize.Op;
var HTTPError = require('http-errors');
const DeviceTransactionTable = require('../models').deviceTransactionTable;
const DeviceTable = require('../models').deviceTable;

exports.updateDeviceAndCreateTransaction = async(status,deviceId,station)=> {
	var whereClause = {};
	whereClause.connectionStatus = status;
	whereClause.deviceId = deviceId;
	whereClause.station = station;
	whereClause.timestamp = Date.now();

	var updatedDeviceData = await DeviceTable.update(whereClause, {
		where: {
			deviceId: deviceId
		}
	});

	var transactionData = await DeviceTransactionTable.create(whereClause);
	return transactionData;
	
};
