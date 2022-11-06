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
  owner: "Cillian Murphy",
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
  currency: "EUR",
  locale: "is-IL",
};

const accounts = [account1, account2];

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

const formatMovDate = function (movDate) {
  const calcPassedDays = (date_1, date_2) =>
    Math.round(Math.abs(date_2 - date_1) / (1000 * 60 * 60 * 24));

  const allPassedDays = calcPassedDays(new Date(), movDate);

  if (allPassedDays === 0) return "Today";
  if (allPassedDays === 1) return "Yesterday";
  if (allPassedDays <= 7) return `${allPassedDays} days ago`;

  const movYear = movDate.getFullYear();
  const movMonth = movDate.getMonth() + 1;
  const movDay = movDate.getDate();
  return `${movMonth}/${movDay}/${movYear}`;
};

const displayMovements = function (account, sorted = false) {
  containerMovements.innerHTML = "";

  const allMovs = sorted
    ? account.movements.slice().sort((currMov, nextMov) => currMov - nextMov)
    : account.movements;

  allMovs.forEach(function (mov, index) {
    const movType = mov > 0 ? "deposit" : "withdrawal";
    const movDate = new Date(account.movementsDates[index]);
    const finalDate = formatMovDate(movDate);
    const movRow = `
      <div class="movements__row">
        <div class="movements__type movements__type--${movType}">${
      index + 1
    } ${movType}</div>
        <div class="movements__date">${finalDate}</div>
        <div class="movements__value">${mov.toFixed(2)}$</div>
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
  labelBalance.textContent = `${account.balance.toFixed(2)}$`;
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

  labelSumIn.textContent = `${entireIncome.toFixed(2)}`;
  labelSumOut.textContent = `${Math.abs(entireOutcome).toFixed(2)}`;
  labelSumInterest.textContent = `${entireInterest.toFixed(2)}`;
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

let currentAccount;

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
    const currYear = currDate.getFullYear();
    const currMonth = currDate.getMonth() + 1;
    const currDay = currDate.getDate();
    const currHour = `${currDate.getHours() - 12}`.padStart(2, 0);
    const currMinute = `${currDate.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = `${currMonth}/${currDay}/${currYear}, ${currHour}:${currMinute}`;
    updateUI(currentAccount);
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
  }
});

btnLoan.addEventListener("click", function (event) {
  event.preventDefault();

  const loanAmount = Math.floor(inputLoanAmount.value);
  const hasTenPercentFromTheLoan = currentAccount.movements.some(
    mov => mov >= loanAmount * 0.1
  );

  if (loanAmount > 0 && hasTenPercentFromTheLoan) {
    inputLoanAmount.value = "";
    inputLoanAmount.blur();
    currentAccount.movements.push(loanAmount);
    currentAccount.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
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
