const mongoose = require('mongoose');

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log(`Successfully connected to the server with host: ${data.connection.host}`);
    })
    .catch((error) => {
      console.error('Connection to the database failed:', error);
    });
};

module.exports = connectDatabase;

