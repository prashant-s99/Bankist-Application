'use strict';

// BANKIST APP

///////////////////////////////////////////////////////////////////////////////////////////////

// Data
const account1 = {
  owner: 'Prashant Sengar',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2,
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
  ],
  currency: 'INR',
  locale: 'en-IN', // de-DE
};

const account2 = {
  owner: 'Sanyog Rathore',
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
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];


///////////////////////////////////////////////////////////////////////////////////////////////


// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');
const labelLoginError = document.querySelector('.error_message');
const labelLoanAmountError = document.querySelector('.form__label--loan--error');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

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

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);


// Extracting initials from Owner Name of accounts.
const createUsernames = function(accts){
  accts.forEach(function(acc){
    acc.username=acc.owner.toLowerCase().split(" ").map( name => name[0]).join('');
  })
  };
  
  createUsernames(accounts);
// Login Account Logic

let currentAccount;
let deposits;
let withdrawals;
let timer;


//Updating UI
const updateUI = function(acc){
  displayMovements(acc);
  calcDisplaySummary(acc);
  calcDisplayBalance(acc);
};


// Login Functionality
btnLogin.addEventListener('click', function(event){
  //Prevent form from submiting.
  event.preventDefault();
  
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

  if(currentAccount?.pin === +(inputLoginPin.value)){
    if(timer) clearInterval(timer)
    timer = startLogoutTimer(); //Auto Logout function.
    labelWelcome.textContent = Welcome back ${currentAccount.owner.split(" ")[0]}!;
    labelDate.textContent= displayDateTime(new Date(), currentAccount.locale);
    containerApp.style.opacity = 100;

    // Deposits and Withdrawl
    deposits= currentAccount.movements.filter(mov => mov>0 );
    withdrawals = currentAccount.movements.filter(mov => mov<0 );
    //Other Functions
    updateUI(currentAccount);

    labelLoginError.style.opacity= 0;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); //Removes blinking cursor in PIN field in Application.

  }
  else
    {
      containerApp.style.opacity = 0;
      labelLoginError.style.opacity= 100;
    }
});


//Displaying Date Time of Login and Movements of Transaction
  const displayDateTime =  (dateTime, locale) =>{
  const dateTimeFormat={
    hour : 'numeric',
    minute : 'numeric',
    day : 'numeric',
    month : 'numeric',
    year : 'numeric',
  };
  return new Intl.DateTimeFormat(locale,dateTimeFormat).format(dateTime);
}


// Displaying each movements in containerMovements.
const displayMovements = function(acc, sort=false){

  //Sorting logic for movements.
  const movs = sort ? acc.movements.slice().sort((a,b) => a-b) : acc.movements;

  //Displaying movements. 
  containerMovements.innerHTML= '' ;
  movs.forEach( (mov, i)=> {
    
    

    const transferType = mov > 0 ? 'deposit' : 'withdrawal'
    const insertMovementHTML = `
          <div class="movements__row">
            <div class="movements_type movements_type--${transferType}">${i+1}  ${transferType}</div>
            <div class="movements__date">${displayDateTime(new Date(acc.movementsDates[i]), acc.locale) || new Date()}</div>
            <div class="movements__value">${formattedAmount(mov)}</div>
          </div>`;
    containerMovements.insertAdjacentHTML('afterbegin',insertMovementHTML);
  });

};


// Displaying sum of total Deposit(In) and Withrawal(Out).
const calcDisplaySummary = function(acc){
  const totalIn =deposits.reduce((accu, movement)=>
  {
  return (accu+movement);
  },0)
  labelSumIn.textContent = ${formattedAmount(totalIn.toFixed(2))};
  
  const totalOut =withdrawals.reduce((accu, movement)=> {
    return (accu+movement);
  },0)
  labelSumOut.textContent = ${formattedAmount(Math.abs(totalOut).toFixed(2))};
  const totalInterest = (totalIn * acc.interestRate)/100;
  labelSumInterest.textContent= ${formattedAmount(totalInterest.toFixed(2))}
};


// Displaying Current Balance.
const calcDisplayBalance= function(acc){
   acc.balance = acc.movements.reduce((accu, mov, i, arr) => {
      return (accu+mov);
    }
  ,0);

  labelBalance.textContent = ${formattedAmount(acc.balance.toFixed(2))}
};


// Money Transfer to different account Logic.

btnTransfer.addEventListener('click', function(e){
  e.preventDefault();
  const amount = +(inputTransferAmount.value);
  const receiverAcc =inputTransferTo.value;
  if(amount <= currentAccount.balance && amount > 0 && receiverAcc && receiverAcc.username !== currentAccount.username){
  const transferToAccount = accounts.find(acc => acc.username === receiverAcc);
  currentAccount.movements.push(-amount);
  transferToAccount.movements.push(amount);
  currentAccount.movementsDates.push(new Date().toISOString()); //Adding movement date to Sender's Account
  transferToAccount.movementsDates.push(new Date().toISOString()); //Adding movement date to Receiver's Account

  updateUI(currentAccount);

  }
  inputTransferTo.value = inputTransferAmount.value ='';

  //Resetting Timer
  clearInterval(timer);
  timer=startLogoutTimer();

});


// Deleting user account.

btnClose.addEventListener('click', function(e){
  e.preventDefault();
  
  //Delete Account
  if(currentAccount.username === inputCloseUsername.value && currentAccount.pin === +(inputClosePin.value))
  {
    inputCloseUsername.value= inputClosePin.value ='';
    const indexOfCurrentUser = accounts.findIndex( function(acc) {
      return (acc.username === currentAccount.username);
    });
    accounts.splice(indexOfCurrentUser,1)};

    //Hiding UI
    containerApp.style.opacity = 0;
});


// Loan Request

btnLoan.addEventListener('click',function(e){
  e.preventDefault();
  labelLoanAmountError.style.opacity = 0;
  const amount= Math.floor(inputLoanAmount.value);
  if(amount>0 && deposits.some( dep => dep >= 0.1*amount))
  {
    labelLoanAmountError.textContent = Amount has been added.;
    labelLoanAmountError.style.color = 'black';
    labelLoanAmountError.style.opacity = 100;
    currentAccount.movements.push(amount); //Add movement
    currentAccount.movementsDates.push(new Date().toISOString()); //Adding movement date
  }
  else{
  labelLoanAmountError.textContent = Invalid Amount Requested;
  labelLoanAmountError.style.opacity = 100;
  }
  
  //Update UI
  updateUI(currentAccount);
  inputLoanAmount.value ='';

  //Resetting Timer
  clearInterval(timer);
  timer=startLogoutTimer();

});


// Sorting Functionality
let sorted = false;
btnSort.addEventListener('click',function(e){
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});


// Formatting Currency Amount using Internationalization

const formattedAmount = amount =>  ( new Intl.NumberFormat(currentAccount.locale, {
  style : 'currency',
  currency : currentAccount.currency,
}).format(amount));


// Auto Logout Timer Functionality
const startLogoutTimer = ()=>{
  let time = 300;
  const tick = function (){
    const min= String(Math.trunc(time/60)).padStart(2, 0);
    const sec = String(time%60).padStart(2,0);
    labelTimer.textContent= ${min}:${sec};

    if(time===0){
      clearInterval(timer);
      labelBalance.textContent = Log in to get started;
      containerApp.style.opacity = 0;
    }

    time--;
  }
  tick();
  timer = setInterval(tick,1000);

  return timer;
};



// currentAccount = account1;
// deposits= currentAccount.movements.filter(mov => mov>0 );
// withdrawals = currentAccount.movements.filter(mov => mov<0 );
// updateUI(currentAccount);
// containerApp.style.opacity = 100;



// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];