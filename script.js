"use strict";

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
    "2021-05-27T17:01:17.194Z",
    "2021-07-11T23:36:17.929Z",
    "2021-07-12T10:51:36.790Z",
    "2022-10-22T12:59:26.795Z",
    "2022-11-02T01:51:36.391Z",
    "2022-11-06T10:55:22.701Z",
    "2022-11-08T10:53:36.780Z",
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

const formatMovementDate = function (movementDate, locale) {
  const calcPassedDays = (date_1, date_2) =>
    Math.round(Math.abs(date_2 - date_1) / (1000 * 60 * 60 * 24));

  const passedDays = calcPassedDays(movementDate, new Date());

  return passedDays === 0
    ? "Today"
    : passedDays === 1
    ? "Yesterday"
    : passedDays <= 7
    ? `${passedDays} days ago`
    : new Intl.DateTimeFormat(locale).format(movementDate);
};

const formatAmount = function (currency, locale, amount) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
};

const displayMovements = function (account, sorted = false) {
  containerMovements.innerHTML = "";

  const movements = sorted
    ? account.movements
        .slice()
        .sort((currentMovement, nextMovement) => currentMovement - nextMovement)
    : account.movements;

  movements.forEach(function (movement, index) {
    const movementType = movement > 0 ? "deposit" : "withdrawal";
    const movementDate = new Date(account.movementsDates[index]);
    const formattedMovementAmount = formatAmount(
      account.currency,
      account.locale,
      movement
    );
    const formattedMovementDate = formatMovementDate(
      movementDate,
      account.locale
    );
    const movementRow = `
      <div class="movements__row">
        <div class="movements__type movements__type--${movementType}">${
      index + 1
    } ${movementType}</div>
        <div class="movements__date">${formattedMovementDate}</div>
        <div class="movements__value">${formattedMovementAmount}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", movementRow);
  });
};

function calcDisplayBalance(account) {
  account.balance = account.movements.reduce(
    (balance, movement) => balance + movement,
    0
  );
  labelBalance.textContent = formatAmount(
    account.currency,
    account.locale,
    account.balance
  );
}

function calcDisplaySummary(account) {
  const totalIncome = account.movements
    .filter(movement => movement > 0)
    .reduce((income, deposit) => income + deposit, 0);

  const totalOutcome = account.movements
    .filter(movement => movement < 0)
    .reduce((outcome, withdrawal) => outcome + withdrawal, 0);

  const totalInterest = account.movements
    .filter(movement => movement > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(interest => interest >= 1)
    .reduce((benefit, interest) => benefit + interest, 0);

  labelSumIn.textContent = formatAmount(
    account.currency,
    account.locale,
    totalIncome
  );

  labelSumOut.textContent = formatAmount(
    account.currency,
    account.locale,
    Math.abs(totalOutcome)
  );

  labelSumInterest.textContent = formatAmount(
    account.currency,
    account.locale,
    totalInterest
  );
}

function updateUI(account) {
  displayMovements(account);
  calcDisplayBalance(account);
  calcDisplaySummary(account);
}

const createUsernames = accounts =>
  accounts.forEach(
    account =>
      (account.username = account.owner
        .toLowerCase()
        .split(" ")
        .map(word => word.at(0))
        .join(""))
  );

createUsernames(accounts);

const startLogOutTimer = function () {
  let time = 300;

  const remainingTime = setInterval(() => {
    time--;

    const minutes = String(Math.trunc(time / 60)).padStart(2, 0);
    const seconds = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${minutes}:${seconds}`;

    if (time === 0) {
      clearInterval(remainingTime);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = "Log in to get started";
    }
  }, 1000);

  return remainingTime;
};

let currentAccount, remainingTime;

function setTimer() {
  labelTimer.textContent = "05:00";
  if (remainingTime) clearInterval(remainingTime);
  remainingTime = startLogOutTimer();
}

btnLogin.addEventListener("click", function (event) {
  event.preventDefault();

  currentAccount = accounts.find(
    account => account.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    containerApp.style.opacity = "100%";
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    labelWelcome.textContent = `Welcome, ${currentAccount.owner
      .split(" ")
      .at(0)}`;

    const currentDate = new Date();
    const showDateOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      weekday: "long",
      hour: "numeric",
      minute: "numeric",
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      showDateOptions
    ).format(currentDate);

    updateUI(currentAccount);
    setTimer();
  }
});

btnTransfer.addEventListener("click", function (event) {
  event.preventDefault();

  const intendedAccount = accounts.find(
    account => account.username === inputTransferTo.value
  );

  const sendedAmount = Math.floor(inputTransferAmount.value);

  if (
    intendedAccount &&
    intendedAccount.username !== currentAccount.username &&
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
    setTimer();
  }
});

btnLoan.addEventListener("click", function (event) {
  event.preventDefault();

  const loanAmount = Math.floor(inputLoanAmount.value);

  const hasTenPercentFromTheLoan = currentAccount.movements.some(
    movement => movement >= loanAmount * 0.1
  );

  if (loanAmount > 0 && hasTenPercentFromTheLoan) {
    setTimeout(() => {
      currentAccount.movements.push(loanAmount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
      setTimer();
    }, 3000);
    inputLoanAmount.value = "";
    inputLoanAmount.blur();
  }
});

btnClose.addEventListener("click", function (event) {
  event.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === +inputClosePin.value
  ) {
    const accountIndex = accounts.findIndex(
      account => account.username === currentAccount.username
    );

    accounts.splice(accountIndex, 1);

    containerApp.style.opacity = 0;
    inputCloseUsername.value = inputClosePin.value = "";
    labelWelcome.textContent = "Log in to get started";
  }
});

let isSorted = false;

btnSort.addEventListener("click", function (event) {
  event.preventDefault();
  displayMovements(currentAccount, !isSorted);
  isSorted = !isSorted;
});
