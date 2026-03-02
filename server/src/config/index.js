const path = require('path');

module.exports = {
  port: process.env.PORT || 5000,
  uploadsDir: path.join(__dirname, '../../uploads'),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
};
