const mongoose = require('mongoose');
const dotenv = require('dotenv');


process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 🔥 Shutting down...');
  console.log(err.name, err.message);
  console.log(err.stack);
  process.exit(1);
});

dotenv.config({path: './config.env'});
const app = require('./app');

const DB = process.env.DATABASE_LOCAL;

mongoose.connect(DB, {
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true,
}).then(() =>  console.log('DB, Connection established successfully'));

const port = process.env.PORT;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}`)
})

process.on(`unhandledRejection`, (err) => {
  console.log('Unhandled Rejection! 🔥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});