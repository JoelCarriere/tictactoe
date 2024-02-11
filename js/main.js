function gameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    //We need a board, this can be created by looping through each row and adding
    //a cell for each column position
    for (let i=0; i<rows; i++) {
        board[i] = [];
        for (let j=0; j<columns; j++) {
            board[i].push(cell());
        }
    }

    //We need a function to pull the board 
    const getBoard = function(){
        return board;
    };

    //To place an X or an O, we need to located which cells are available
    //we will need a list of the available cells for choosing
    const placeMarker = function(row, column, player) {
        
        const openCells = board.filter((row) => row[column].getValue() === 0).map(row => row[column]);

        if (!openCells.length) return;

        board[row][column].addMarker(player);
    }

    const printBoard = function() {
        const boardWithMarkers = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithMarkers);
    }

    return{getBoard, placeMarker, printBoard};
};

function cell() {
    let value = 0;

    const addMarker = function(player) {
        value = player;
    };

    const getValue = function() {
        return value;
    }

    return{addMarker, getValue};

}

const checkForWin = function(playerMarker, board) {
    //check rows
    for (let i=0; i<3; i++) {
        if (board[i][0].getValue() === playerMarker
        && board[i][1].getValue() === playerMarker
        && board[i][2].getValue() === playerMarker
        )
        return true;
    }

    //check columns
    for (let i=0; i<3; i++) {
        if (board[0][i].getValue() === playerMarker
        && board[1][i].getValue() === playerMarker
        && board[2][i].getValue() === playerMarker
        )
        return true;
    }

    //check diagonal
    if (board[0][0].getValue() === playerMarker
    && board[1][1].getValue() === playerMarker
    && board[2][2].getValue() === playerMarker
    ) {
        return true;
    }

    if (board[0][2].getValue() === playerMarker
    && board[1][1].getValue() === playerMarker
    && board[2][0].getValue() === playerMarker
    ) {
        return true;
    }

    return false;
}

function gameController (playerOneName = "Player1", playerTwoName = "PLayer2") {
    const board = gameBoard();

    const players = [
        {name: playerOneName,
        marker: 'X'},
        {name: playerTwoName, 
        marker: 'O'}
    ];

    let activePlayer = players[0];

    const switchPlayer = function () {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = function() {
        return activePlayer;
    }

    const printUpdatedBoard = function() {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    }

    const playGame = function(row, column) {
        console.log(`${getActivePlayer().name} has chosen row ${row}, and column ${column}, which has now been marked
        with ${getActivePlayer().marker}...`)
        
        //send the info to use the place marker function
        board.placeMarker(row, column, getActivePlayer().marker);
        
         if (checkForWin(getActivePlayer().marker, board.getBoard())){
            console.log(`Congrats ${getActivePlayer().name} has won!`)
        }

        switchPlayer();
        printUpdatedBoard();
    };

    printUpdatedBoard();

    return{ playGame, getActivePlayer, getBoard: board.getBoard};
}


function screenController() {
    const game = gameController();
    const gameBox = document.querySelector('.gameBox');
    const playerTurn = document.querySelector('.playerTurn');
    const board = game.getBoard();

    const updateScreen = function(){
        //clear the player info 
        gameBox.textContent = "";

        //pull in who is playing

        const activePlayer = game.getActivePlayer();

        playerTurn.textContent = `${activePlayer.name}'s turn`

        //search through the rows and the columns setting everything to a button
        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const squareButton = document.createElement("button");
                squareButton.classList.add('playerSquares');
                squareButton.dataset.row = rowIndex;
                squareButton.dataset.column = columnIndex;
                squareButton.textContent = cell.getValue();
                squareButton.addEventListener("click",clickHandler)
                gameBox.appendChild(squareButton);
            })
        })

    }

    function clickHandler(event) {
        const selectedRow = event.target.dataset.row;
        const selectedColumn = event.target.dataset.column;

        if (board[selectedRow][selectedColumn].getValue() !== 0){ 
            return;
        }
        
        game.playGame(selectedRow ,selectedColumn);
        updateScreen();
      }

      // Initial render
      updateScreen();

    
}

screenController();




/*

if (checkForDraw(board.getBoard())) {
   console.log(`It's a draw!`);
   // Add logic here to handle the draw state, e.g., display a message or reset the board.
   return;
}

const checkForDraw = function(board) {
   for (let row of board) {
      for (let cell of row) {
         if (cell.getValue() === 0) {
            // If there is an empty cell, the game is not a draw.
            return false;
         }
      }
   }
   // If no empty cells are found, it's a draw.
   return true;
}

if (checkForWin(getActivePlayer().marker, board.getBoard())) {
   console.log(`Congrats ${getActivePlayer().name} has won!`);
   // Add logic here to handle the game-over state, e.g., display a message or reset the board.
   return;
}
*/