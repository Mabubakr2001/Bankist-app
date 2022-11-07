"use strict";

// Data
const account1 = {
  owner: "Muhammed Abubakr",
  movements: [
    300, 470, -500, 4000, -650, -130, 70, 1300, -500, 8000, -1500, 7500,
  ],
  interestRate: 1.6, // %
  pin: 1100,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
    "2020-08-14T12:59:26.795Z",
    "2021-01-26T01:51:36.391Z",
    "2021-01-29T10:55:22.701Z",
    "2021-02-01T10:53:36.780Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account2 = {
  owner: "Tom Holland",
  movements: [5000, 1250.5, 3400, -150, -790.55, -3210, -1000, 8500, -300],
  interestRate: 1.3,
  pin: 2200,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2022-11-02T12:01:20.894Z",
    "2022-11-05T19:04:28.894Z",
  ],
  currency: "GBP",
  locale: "en-GB",
};

const account3 = {
  owner: "Cillian Murphy",
  movements: [2000, 1255, 3425.5, -1500, -190.55, -1220, -1000, 8500],
  interestRate: 1.7,
  pin: 3300,
  movementsDates: [
    "2020-02-05T11:18:33.035Z",
    "2020-05-30T09:18:10.867Z",
    "2020-11-12T06:04:23.907Z",
    "2021-02-22T14:18:46.235Z",
    "2021-06-06T16:33:06.386Z",
    "2022-04-12T14:43:26.374Z",
    "2022-09-28T18:49:59.371Z",
    "2022-11-02T12:01:20.894Z",
  ],
  currency: "EUR",
  locale: "en-IE",
};

const accounts = [account1, account2, account3];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const formatMovDate = function (movDate, locale) {
  const calcPassedDays = (date_1, date_2) =>
    Math.round(Math.abs(date_2 - date_1) / (1000 * 60 * 60 * 24));

  const allPassedDays = calcPassedDays(new Date(), movDate);

  if (allPassedDays === 0) return "Today";
  if (allPassedDays === 1) return "Yesterday";
  if (allPassedDays <= 7) return `${allPassedDays} days ago`;

  return Intl.DateTimeFormat(locale).format(movDate);
};

const formatCurrency = function (locale, currency, amount) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
};

const displayMovements = function (account, sorted = false) {
  containerMovements.innerHTML = "";

  const allMovs = sorted
    ? account.movements.slice().sort((currMov, nextMov) => currMov - nextMov)
    : account.movements;

  allMovs.forEach(function (mov, index) {
    const movType = mov > 0 ? "deposit" : "withdrawal";
    const movDate = new Date(account.movementsDates[index]);
    const formattedDate = formatMovDate(movDate, account.locale);
    const formattedMov = formatCurrency(account.locale, account.currency, mov);
    const movRow = `
      <div class="movements__row">
        <div class="movements__type movements__type--${movType}">${
      index + 1
    } ${movType}</div>
        <div class="movements__date">${formattedDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", movRow);
  });
};

const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce(
    (movsSum, mov) => movsSum + mov,
    0
  );

  labelBalance.textContent = formatCurrency(
    account.locale,
    account.currency,
    account.balance
  );
};

function calcDisplaySummary(account) {
  const entireIncome = account.movements
    .filter(mov => mov > 0)
    .reduce((depositsSum, deposit) => depositsSum + deposit, 0);

  const entireOutcome = account.movements
    .filter(mov => mov < 0)
    .reduce((withdrawalsSum, withdrawal) => withdrawalsSum + withdrawal, 0);

  const entireInterest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(interest => interest >= 1)
    .reduce((interestsSum, interest) => interestsSum + interest, 0);

  labelSumIn.textContent = formatCurrency(
    account.locale,
    account.currency,
    entireIncome
  );
  labelSumOut.textContent = formatCurrency(
    account.locale,
    account.currency,
    Math.abs(entireOutcome)
  );
  labelSumInterest.textContent = formatCurrency(
    account.locale,
    account.currency,
    entireInterest
  );
}

function updateUI(account) {
  displayMovements(account);
  calcDisplayBalance(account);
  calcDisplaySummary(account);
}

const createUserNames = accounts =>
  accounts.forEach(
    account =>
      (account.userName = account.owner
        .toLowerCase()
        .split(" ")
        .map(word => word.at(0))
        .join(""))
  );

createUserNames(accounts);

function startLogOutTimer() {
  let time = 300;

  const tick = () => {
    const minutes = String(Math.trunc(time / 60)).padStart(2, 0);
    const seconds = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${minutes}:${seconds}`;

    if (time === 0) {
      clearInterval(reminingTime);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = "Log in to get started";
    }

    time--;
  };

  tick();
  const reminingTime = setInterval(tick, 1000);

  return reminingTime;
}

let currentAccount, reminingTime;

btnLogin.addEventListener("click", function (event) {
  event.preventDefault();

  currentAccount = accounts.find(
    account => account.userName === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    containerApp.style.opacity = "100%";
    labelWelcome.textContent = `Welcome, ${currentAccount.owner
      .split(" ")
      .at(0)}`;

    const currDate = new Date();
    const dateOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      weekday: "long",
      hour: "numeric",
      minute: "numeric",
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      dateOptions
    ).format(currDate);

    updateUI(currentAccount);

    if (reminingTime) clearInterval(reminingTime);
    reminingTime = startLogOutTimer();
  }
});

btnTransfer.addEventListener("click", function (event) {
  event.preventDefault();

  const intendedAccount = accounts.find(
    account => account.userName === inputTransferTo.value
  );

  const sendedAmount = +inputTransferAmount.value;

  if (
    intendedAccount &&
    intendedAccount.userName !== currentAccount.userName &&
    sendedAmount > 0 &&
    sendedAmount <= currentAccount.balance
  ) {
    inputTransferTo.value = inputTransferAmount.value = "";
    inputTransferAmount.blur();
    currentAccount.movements.push(-sendedAmount);
    currentAccount.movementsDates.push(new Date().toISOString());
    intendedAccount.movements.push(sendedAmount);
    intendedAccount.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
    clearInterval(reminingTime);
    reminingTime = startLogOutTimer();
  }
});

btnLoan.addEventListener("click", function (event) {
  event.preventDefault();

  const loanAmount = Math.floor(inputLoanAmount.value);
  const hasTenPercentFromTheLoan = currentAccount.movements.some(
    mov => mov >= loanAmount * 0.1
  );

  if (loanAmount > 0 && hasTenPercentFromTheLoan) {
    setTimeout(() => {
      currentAccount.movements.push(loanAmount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
      clearInterval(reminingTime);
      reminingTime = startLogOutTimer();
    }, 3000);
    inputLoanAmount.value = "";
    inputLoanAmount.blur();
  }
});

btnClose.addEventListener("click", function (event) {
  event.preventDefault();

  if (
    currentAccount.userName === inputCloseUsername.value &&
    currentAccount.pin === +inputClosePin.value
  ) {
    const index = accounts.findIndex(
      account => account.userName === currentAccount.userName
    );

    accounts.splice(index, 1);

    labelWelcome.textContent = "Log in to get started";
    containerApp.style.opacity = 0;
    inputCloseUsername.value = inputClosePin.value = "";
  }
});

let isSorted = false;

btnSort.addEventListener("click", function (event) {
  event.preventDefault;
  displayMovements(currentAccount, !isSorted);
  isSorted = !isSorted;
});
