/*
 * Create a list that holds all of your cards
 */
 const deck = ['fa-diamond', 'fa-diamond', 'fa-leaf', 'fa-leaf', 'fa-bicycle', 'fa-bicycle', 'fa-bolt', 'fa-bolt', 'fa-bomb', 'fa-bomb', 'fa-anchor', 'fa-anchor', 'fa-cube', 'fa-cube', 'fa-paper-plane-o', 'fa-paper-plane-o'];

 let openCards = [];

 let numMoves = 0;


document.addEventListener('DOMContentLoaded', initializeGame);

/*
 * Perform all of the tasks necessary to initialize a new game.
 */
function initializeGame(){

	resetMoveCounter();

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

		const icon = document.createElement('i');
		icon.classList.add('fa', deck[i]);
		cards[i].appendChild(icon);
	}
	deckDiv.addEventListener('click', handleClickCard);

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
 * Flip card over.
 */
function flipCard(card){
	card.classList.toggle('open');
	card.classList.toggle('show');
}

function addToOpenCards(card){

	//even number of cards in the open state, means its our first flip, push current card into the list
	if(openCards.length % 2 == 0){
		openCards.push(card);
	}
	//odd number of cards already in the open state, means its our second flip, and we are looking for a match
	else{
		if(isMatch(card)){

		} else{
			makeMatchFail(card);
		}

	}
}

/*
 * Perform actions require on match success.
 */
function makeMatch(card){
	card.classList.add('match');
	openCards.push(card);
}

/*
 * Perform actions require  on match failure.
 */
function makeMatchFail(card){
	//add a delay to allow user to see the cards
	setTimeout(function(){
		//remove last card from open cards stack
		const lastCard = openCards.pop();

		// flip cards back over
		flipCard(card);
		flipCard(lastCard);
	}, 1000);
}


function isMatch(card){

	let match = false;

	//get the icon for this card
	const iconToMatch = card.querySelector('i').classList.item(1);

	//iterate over the list of open cards and check for a match
	for(let i = 0; i < openCards.length; i++){
		const currentIcon = openCards[i].querySelector('i').classList.item(1);

		if(iconToMatch === currentIcon){
			match = true;
			openCards[i].classList.add('match');
			break;
		}
	}
	return match;
}

/*
 * Handle click event on a card.
 */
function handleClickCard(event){

	if(event.target.nodeName.toLowerCase() == 'li'){
		const card = event.target;

		if(!card.classList.contains('open')){
			//increment the number of moves
			incrementMoveCounter();

			flipCard(event.target);
			addToOpenCards(event.target);
		}
	}

}

/*
 * Handle click event on the reset button
 */
function handleReset(event){
	endGame();
	initializeGame();
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
