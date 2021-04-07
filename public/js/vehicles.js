import axios from 'axios';

export const getCars = async (make) => {
  try {
    const vehicles = await axios({
      method: 'GET',
      url: `/api/v1/vehicles`,
      params: {
        make
      }
    });
    if(vehicles.data.status = 'success'){
      console.log(vehicles.data)
    }
  } catch (err) {
    console.log(err);
  }
};
