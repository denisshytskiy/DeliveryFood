const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
// open modal trash
const toggleModal = () => {
  modal.classList.toggle("is-open");
}

// events trash
cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);


// open modal auth
const toggleModalAuth = () => {
  modalAuth.classList.toggle("is-open");
}

const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
let login = localStorage.getItem('authUser');
const loginInInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const userWarning = document.querySelector('.user-warning');

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
    login = loginInInput.value;


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
}
checkAuth();


