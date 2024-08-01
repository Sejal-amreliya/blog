const { Sequelize } = require('sequelize');
const config = require('../config/config').development;

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.posts = require('./post')(sequelize, Sequelize);
db.users = require('./user')(sequelize, Sequelize); // Add this line

module.exports = db;

