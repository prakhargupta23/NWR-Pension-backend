const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "mssql",
  username: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,
  host: process.env.SQL_SERVER,
  dialectOptions: {
    options: {
      encrypt: true, // Required for Azure SQL
      trustServerCertificate: true, // True for local dev/self-signed certs
      requestTimeout: 30000, // 30 seconds
      connectTimeout: 30000, // 30 seconds
    },
  },
  pool: {
    max: 5, // Increase pool size if necessary based on your app's load
    min: 0,
    acquire: 30000, // 30 seconds to try getting a connection before throwing error
    idle: 10000, // Connections will be closed after 10 seconds of being idle
  },
  retry: {
    match: [
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/,
      /SequelizeHostNotFoundError/,
      /SequelizeHostNotReachableError/,
      /SequelizeInvalidConnectionError/,
      /SequelizeConnectionTimedOutError/,
      /TimeoutError/,
    ],
    max: 3 // Retry 3 times
  },
  logging: false, // Disable logging in production
});

module.exports = sequelize;