import axios from 'axios';

export const getVehicles = async (make, model) => {
  try {
    const vehicles = await axios({
      method: 'GET',
      url: `/api/v1/vehicles`,
      params: {
        make,
        model
      }
    });
    if(vehicles.data.status = 'success'){
      console.log(vehicles.data)
    }
  } catch (err) {
    console.log(err);
  }
};
