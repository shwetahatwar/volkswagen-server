const db = require("../models");
const Master = db.masters;
const Op = db.Sequelize.Op;

// Create and Save a new master
exports.create = (req, res) => {
  if (!req.body.vinNumber) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  const master = {
    vinNumber: req.body.vinNumber,
    pinNumber: req.body.pinNumber,
    epcId: req.body.epcId
  };

  // Save master in the database
  Master.create(master)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err["errors"][0]["message"] || "Some error occurred while creating the master."
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Master.update(req.body, {
    where: {
      vinNumber: id
    }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Master was updated successfully."
        });
      } else {
        const master = {
          vinNumber: req.body.vinNumber,
          pinNumber: req.body.pinNumber,
          epcId: req.body.epcId
        };

        // Save master in the database
        Master.create(master)
          .then(data => {
            res.send(data);
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating the master."
            });
          });
        // res.send({
        //   message: `Cannot update Master with id=${id}. Maybe Master was not found or req.body is empty!`
        // });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Master with id=" + id
      });
    });
};

// Retrieve all masters from the database.
exports.findAll = (req, res) => {
  Master.findAll({ 
    where: req.query
    })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving masters."
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Master.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Master with id=" + id
      });
    });
};

