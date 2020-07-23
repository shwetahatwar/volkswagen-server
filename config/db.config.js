// module.exports = {
//   HOST: "localhost",
//   USER: "root",
//   PASSWORD: "root123",
//   DB: "rfidsolution",
//   dialect: "mysql",
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000
//   }
// };

module.exports = {
  USER: 'nik',
  PASSWORD: 'briot123',
  HOST: 'localhost', // You can use 'localhost\\instance' to connect to named instance
  DB: 'rfidsolution',
  dialect:'mssql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
}