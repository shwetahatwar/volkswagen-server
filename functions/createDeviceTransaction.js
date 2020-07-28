const Sequelize = require("sequelize");
const Op = Sequelize.Op;
var HTTPError = require('http-errors');
const DeviceTransactionTable = require('../models').deviceTransactionTable;
const DeviceTable = require('../models').deviceTable;

exports.updateDeviceAndCreateTransaction = async(status,deviceId,station)=> {
	var updateData = {};
	updateData.connectionStatus = status;
	updateData.deviceId = deviceId;
	updateData.station = station;
	updateData.timestamp = Date.now();

	var updatedDeviceData = await DeviceTable.update(updateData, {
		where: {
			deviceId: deviceId
		}
	});

	var transactionData = await DeviceTransactionTable.create(updateData);
	return transactionData;
	
};
