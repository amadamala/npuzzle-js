$(document).ready(function(){
	console.log('inside document ready');
		
    var DIM = 4, WIDTH= 80, HEIGHT = 80;
    var board = [0, 1, 2, 3, 4, 5 ,6 ,7, 8, 9, 10, 11, 12, 13, 14, 15];
    var emptyCellNumber, NUMBER_ON_EMPTY_CELL=0;

    $(function(){

        initializeboard();
        drawBoard();

        /*
            Draw's the new board, reads board data from 'board'.
         */
        function drawBoard() {
            $("#board").html('');
            for (var i = 0; i < board.length; i++) {
                var rowDiv;
                if (i % DIM == 0) {
                    rowDiv = $("<div>").attr("id", getRowId(i)).addClass("row").appendTo("#board");
                }

                $('<div/>')
                    .attr("id", getCellId(board[i]))
                    .addClass("btn btn-primary")
                    .text(board[i])
                    .appendTo(rowDiv)
                    .css("width", WIDTH).css("height", HEIGHT)
                    .on("click", notifyClick);
            }

            // Hide the empty cell.
            $("#cell-0").invisible();
        }


        /*
            Initializes the board to solvable state.
        */
        function initializeboard() {
            do{
                board = shuffleArray(board);
            } while(! isSolvable(board));
        }

        /*
            Handles the the click on the button
         */
        function notifyClick(event) {
            var $cell = $(this);
            var numberOnCell = parseInt($cell.text(), 10);

            // Ignore the invalid click
            if(! isValidClick(numberOnCell))
                return;

            // Move the cells
            moveCell(getRowNumber(numberOnCell), getColumnNumber(numberOnCell));
            var isBoardSolved = isSolvedFn();

            if(isBoardSolved) {
                if (confirm('Yay! You solved the puzzle. \n Want to play another game?')) {
                    initializeboard();
                    drawBoard();
                } else {
                    return;
                }
            }

        }

        // Check for win status
        function isSolvedFn() {
            for (var i = 0; i < board.length - 1; i++) { // i < board.length because last index 15, will have 0 (empty space)
                if (board[i] != i + 1) {
                    return false;
                }
            }
            return true;
        }

        /*
            Move cells as per click
         */
        function moveCell(row, col) {
            var emptyRow = getRowNumber(NUMBER_ON_EMPTY_CELL);
            var emptyCol = getColumnNumber(NUMBER_ON_EMPTY_CELL);


            var rowDiff = emptyRow - row;
            var colDiff = emptyCol - col;
            var isInRow = (row == emptyRow);
            var isInCol = (col == emptyCol);
            var isNotDiagonal = (isInRow || isInCol);

            var emptyCellIndex = getIndexOf(NUMBER_ON_EMPTY_CELL);

            if (isNotDiagonal) {
                // -ve diff, move row left
                if (colDiff < 0 & isInRow) {
                    for (var i = 0; i < Math.abs(colDiff); i++) {
                        board[emptyCellIndex + i] = board[emptyCellIndex + i + 1];
                    }

                } // + ve Diff, move row right
                else if (colDiff > 0 & isInRow) {
                    for (var i = 0; i < Math.abs(colDiff); i++) {
                        board[emptyCellIndex - i] = board[emptyCellIndex - (i + 1)];
                    }
                }

                // -ve diff, move column up
                if (rowDiff < 0 & isInCol) {
                    for (var i = 0; i < Math.abs(rowDiff); i++) {
                          board[emptyCellIndex + i * DIM] = board[emptyCellIndex + (i + 1) * DIM];
                    }

                } // + ve Diff, move column down
                else if (rowDiff > 0 & isInCol) {
                    for (var i = 0; i < Math.abs(rowDiff); i++) {
                        board[emptyCellIndex - i * DIM] = board[emptyCellIndex - (i + 1) * DIM];
                    }
                }

                // Swap the empty square with the given square
//                board[emptyRow][emptyCol].setVisible(true);
//                board[row][col].setText(Integer.toString(0));
//                board[row][col].setVisible(false);
//                emptyCell = getIndex(row, col);
                board[row* DIM + col] = 0;
                drawBoard();
            }

        }


        /*
             Checks the whether we have to move cells or not
        */
        function isValidClick(numberOnCell) {
            var emptyRow = getRowNumber(NUMBER_ON_EMPTY_CELL), emptyCol = getColumnNumber(NUMBER_ON_EMPTY_CELL);
            var clickRow = getRowNumber(numberOnCell),  clickCol = getColumnNumber(numberOnCell);
            // console.log("number on cell: " + numberOnCell + ", erow: " + emptyRow + ", ecol: " + emptyCol + ", cRow: " + clickRow + ", cCol: " + clickCol);
            return (emptyRow == clickRow) || (emptyCol == clickCol);
        }        


        /**
         * Verifies the board for solvability.For more details of solvability goto
         * URL: http://mathworld.wolfram.com/15Puzzle.html
         */
        function isSolvable(board) {
            var inversionSum = 0; // If this sum is even it is solvable

            for (var i = 0; i < board.length; i++) {
                // For empty square add row number to inversionSum
                if (board[i] == 0) {
                    inversionSum += ((i / DIM) + 1); // add Row number
                    continue;
                }
                var count = 0;
                for (var j = i + 1; j < board.length; j++) {
                    if (board[j] == 0) {
                        continue;
                    } else if (board[i] > board[j]) {
                        count++;
                    }
                }
                inversionSum += count;
            }

            // if inversionSum is even return true, otherwise false
            return inversionSum % 2 == 0;

        }

        
        function getEmptyCellNumber() {
            return getIndexOf(NUMBER_ON_EMPTY_CELL);
        }
        
        
        function getIndexOf(numberOnCell) {
            // Set the empty cell number and keep track of it.
            for(var i=0; i<board.length; i++) {
                if(board[i] == numberOnCell) {
                    return i;
                }
            }
        }
        
        function NumberFormatException(message) {
            this.message = message;
            this.name = "NumberFormatException";
        }
        
        
        function getEmptyCellRow() {
            return getRowNumber(getEmptyCellNumber());
        } 
        
        function getEmptyCellColumn() {
            return getColumnNumber(getEmptyCellNumber());
        }
        
        function shuffleArray(array) {
            for(var i=array.length-1; i>0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }

            return array;
        }
        
        
        /* Get DOM id of the row */
        function getRowId(numberOnCell) {
            return 'row-' + getRowNumber(numberOnCell);
        }
        /* Get the DOM id of the cell identified by row, col */                
        function getCellId(numberOnCell) {
           return "cell-" + numberOnCell; 
        }
        
        function getRowNumber(numberOnCell) {
            return Math.floor(getIndexOf(numberOnCell) / DIM);
        }
        
        function getColumnNumber(numberOnCell) {
            return (getIndexOf(numberOnCell) % DIM);
        }
        
    });

    // plugin: Just makes the visibility as hidden of an element
    // Note: Since hide() is moving the row elements, has to use this function. 
    $.fn.invisible = function() {
        return this.css('visibility', 'hidden');
    };


});