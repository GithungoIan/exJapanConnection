import axios from 'axios';

export const removeElements = () => {
  const el = document.querySelector('#inner-model');
  if(el) el.parentElement.removeChild(el);
};

export const getModels =  async(make) => {
  try {
    const models = await axios({
      method: 'POST',
      url: '/api/v1/vehicles/modelsMakeStats',
      data: {
        make
      }
    });

    models.data.models.map((model) => {
      removeElements();
      const markup = `
        <option id="inner-model" value= ${model._id}>${model._id} (${model.count})</option>
      `
      document.querySelector('.vehicle-model').insertAdjacentHTML('afterbegin', markup);
    });
  } catch (err) {
    console.log(err);
  }
}
