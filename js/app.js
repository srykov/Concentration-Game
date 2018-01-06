/*
 * Create a list that holds all of your cards
 */
 const cardSet = ['fa-diamond', 'fa-diamond', 'fa-leaf', 'fa-leaf', 'fa-bicycle', 'fa-bicycle', 'fa-bolt', 'fa-bolt', 'fa-bomb', 'fa-bomb', 'fa-anchor', 'fa-anchor', 'fa-cube', 'fa-cube', 'fa-paper-plane-o', 'fa-paper-plane-o'];

 let numMoves = 0;


document.addEventListener('DOMContentLoaded', initializeGame);


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function displayCards(){
	shuffle(cardSet);

	const deck = document.querySelector('.deck');
	const cards = deck.querySelectorAll('.card');

	for(let i = 0; i < cards.length; i++){

		cards[i].classList.remove('show', 'open', 'match');
		const icon = cards[i].querySelector('i');
		icon.classList.add(deck[i]);
	}
	deck.addEventListener('click', handleClickCard);

}

function incrementMoveCounter(){
	numMoves++;
	const moves = document.querySelector('.moves');
	moves.textContent = numMoves;
}

function resetMoveCounter(){
	numMoves = 0;
	const moves = document.querySelector('.moves');
	moves.textContent = numMoves;
}

function initializeGame(){

	resetMoveCounter();

	displayCards();
	const resetButton = document.querySelector('.fa-repeat');
	resetButton.addEventListener('click', handleReset);
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

function handleClickCard(event){
	//increment the number of moves
	incrementMoveCounter();

	const card = event.target;
	card.classList.add('open', 'show');
}

function handleReset(event){

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
