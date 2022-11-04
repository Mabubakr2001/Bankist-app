"use strict";

// Data
const account1 = {
  owner: "Muhammed Abubakr",
  movements: [300, 470, -500, 4000, -650, -130, 70, 1300],
  interestRate: 1.3, // %
  pin: 1100,
};

const account2 = {
  owner: "Chris Williams",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.6,
  pin: 2200,
};

const account3 = {
  owner: "Cillian Murphy",
  movements: [200, -200, 340, -500, -200, 50, 400, -460, 850, 200],
  interestRate: 0.9,
  pin: 3300,
};

const account4 = {
  owner: "Hassan Muhammed",
  movements: [430, 1000, 700, 50, -90, 100, -235],
  interestRate: 1,
  pin: 4400,
};

const account5 = {
  owner: "Adrien Brody",
  movements: [320, 1500, 200, 505, 905, -100, -2500, 200],
  interestRate: 1.4,
  pin: 5500,
};

const account6 = {
  owner: "Tom Holland",
  movements: [200, 500, 900, -100, 300, -1300, -250, 5000],
  interestRate: 1.8,
  pin: 6600,
};

const account7 = {
  owner: "Chris Hemsworth",
  movements: [100, 500, -200, -100, 1500, -250, 5000, 200],
  interestRate: 1.4,
  pin: 7700,
};

const accounts = [
  account1,
  account2,
  account3,
  account4,
  account5,
  account6,
  account7,
];

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

// Display the client's movements
const displayMovements = function (movements, sorted = false) {
  containerMovements.innerHTML = "";

  const movs = sorted
    ? movements.slice().sort((currentMov, nextMove) => currentMov - nextMove)
    : movements;

  movs.forEach(function (movement, index) {
    const movType = movement > 0 ? "deposit" : "withdrawal";
    const movRow = `
      <div class="movements__row">
        <div class="movements__type movements__type--${movType}">${
      index + 1
    } ${movType}</div>
        <div class="movements__value">${movement}$</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", movRow);
  });
};

// Calculate and display the balance of the client
const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce(
    (accumulator, movement) => accumulator + movement,
    0
  );
  labelBalance.textContent = `${account.balance}$`;
};

// Calculate and display the summary
function calcDisplaySummary(account) {
  const entireIncome = account.movements
    .filter(movement => movement > 0)
    .reduce((accumulator, deposit) => accumulator + deposit, 0);

  const entireOutcome = account.movements
    .filter(movement => movement < 0)
    .reduce((accumulator, withdrawal) => accumulator + withdrawal, 0);

  const entireInterest = account.movements
    .filter(movement => movement > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(interest => interest >= 1)
    .reduce((accumulator, interest) => accumulator + interest, 0);

  labelSumIn.textContent = `${entireIncome}$`;
  labelSumOut.textContent = `${Math.abs(entireOutcome)}$`;
  labelSumInterest.textContent = `${entireInterest.toFixed(2)}$`;
}

// Update the user interface
function updateUI(account) {
  displayMovements(account.movements);
  calcDisplayBalance(account);
  calcDisplaySummary(account);
}

// Create the usernames
const createUsernames = accounts =>
  accounts.forEach(
    account =>
      (account.username = account.owner
        .toLowerCase() // muhammed abubakr
        .split(" ") // ["muhammed", "abubakr"]
        .map(subName => subName.at(0)) // ["m", "a"]
        .join("")) // ma
  );

createUsernames(accounts);

let currentAccount;

btnLogin.addEventListener("click", function (event) {
  event.preventDefault();

  currentAccount = accounts.find(
    account => account.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = "100%";
    labelWelcome.textContent = `Welcome, ${currentAccount.owner
      .split(" ")
      .at(0)}`;
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener("click", function (event) {
  event.preventDefault();

  const intendedAccount = accounts.find(
    account => account.username === inputTransferTo.value
  );
  console.log(intendedAccount);

  const sendedAmount = Number(inputTransferAmount.value);
  console.log(sendedAmount);

  if (
    sendedAmount > 0 &&
    sendedAmount <= currentAccount.balance &&
    intendedAccount &&
    intendedAccount.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-sendedAmount);
    intendedAccount.movements.push(sendedAmount);
    inputTransferTo.value = inputTransferAmount.value = "";
    inputTransferAmount.blur();
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener("click", function (event) {
  event.preventDefault();

  const loanAmount = Number(inputLoanAmount.value);
  const hasTenPercentFromTheLoan = currentAccount.movements.some(
    movement => movement >= loanAmount * 0.1
  );

  if (loanAmount > 0 && hasTenPercentFromTheLoan) {
    currentAccount.movements.push(loanAmount);
    inputLoanAmount.value = "";
    inputLoanAmount.blur();
    updateUI(currentAccount);
  }
});

btnClose.addEventListener("click", function (event) {
  event.preventDefault();
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      account => account.username === currentAccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    inputCloseUsername.value = inputClosePin.value = "";
    labelWelcome.textContent = "Log in to get started";
  }
});

let isSorted = false;

btnSort.addEventListener("click", function (event) {
  event.preventDefault();
  displayMovements(currentAccount.movements, !isSorted);
  isSorted = !isSorted;
});
