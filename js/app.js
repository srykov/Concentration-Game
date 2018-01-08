/*
 * Create a list that holds all of the cards
 */
 const deck = ['fa-diamond', 'fa-diamond', 'fa-leaf', 'fa-leaf', 'fa-bicycle', 'fa-bicycle', 'fa-bolt', 'fa-bolt', 'fa-bomb', 'fa-bomb', 'fa-anchor', 'fa-anchor', 'fa-cube', 'fa-cube', 'fa-paper-plane-o', 'fa-paper-plane-o'];

 let openCards = [];
 let numMoves = 0;
 let numMatches = 0;
 let stars = 3;

 let gameStartTime;
 let formattedElapsedTime = "";
 let timerIntervalId = 0;

document.addEventListener('DOMContentLoaded', initializeGame);

/*
 * Perform all of the tasks necessary to initialize a new game.
 */
function initializeGame(){

	resetMoveCounter();
	numMatches = 0;
	numStars = 3;
	gameStartTime = new Date();

	const scorePanel = document.querySelector('.score-panel');
	calculateAndDisplayStars(scorePanel);
	displayCards();

	const resetButton = document.querySelector('.fa-repeat');
	resetButton.addEventListener('click', handleReset);
}

/*
 * Perform all of the tasks necessary to end the game.
 */
function endGame(){
	const deckDiv = document.querySelector('.deck');
	const cards = deckDiv.querySelectorAll('.card');
	openCards = [];

	for(let i = 0; i < cards.length; i++){
		const icon = cards[i].querySelector('i');
		cards[i].removeChild(icon);
	}

	//clear the timer display
	const timer = document.querySelector('.timer');
	timer.textContent = '';

	const resetButton = document.querySelector('.fa-repeat');
	resetButton.removeEventListener('click', handleReset);
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function displayCards(){
	shuffle(deck);

	const deckDiv = document.querySelector('.deck');
	const cards = deckDiv.querySelectorAll('.card');

	for(let i = 0; i < cards.length; i++){

		cards[i].classList.remove('show', 'open', 'match');

		const newIcon = document.createElement('i');
		newIcon.classList.add('fa', deck[i]);
		cards[i].appendChild(newIcon);
	}
	deckDiv.addEventListener('click', handleClickCard);

}

/*
 * Calculate the number of stars that the player has, update the score panel.
 */
function calculateAndDisplayStars(container){

	//assign number of stars based on thresholds for number of moves made
	if(numMoves < 30){
		numStars = 3;
	} else if (numMoves < 36) {
		numStars = 2;
	} else if (numMoves < 42){
		numStars = 1;
	} else {
		numStars = 0;
	}

	//update the display of the number of stars
	const stars = container.querySelector('.stars');
	const starsListElements = stars.querySelectorAll('li');
	const maxNumberOfPossibleStars = 3;
	for(let i = 0; i < maxNumberOfPossibleStars; i++){
		//start from last star tag, and work backwards towards the first star
		const starTag = starsListElements[(maxNumberOfPossibleStars - i) - 1].querySelector('i');
		//user gets this star
		if(numStars >= (maxNumberOfPossibleStars -i)){
			starTag.classList.add('fa-star');
			starTag.classList.remove('fa-star-o');
		} //user doesn't get this star
		else{
			starTag.classList.remove('fa-star');
			starTag.classList.add('fa-star-o');
		}
	}
}


/*
 * Increment the moves counter by one and display it on the page.
 */
function incrementMoveCounter(){
	numMoves++;
	const moves = document.querySelector('.moves');
	moves.textContent = numMoves;
}

/*
 * Reset the moves counter to zero and display it on the page.
 */
function resetMoveCounter(){
	numMoves = 0;
	const moves = document.querySelector('.moves');
	moves.textContent = numMoves;
}


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * Handle click event on a card.
 *
 */
function handleClickCard(event){

	//only handle click events on cards
	if(event.target.nodeName.toLowerCase() == 'li'){
		const card = event.target;

		if(numMoves == 0){
			startTimer();
		}

		//only handle click events on face *down* cards
		if(!card.classList.contains('open')){

			//display the card's symbol
			flipCard(event.target);

			//add the card to a list of open cards
			addToOpenCards(event.target);

			if(openCards.length %2 == 0){

				const currentCard = openCards[openCards.length - 1];
				const previousCard = openCards[openCards.length - 2];

				//there is an even nuber of cards on the open cards stack, so check for a match
				if(isMatch(currentCard, previousCard)){
					//mark cards as matched & lock in open position
					makeMatch(currentCard, previousCard);
				} else{
					//no match, after a delay (to allow user to see the cards),
					//flip cards back over & remove from list
					matchFail(currentCard, previousCard);
				}
			}
			//increment the move counter and display it on the page
			incrementMoveCounter();
			const scorePanel = document.querySelector('.score-panel');
			calculateAndDisplayStars(scorePanel);

			//TODO: if all cards have matched, display a message with the final score
		}

		if(numMatches == 8){
			winGame();
		}
	}

}

/*
 * Start the timer, by recording the time that the game starts,
 * and starting the regular updates of the timer display.
 */
function startTimer(){
	gameStartTime = Date.now();
	const timer = document.querySelector('.timer');
	timer.textContent = 'Elapsed Time: ';
	const time = document.createElement('span');
	time.classList.add('time');
	timer.appendChild(time);

	timerIntervalId = setInterval(setElapsedTime, 1000);
}

/*
 * Set the elapsed time, and then stop the timer.
 */
function stopTimer(){
	clearInterval(timerIntervalId);
	setElapsedTime();
}

/*
 * Calculate the elapsed time and update the display of the timer.
 */
function setElapsedTime(){
	const now = Date.now();
	const elapsedTimeMillis = now - gameStartTime;

	const hours = Math.floor(elapsedTimeMillis/3600000);
	const mins = Math.floor(elapsedTimeMillis/60000 % 360);
	const seconds = Math.floor(elapsedTimeMillis/1000 % 60);

	const formattedHours = (hours == 0 ? '': hours +  (hours == 1? ' hour, ': ' hours, '));
	const formattedMins = (mins == 0 ? '': mins + (mins == 1? ' minute, ': ' minutes, '))
	const formattedSeconds = seconds + (seconds == 1? ' second': ' seconds') ;

	formattedElapsedTime = formattedHours + formattedMins + formattedSeconds;

	const time = document.querySelector('.time');
	time.textContent =  formattedElapsedTime;
}
/*
 * Stop timer, open modal, play sound, and end game.
 */
function winGame(){
	stopTimer();
	setTimeout(function(){
		displayWinnerModal();
		playSound('win');
	}, 1000);
	setTimeout(function(){
		endGame();
	},2500);
}


/*
 * Display a modal to announce that the user has won the game. Display
 * game stats.
 */
function displayWinnerModal(){
	const modal = document.getElementById('winnerModal');
	modal.style.display = 'block';

	const totalTime = document.querySelector('.totalTime');
	totalTime.textContent = `You finished the game in ${formattedElapsedTime}`;

	const totalMoves = document.querySelector('.totalMoves');
	totalMoves.textContent = `You made ${numMoves} moves`;

	const finalStarRating = document.querySelector('.finalStarRating');
	if(numStars > 0){
		finalStarRating.textContent = `Your rating is ${numStars} star${numStars == 1? '':'s'}`;
		calculateAndDisplayStars(modal);
	} else{
		finalStarRating.textContent = '';
	}

	const closeButton = document.querySelector('.close');
	closeButton.addEventListener('click', closeWinnerModal);
	document.addEventListener('keypress', closeWinnerModal);
}

/*
 * Close the winner modal and re-initialize the game.
 */
function closeWinnerModal(){
	const modal = document.getElementById('winnerModal');
	modal.style.display = 'none';
	initializeGame();
}

/*
 * Flip card over. If the card was previously face down, display the cards symbol, and vice versa.
 */
function flipCard(card){
	playSound('flip');
	card.classList.toggle('open');
	card.classList.toggle('show');
}

/*
 * Push card onto stack of open cards.
 */
function addToOpenCards(card){
	openCards.push(card);
}

/*
 * Check to see if the last two cards on the open cards stack are a match.
 */
function isMatch(currentCard, previousCard){

	let matchFound = false;

	//get the symbols for the last two cards, so we can compare them
	const currentSymbol = currentCard.querySelector('i').classList.item(1);
	const previousSymbol = previousCard.querySelector('i').classList.item(1);

	if(currentSymbol === previousSymbol){
		matchFound = true;
	}
	return matchFound;
}

/*
 * Perform actions required on match success.
 */
function makeMatch(currentCard, previousCard){
	currentCard.classList.add('match');
	previousCard.classList.add('match');
	numMatches++;
	setTimeout(function(){
		playSound('match');
	}, 1000);
}

/*
 * Perform actions required on match failure.
 */
function matchFail(currentCard, previousCard){

	setTimeout(function(){
		// flip cards back over
		flipCard(currentCard);
		flipCard(previousCard);

		//take the last two cards off the stack
		openCards.pop();
		openCards.pop();
	}, 1000);
}

/*
 * Play a sound, given an action.
 *
 */
  function playSound(action) {
    const audio = document.querySelector(`audio[data-key="${action}"]`);
    if (!audio) return;

    audio.currentTime = 0;
    audio.play();
  }

/*
 * Handle click event on the reset button
 */
function handleReset(event){
	endGame();
	initializeGame();
}