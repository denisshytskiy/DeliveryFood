'use strict';

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
let login = localStorage.getItem('authUser');
const loginInInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const userWarning = document.querySelector('.user-warning');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');
const sectionHeadingMenu = document.querySelector('.section-heading-menu');

const getData = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Ошибка по адресу ${url},
    статус ошибки ${response.status}!`)
  }
  return await response.json();
}

// open modal trash
const toggleModal = () => {
  modal.classList.toggle("is-open");
}

// open modal auth
const toggleModalAuth = () => {
  modalAuth.classList.toggle("is-open");
}

const authorized = () => {
  userName.textContent = login;
  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'block';

  const logOut = () => {
    login = null;
    localStorage.removeItem('authUser');

    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    userWarning.style.display = '';

    buttonOut.removeEventListener('click', logOut);
    checkAuth();
  }

  buttonOut.addEventListener('click', logOut);
};

const notAuthorized = () => {

  const logIn = (event) => {
    event.preventDefault();
    login = loginInInput.value.trim();

    if (login.length) {
      localStorage.setItem('authUser', login)
      toggleModalAuth();
      buttonAuth.removeEventListener("click", toggleModalAuth);
      closeAuth.removeEventListener("click", toggleModalAuth);
      logInForm.removeEventListener('submit', logIn);
      logInForm.reset();
      checkAuth();
    } else {
      userWarning.style.display = 'block';
    }
  }

  buttonAuth.addEventListener("click", toggleModalAuth);
  closeAuth.addEventListener("click", toggleModalAuth);
  logInForm.addEventListener('submit', logIn)
};

const checkAuth = () => {
  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
};

const createCardRestaurant = ({ image, kitchen, name, price, products, stars,
                                time_of_delivery: timeOfDelivery,}) => {
  const card = `
    <a
    class="card card-restaurant"
    data-products="${products}"
    data-kitchen="${kitchen}"
    data-stars="${stars}"
    data-price="${price}"
    data-name="${name}"
    >
      <img src="${image}" alt="image" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title">${name}</h3>
          <span class="card-tag tag">${timeOfDelivery}</span>
        </div>
        <div class="card-info">
          <div class="rating">
            ${stars}
          </div>
          <div class="price">От ${price} ₽</div>
          <div class="category">${kitchen}</div>
        </div>
      </div>
    </a>
  `;

  cardsRestaurants.insertAdjacentHTML('beforeend', card);
};

const createCardGood = ({ description, id, name, image, price }) => {
  const card = document.createElement('div');
  card.className = 'card';

  card.insertAdjacentHTML('beforeend', `
    <img src="${image}" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">${name}</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">
            ${description}
        </div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold">${price} ₽</strong>
      </div>
    </div>
  `);

  cardsMenu.insertAdjacentElement('beforeend',card);

}

const createMenu = (name, stars, price, kitchen) => {
  const menuElement = document.createElement('div');
  menuElement.classList = 'section-heading';

  menuElement.insertAdjacentHTML('beforeend', `
    <h2 class="section-title restaurant-title">${name}</h2>
    <div class="card-info">
      <div class="rating">
      ${stars}
      </div>
      <div class="price">От ${price} ₽</div>
      <div class="category">${kitchen}</div>
    </div>
  `);

  sectionHeadingMenu.insertAdjacentElement('beforeend', menuElement);
}

const openGoods = (event) => {
  const target = event.target;
  const restaurant = target.closest('.card-restaurant');

  // check auth user
  if (login) {
    if (restaurant) {
      cardsMenu.textContent = '';
      sectionHeadingMenu.textContent = '';

      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');

      const products = restaurant.dataset.products;
      const kitchen = restaurant.dataset.kitchen;
      const name = restaurant.dataset.name;
      const price = restaurant.dataset.price;
      const stars = restaurant.dataset.stars;

      createMenu(name, stars, price, kitchen);
      getData(`./db/${products}`).then(createCardsGoods)
    }
  } else {
    toggleModalAuth();
  }

};

const stepBackToRestaurants = () => {
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide');
}

const createCardsGoods = (data) => {
  data.forEach(createCardGood)
}

const createCardsRestaurant = (data) => {
  data.forEach(createCardRestaurant)
}


const init = () => {
  getData('./db/partners.json').then(createCardsRestaurant)

  // events trash
  cartButton.addEventListener("click", toggleModal);
  close.addEventListener("click", toggleModal);
  // step forward and backward at the click of the restaurant
  cardsRestaurants.addEventListener('click', openGoods);
  logo.addEventListener('click', stepBackToRestaurants);

  checkAuth();
}

init();
