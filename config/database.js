const mongoose = require('mongoose');

const connectDatabase = () => {
  mongoose
    .connect('mongodb://127.0.0.1:27017/Ecommerce', {
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

