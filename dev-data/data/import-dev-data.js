const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Vehicle = require('./../../models/vehicleModel');

dotenv.config({path: './config.env'});

const DB = process.env.DATABASE_LOCAL;

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}).then(() => console.log('DB connection successful'));

// Read json file
const vehicles = JSON.parse(fs.readFileSync(`${__dirname}/vehicles.json`, 'utf-8'));

// import data into the db
const importData = async () => {
  try{
    await Vehicle.create(vehicles);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// Delete  All Data from db
const deleteData = async () => {
  try{
    await Vehicle.deleteMany();
    console.log('Data successully deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
}

if(process.argv[2] === '--import'){
  importData();
} else if(process.argv[2] === '--delete') {
  deleteData();
}
