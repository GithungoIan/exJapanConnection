import '@babel/polyfill';
import {getVehicles} from './searchVehicles';
import {getModels} from './getModels';
import {getCars} from './vehicles';
// DOM ELEMENTS
const vehicleForm = document.querySelector('.form--vehicles');
const makeSelectField = document.querySelector('.vehicle-make');

makeSelectField.addEventListener('click', () => {
  const make = document.getElementById('make').value;
  getModels(make);
});


if(vehicleForm){
  vehicleForm.addEventListener('submit', async e => {
    e.preventDefault();
    const make = document.getElementById('make').value;
    const model = document.getElementById('model').value;
     await getVehicles(make, model);
     // await getCars(make);
  });
}

// makeSelectField.addEventListener('onChange',  e => {
//   const make = document.getElementById('make').value;
//   getModels(make);
// });
