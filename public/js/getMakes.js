const Vehicle = require('../../models/vehicleModel');

export async function getMakes(){  
  const makes = await Vehicle.aggregate([
    { "$group": {_id: "$make", count: {$sum: 1}}}
  ]);
  console.log(makes);
  return makes;
}