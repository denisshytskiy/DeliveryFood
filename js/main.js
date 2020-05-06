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

const createCardRestaurant = () => {
  const card = `
    <a class="card card-restaurant">
      <img src="img/tanuki/preview.jpg" alt="image" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title">Тануки</h3>
          <span class="card-tag tag">60 мин</span>
        </div>
        <div class="card-info">
          <div class="rating">
            4.5
          </div>
          <div class="price">От 1 200 ₽</div>
          <div class="category">Суши, роллы</div>
        </div>
      </div>
    </a>
  `;

  cardsRestaurants.insertAdjacentHTML('beforeend', card);
};

const createCardGood = () => {
  const card = document.createElement('div');
  card.className = 'card';

  card.insertAdjacentHTML('beforeend', `
    <img src="img/pizza-plus/pizza-vesuvius.jpg" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">Пицца Везувий</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">Соус томатный, сыр «Моцарелла», ветчина, пепперони, перец
        «Халапенье», соус «Тобаско», томаты.
        </div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold">545 ₽</strong>
      </div>
    </div>
  `);

  cardsMenu.insertAdjacentElement('beforeend',card);

}

const openGoods = (event) => {
  const target = event.target;
  const restaurant = target.closest('.card-restaurant');

  // check auth user
  if (login) {
    if (restaurant) {
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');

      cardsMenu.textContent = '';

      createCardGood();
      createCardGood();
      createCardGood();
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

// events trash
cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);
// step forward and backward at the click of the restaurant
cardsRestaurants.addEventListener('click', openGoods);
logo.addEventListener('click', stepBackToRestaurants);

checkAuth();
createCardRestaurant();
