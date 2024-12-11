// script.js - Updated
'use strict';

// Selecting elements
const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');
const score0El = document.querySelector('#score--0');
const score1El = document.getElementById('score--1');
const current0El = document.getElementById('current--0');
const current1El = document.getElementById('current--1');

const diceEl = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');

// Adding timer elements dynamically for both players
player0El.insertAdjacentHTML(
  'afterbegin',
  '<div class="timer" id="timer--0">10s</div>'
);
player1El.insertAdjacentHTML(
  'afterbegin',
  '<div class="timer" id="timer--1">10s</div>'
);

let scores, currentScore, activePlayer, playing;
let playerTimers = [10, 10]; // Timers for both players in seconds
let timerInterval;

// Function to update the timer display
const updateTimerDisplay = function () {
  document.getElementById('timer--0').textContent = `${playerTimers[0]}s`;
  document.getElementById('timer--1').textContent = `${playerTimers[1]}s`;
};

// Timer countdown function
const startTimer = function () {
  clearInterval(timerInterval); // Clear any existing timer

  timerInterval = setInterval(() => {
    if (playerTimers[activePlayer] > 0 && playing) {
      playerTimers[activePlayer]--;
      updateTimerDisplay();
    } else if (playerTimers[activePlayer] === 0) {
      finishGame(); // End game if timer reaches zero
      clearInterval(timerInterval);
    }
  }, 1000);
};

// Function to reset timers
const resetTimers = function () {
  playerTimers = [10, 10];
  updateTimerDisplay();
};

// Function to handle the end of the game and display winner modal
const finishGame = function () {
  playing = false;
  clearInterval(timerInterval);
  diceEl.classList.add('hidden');
  const winner = scores[0] > scores[1] ? 0 : scores[0] < scores[1] ? 1 : -1;
  if (winner !== -1) {
    showWinner(`Player ${winner + 1} Wins!`);
  } else {
    showWinner("It's a tie!");
  }
};

// Function to show the winner overlay
function showWinner(player) {
  document.getElementById('winner-text').textContent = `${player}`;
  document.getElementById('winner-overlay').classList.remove('hidden');
  startConfetti();
}

// Confetti function using the "party.js" library
function startConfetti() {
  // Start confetti from the bottom of the screen
  party.confetti(document.body, {
    count: 150,
    spread: 70,
    angle: -90, // Upwards
    size: 1.5,
    colors: ['#ff5e5e', '#ffb400', '#28a745', '#17a2b8'],
  });

  // Optional: Stop the confetti after 3 seconds
  setTimeout(() => {
    party.clear(document.body);
  }, 3000);
}

// Starting conditions
const init = function () {
  scores = [0, 0];
  currentScore = 0;
  activePlayer = 0;
  playing = true;

  score0El.textContent = 0;
  score1El.textContent = 0;
  current0El.textContent = 0;
  current1El.textContent = 0;

  diceEl.classList.add('hidden');
  player0El.classList.remove('player--winner');
  player1El.classList.remove('player--winner');
  player0El.classList.add('player--active');
  player1El.classList.remove('player--active');

  resetTimers();
  startTimer();

  document.getElementById('winner-overlay').classList.add('hidden');
};
init();

// Switch player functionality
const switchPlayer = function () {
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  currentScore = 0;
  activePlayer = activePlayer === 0 ? 1 : 0;
  player0El.classList.toggle('player--active');
  player1El.classList.toggle('player--active');

  startTimer();
};

// Event listeners
btnRoll.addEventListener('click', function () {
  if (playing) {
    const dice = Math.trunc(Math.random() * 6) + 1;

    diceEl.classList.remove('hidden');
    diceEl.src = `dice-${dice}.png`;

    if (dice !== 1) {
      currentScore += dice;
      document.getElementById(`current--${activePlayer}`).textContent =
        currentScore;
    } else {
      switchPlayer();
    }
  }
});

btnHold.addEventListener('click', function () {
  if (playing) {
    scores[activePlayer] += currentScore;
    document.getElementById(`score--${activePlayer}`).textContent =
      scores[activePlayer];
  }
});

btnNew.addEventListener('click', function () {
  init();
  resetTimers();
});
document.getElementById('winner-text').textContent = `${player} Wins!`;
