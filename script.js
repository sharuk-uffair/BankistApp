'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
	owner: 'Virat Kohli',
	movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
	interestRate: 1.2, // %
	pin: 1111,
	movementsDates: [
		'2019-11-18T21:31:17.178Z',
		'2019-12-23T07:42:02.383Z',
		'2020-01-28T09:15:04.904Z',
		'2020-04-01T10:17:24.185Z',
		'2020-05-08T14:11:59.604Z',
		'2020-05-27T17:01:17.194Z',
		'2020-07-11T23:36:17.929Z',
		'2020-07-12T10:51:36.790Z',
	]
};

const account2 = {
	owner: 'MS Dhoni',
	movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
	interestRate: 1.5,
	pin: 2222,

	movementsDates: [
		'2019-11-01T13:15:33.035Z',
		'2019-11-30T09:48:16.867Z',
		'2019-12-25T06:04:23.907Z',
		'2020-01-25T14:18:46.235Z',
		'2020-02-05T16:33:06.386Z',
		'2020-04-10T14:43:26.374Z',
		'2020-06-25T18:49:59.371Z',
		'2020-07-26T12:01:20.894Z',
	]
};

const account3 = {
	owner: 'Suresh Raina',
	movements: [200, -200, 340, -300, -20, 50, 400, -460],
	interestRate: 0.7,
	pin: 3333,
	movementsDates: [
		'2019-11-01T13:15:33.035Z',
		'2019-11-30T09:48:16.867Z',
		'2019-12-25T06:04:23.907Z',
		'2020-01-25T14:18:46.235Z',
		'2020-02-05T16:33:06.386Z',
		'2020-04-10T14:43:26.374Z',
		'2020-06-25T18:49:59.371Z',
		'2020-07-26T12:01:20.894Z',
	]
};

const account4 = {
	owner: 'Rohit Sharma',
	movements: [430, 1000, 700, 50, 90],
	interestRate: 1,
	pin: 4444,
	movementsDates: [
		'2019-11-01T13:15:33.035Z',
		'2019-11-30T09:48:16.867Z',
		'2019-12-25T06:04:23.907Z',
		'2020-01-25T14:18:46.235Z',
		'2020-02-05T16:33:06.386Z',
		'2020-04-10T14:43:26.374Z',
		'2020-06-25T18:49:59.371Z',
		'2020-07-26T12:01:20.894Z',
	]
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const movementsDates = document.querySelector('.movements__date');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovement = function (acc, sort = false) {

	// empty the movement container first
	containerMovements.innerHTML = '';

	const movs = sort ? acc.movements.slice().sort((a, b) => (a > b ? 1 : -1)) : acc.movements;
	movs.forEach(function (mov, i) {
		const type = mov > 0 ? 'deposit' : 'withdrawal';

		// Date
		const date = new Date(acc.movementsDates[i]);
		const day = `${date.getDate()}`.padStart(2, 0);
		const month = `${date.getMonth() + 1}`.padStart(2, 0);
		const year = date.getFullYear();
		const displayDate = `${day}/${month}/${year}`;

		const formattedMov = new Intl.NumberFormat('en-US').format(mov);
		const html = ` 
        <div class = "movements__row" >
          <div class = "movements__type movements__type--${type}" >${i+1} ${type}</div>
          <div class = "movements__date">${displayDate}</div>
          <div class = "movements__value" >${formattedMov}₹</div>
        </div>
    `;
		containerMovements.insertAdjacentHTML('afterbegin', html);
	});
}


// Display current balnce
const calcDisplayBalance = function (acc) {
	const balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
	acc.balance = balance;
	const formattedMov = new Intl.NumberFormat('en-US').format(acc.balance);
	labelBalance.textContent = `${formattedMov}₹`;
}


// Display balance summary
const calcDisplaySummary = function (acc) {
	const income = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
	const formattedIncome = new Intl.NumberFormat('en-US').format(income);
	labelSumIn.textContent = `${formattedIncome}₹`;
	const out = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
	const formattedOut = new Intl.NumberFormat('en-US').format(Math.abs(out));
	labelSumOut.textContent = `${formattedOut}₹`;
	const interest = acc.movements.filter(mov => mov > 0).map(deposit => deposit * acc.interestRate / 100).filter(mov => mov >= 1).reduce((acc, mov) => acc + mov, 0);
	const formattedInterest = new Intl.NumberFormat('en-US').format(interest);
	labelSumInterest.textContent = `${formattedInterest}₹`;
}


// creating usernames
const createUsernames = function (acts) {
	acts.forEach(function (acts) {
		acts.username = acts.owner.toLowerCase().split(' ').map(function (name) {
			return name[0];
		}).join('');
	});
}
createUsernames(accounts);

const updateUI = function (acc) {
	// display movements
	displayMovement(acc);
	// display balance
	calcDisplayBalance(acc);
	// display summay
	calcDisplaySummary(acc);
}

// Logout Timer function

const startLogOutTimer = function () {
	let time = 300;
	const tick = function () {
		const min = String(Math.trunc(time / 60)).padStart(2, 0);
		const sec = String(time % 60).padStart(2, 0);
		labelTimer.textContent = `${min}:${sec}`;
		if (time === 0) {
			clearInterval(timer);
			containerApp.style.opacity = 0;
			labelWelcome.textContent = `Time out Login again!`;
		}
		time--;
	}
	tick();
	const timer = setInterval(tick, 1000);
	return timer;
}


// Events handeler
let currentAccount, timer;
// Experimenting with dates

// Login functionality
btnLogin.addEventListener('click', function (e) {
	e.preventDefault();
	// Timer
	if (timer)
		clearInterval(timer);
	timer = startLogOutTimer();


	currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
	if (currentAccount.pin === Number(inputLoginPin.value)) {
		// display UI and mesage
		labelWelcome.textContent = `Welcome back ${currentAccount.owner.split(' ')[0]}`;
		containerApp.style.opacity = 100;

		// currentDate  format=day/month/year
		const now = new Date();
		const local = navigator.language;
		const options = {
			hour: 'numeric',
			minute: 'numeric',
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			weekday: 'long'
		}
		labelDate.textContent = new Intl.DateTimeFormat(local, options).format(now);
		// update UI
		updateUI(currentAccount);
	}
});

// Transfer funcitonality
btnTransfer.addEventListener('click', function (e) {
	e.preventDefault();
	const amount = Number(inputTransferAmount.value);
	const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
	// clear the input field
	inputTransferAmount.value = '';
	inputTransferTo.value = '';
	if (amount > 0 && currentAccount.balance >= amount && receiverAcc.username !== currentAccount.username) {
		// doing the transfer
		currentAccount.movements.push(-amount);
		receiverAcc.movements.push(amount);
		// Add date to transfer
		currentAccount.movementsDates.push(new Date());
		receiverAcc.movementsDates.push(new Date());
		// update UI
		updateUI(currentAccount);
	}
	// Reset the timer
	clearInterval(timer);
	timer = startLogOutTimer();
});

// Loan Request functionality
btnLoan.addEventListener('click', function (e) {
	e.preventDefault();
	const amount = Math.floor(inputLoanAmount.value);
	if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
		setTimeout(() => {
			currentAccount.movements.push(amount);
			currentAccount.movementsDates.push(new Date());
			// update UI
			updateUI(currentAccount);
		}, 3000);
	}
	inputLoanAmount.value = '';
	// Reset the timer
	clearInterval(timer);
	timer = startLogOutTimer();
});

// Closing account functionality
btnClose.addEventListener('click', function (e) {
	e.preventDefault();

	if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
		const index = accounts.findIndex(acc => acc.username === currentAccount.username);
		// delete account
		accounts.splice(index, 1);
		// hide UI and show deletion message
		containerApp.style.opacity = 0;
		labelWelcome.textContent = `Your Account deleted successfully!.`;
	}
	// clear the input field
	inputCloseUsername.value = '';
	inputClosePin.value = '';
});

let sortedState = false
btnSort.addEventListener('click', function (e) {
	e.preventDefault();
	displayMovement(currentAccount, !sortedState);
	sortedState = !sortedState;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////