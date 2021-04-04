const Vehicle = require('../models/vehicleModel');

export async function getModels(){  
  const makes = await Vehicle.aggregate([
    { "$group": {_id: "$make", count: {$sum: 1}}}
  ]);
  console.log(makes);
  return makes;
}