import axios from 'axios';

export const removeElements = () => {
  const el = document.querySelector('.car-list-items');
  if(el) el.parentElement.removeChild(el);
};

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

    vehicles.data.data.data.map((vehicle) => {
      removeElements();
      const markup = `
      <div class="car-list-items">
      <div class="list__vehicle-card" id="inner-vehicle">
        <div class="car-item-row">
          <div class="row">
            <div class="p-r-o col-lg-4 col-md-12">
              <div class="car-image-wrapper">
                <div class="img-item">
                  <div class="img-item-inner" style="background-image: url(images/vehicles/${vehicle.imageCover})">
                  </div>
                </div>
                <span class="image-count">
                  <span class="m-1">${vehicle.images.length}</span>
                  <i class="fas fa-camera ml-2">
                  </i>
                </span>
              </div>
            </div>
            <div lass="col-lg-8 col-md-12">
              <div class="car-info">
                <a class="link" href="/vehicle/${vehicle.slug}">
                  <h3 class="strong text-secondary">${vehicle.make} ${vehicle.model} ${vehicle.overview.year}</h3>
                </a>
                <div class="row row">
                  <div class="col">
                    <div class="row">
                      <div class="col-md-6 col-sm-6 col-12">
                        <div class="car-spec-field">
                          <span class="spec-icon mr-2">
                              <img src="images/fuel.svg" alt="">
                          </span>
                          <span>${vehicle.overview.Fuel}</span>
                        </div>
                        <div class="car-spec-field">
                          <span class="spec-icon mr-2">
                            <img src="images/gearbox.svg" alt="">
                          </span>
                          <span>${vehicle.overview.transmission}</span>
                        </div>
                        <div class="car-spec-field">
                          <span class="spec-icon mr-2">
                            <img src="images/year.svg" alt="">
                          </span>
                          <span>${vehicle.overview.year}</span>
                        </div>
                      </div>
                      <div class="col-md-6 col-sm-6 col-12">
                        <div class="car-spec-field">
                          <span class="spec-icon mr-2">
                            <img src="images/mileage.svg" alt="">
                          </span>
                          <span>${vehicle.overview.mileage}</span>
                        </div>
                        <div class="car-spec-field">
                          <span class="spec-icon mr-2">
                            <img src="/images/engine-default.svg" alt="">
                          </span>
                          <span>${vehicle.overview.engineSize}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col">
                    <div class="test-right car-offer">
                      <div class="car-price">
                        <span> KSH ${vehicle.price}</span>
                      </div>
                      <div class="details">
                        <a class="link" href="/vehicle/${vehicle.slug}">
                          <button class="btn btn-primary">
                            View Detais
                          </button>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      `
      document.querySelector('.main-content').insertAdjacentHTML('afterbegin', markup);
    });

  } catch (err) {
    console.log(err);
  }
};
