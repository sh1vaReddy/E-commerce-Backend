const app = require('./app');
const dotenv = require('dotenv')
const connectdatabase = require('./config/database');
const cloudinary = require('cloudinary');

// uncaught error
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down the server due to uncaught exception');
  process.exit(1);
});

// config
dotenv.config({ path: 'backend/config/config.env' });

// connecting database
connectdatabase();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const Server = app.listen(process.env.PORT, () => {
  console.log(`The server is running http://localhost:${process.env.PORT}`);
});

// unhandled error
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down the server due to unhandled rejection');

  Server.close(() => {
    process.exit(1);
  });
});
