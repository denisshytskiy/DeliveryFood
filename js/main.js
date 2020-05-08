'use strict';

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
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
const modalBody = document.querySelector('.modal-body');
const modalPrice = document.querySelector('.modal-pricetag');
const buttonClearCard = document.querySelector('.clear-cart');
let login = localStorage.getItem('authUser');


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
  const logOut = () => {
    login = null;
    localStorage.removeItem('authUser');

    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    userWarning.style.display = '';
    cartButton.style.display = '';

    buttonOut.removeEventListener('click', logOut);
    checkAuth();
  }

  userName.textContent = login;
  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'block';
  cartButton.style.display = 'flex';
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
        <button class="button button-primary button-add-cart" id="${id}">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price card-price-bold">${price} ₽</strong>
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

const addToCard = (event) => {
  const target = event.target;
  const buttonAddToCard = target.closest('.button-add-cart');

  if (buttonAddToCard) {
    const card = target.closest('.card');
    const title = card.querySelector('.card-title-reg').textContent;
    const cost = card.querySelector('.card-price').textContent;
    const id = buttonAddToCard.id;
    const carts = cartLists(localStorage.getItem('cartList'));
    const food = carts.find(item => item.id === id)

    if (food) {
      food.count += 1;
    } else {
      carts.push({
        id,
        title,
        cost,
        count: 1
      })
    }

  localStorage.setItem('cartList', JSON.stringify(carts));
  }
}

const renderCard = () => {
  modalBody.textContent = '';
  const carts = cartLists(localStorage.getItem('cartList'));

  carts.forEach(({id, title, cost, count}) => {
    const itemCart = `
      <div class="food-row">
        <span class="food-name">${title}</span>
        <strong class="food-price">${cost}</strong>
        <div class="food-counter">
          <button class="counter-button counter-minus" data-id="${id}">-</button>
          <span class="counter">${count}</span>
          <button class="counter-button counter-plus" data-id="${id}">+</button>
        </div>
      </div>
    `;

    modalBody.insertAdjacentHTML('beforeend', itemCart);
  })

  const totalPrice = carts.reduce((result, item) => result + (parseFloat(item.cost) * item.count), 0);
  modalPrice.textContent = `${totalPrice} ₽`;

};

const changeCount = (event) => {
  const target = event.target;

  if (target.classList.contains('counter-button')) {
    const carts = cartLists(localStorage.getItem('cartList'));
    const id = target.dataset.id;
    const food = carts.find(index => index.id === id);

    if (target.classList.contains('counter-minus')) {
      food.count--;

      if (!food.count) {
        carts.splice(carts.indexOf(food), 1)
      }
    }

    if (target.classList.contains('counter-plus')) food.count++;

    localStorage.setItem('cartList', JSON.stringify(carts));

    renderCard();
  }
}

const clearCart = () => {
  localStorage.setItem('cartList', '');
  renderCard();
}

const cartLists = (cartList) => {
  return cartList && cartList.length ? JSON.parse(cartList) : [];
}

const init = () => {
  getData('./db/partners.json').then(createCardsRestaurant)

  // events trash
  cartButton.addEventListener("click", () => {
    renderCard();
    toggleModal();
  });

  buttonClearCard.addEventListener('click', clearCart)
  modalBody.addEventListener('click', changeCount)
  cardsMenu.addEventListener('click', addToCard);
  close.addEventListener("click", toggleModal);
  // step forward and backward at the click of the restaurant
  cardsRestaurants.addEventListener('click', openGoods);
  logo.addEventListener('click', stepBackToRestaurants);

  checkAuth();

  new Swiper('.swiper-container', {
    loop: true,
    autoplay: true
  })
}

init();
