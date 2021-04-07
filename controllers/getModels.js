const Vehicle = require('../models/vehicleModel');

export async function getModels(make){
  const models = await Vehicle.aggregate([
    {
      $match : {
        make : `${make}`
      }
    },
    {
      "$group": {
        _id: "$model",
        count: {$sum: 1}
      }
    }
  ]);
  console.log(models);
  // return makes;
}
