class Card {
    constructor(name, img) {
        this.name = name;
        this.img = img;
        this.isFlipped = false;
        this.element = this.#createCardElement();
    }

    #createCardElement() {
        const cardElement = document.createElement("div");
        cardElement.classList.add("cell");
        cardElement.innerHTML = `
          <div class="card" data-name="${this.name}">
              <div class="card-inner">
                  <div class="card-front"></div>
                  <div class="card-back">
                      <img src="${this.img}" alt="${this.name}">
                  </div>
              </div>
          </div>
      `;
        return cardElement;
    }

    #flip() {
        const cardElement = this.element.querySelector(".card");
        cardElement.classList.add("flipped");
    }

    #unflip() {
        const cardElement = this.element.querySelector(".card");
        cardElement.classList.remove("flipped");
    }
    // Definir el método `toggleFlip()` que cambia el estado de volteo de la carta en función de su estado actual.
    toggleFlip(){
       if(this.isFlipped){
        this.#unflip()
        this.isFlipped=false;
       }else{
        this.#flip()
        this.isFlipped=true;
       }
    //    console.log("Cambiando estado de volteo ",this.isFlipped)
    };
    matches(otherCard){
        return this.name===otherCard.name;
    }
}

class Board {
    constructor(cards) {
        this.cards = cards;
        this.fixedGridElement = document.querySelector(".fixed-grid");
        this.gameBoardElement = document.getElementById("game-board");
    }

    #calculateColumns() {
        const numCards = this.cards.length;
        let columns = Math.floor(numCards / 2);

        columns = Math.max(2, Math.min(columns, 12));

        if (columns % 2 !== 0) {
            columns = columns === 11 ? 12 : columns - 1;
        }

        return columns;
    }

    #setGridColumns() {
        const columns = this.#calculateColumns();
        this.fixedGridElement.className = `fixed-grid has-${columns}-cols`;
    }

    render() {
        this.#setGridColumns();
        this.gameBoardElement.innerHTML = "";
        this.cards.forEach((card) => {
            card.element
                .querySelector(".card")
                .addEventListener("click", () => this.onCardClicked(card));
            this.gameBoardElement.appendChild(card.element);
        });
    }

    onCardClicked(card) {
        if (this.onCardClick) {
            this.onCardClick(card);
        }
    }
    shuffleCards(){
        let max=11;
        let min=0;
        const newCards=[]
        let conjunto=new Set()
        let numero=0;
        //guardamos un numero aleatorio al un array tipo set, hasta tener un tamaño 12
        while(conjunto.size<12){
            numero=Math.floor(Math.random() * (max - min + 1) + min);
            conjunto.add(numero)
        }
        // console.log(conjunto)
        conjunto.forEach(numero => {
            newCards.push(this.cards[numero])  
        });
        this.cards=newCards;
        this.render()
        // console.log("Mezclando cartas....",this.cards)
    }
    reset(){
        this.flipDownAllCards()
        this.shuffleCards();
        this.render();
    }
    flipDownAllCards(){
        this.cards.forEach(carta => {
            carta.toggleFlip()
        });
    };
}

class MemoryGame {
    constructor(board, flipDuration = 500) {
        this.board = board;
        this.flippedCards = [];
        this.matchedCards = [];
        if (flipDuration < 350 || isNaN(flipDuration) || flipDuration > 3000) {
            flipDuration = 350;
            alert(
                "La duración de la animación debe estar entre 350 y 3000 ms, se ha establecido a 350 ms"
            );
        }
        this.flipDuration = flipDuration;
        this.board.onCardClick = this.#handleCardClick.bind(this);
        this.board.reset();
    }

    #handleCardClick(card) {
        if (this.flippedCards.length < 2 && !card.isFlipped) {
            card.toggleFlip();
            this.flippedCards.push(card);//[Card, Card]

            if (this.flippedCards.length === 2) {
                setTimeout(() => this.checkForMatch(), this.flipDuration);
            }
        }
    }
    checkForMatch(){
        if (this.flippedCards.length === 2) {
            if (this.flippedCards[0].matches(this.flippedCards[1])) {
                this.matchedCards.push(this.flippedCards);
                this.flippedCards = [];
            } else {
                setTimeout(() => {
                    this.flippedCards.forEach(card => card.toggleFlip());
                    this.flippedCards = [];
                }, this.flipDuration);
            }
        }
    }
    // - Implementar el método `resetGame()` que reinicia el juego. 
    // Debe emplear otros métodos de la clase `MemoryGame` para realizar esta tarea.
    resetGame(){
        this.flippedCards = [];
        this.matchedCards = [];
        this.board.reset()
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const cardsData = [
        { name: "Python", img: "./img/Python.svg" },
        { name: "JavaScript", img: "./img/JS.svg" },
        { name: "Java", img: "./img/Java.svg" },
        { name: "CSharp", img: "./img/CSharp.svg" },
        { name: "Go", img: "./img/Go.svg" },
        { name: "Ruby", img: "./img/Ruby.svg" },
    ];

    const cards = cardsData.flatMap((data) => [
        new Card(data.name, data.img),
        new Card(data.name, data.img),
    ]);
    const board = new Board(cards);
    const memoryGame = new MemoryGame(board, 1000);

    document.getElementById("restart-button").addEventListener("click", () => {
        memoryGame.resetGame();
    });
});
