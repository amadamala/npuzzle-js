$(document).ready(function(){
	console.log('inside document ready');
		
    var DIM = 4, WIDTH= 80, HEIGHT = 80;
    var boardState = [0, 1, 2, 3, 4, 5 ,6 ,7, 8, 9, 10, 11, 12, 13, 14, 15];
    var emptyCellNumber;
    
    $(function(){

        initializeBoardState();
        
        for(var i=0; i<boardState.length; i++) {
            var rowDiv;
            if(i % DIM == 0) {
                rowDiv = $("<div>").attr("id", getRowId(i)).addClass("row").appendTo("#board");
            }

            $('<div/>')
                .attr("id", getCellId(boardState[i]))
                .addClass("btn btn-primary")
                .text(boardState[i])
                .appendTo(rowDiv)
                .css("width", WIDTH).css("height", HEIGHT)
                .on( "click", notifyClick);                            
        }


        // Hide the empty cell.
        $("#cell-0").invisible();




        //===============================================
        // Handle the clicks
        // ==============================================
        function notifyClick(event) {
            var $cell = $(this);

            var numberOnCell = parseInt($cell.text(), 10);

            var row = getRowNumber(numberOnCell);
            var col = getColumnNumber(numberOnCell);

            // console.log("row: " + row + ", column: " + col);
            // console.log("rowId: " + getRowId(row) + ", cellId: " + getCellId(row, col));
            
            var isValid = isValidClick(numberOnCell);
            

            console.log("isValidClick: " + isValid);
        }
        
        function isValidClick(numberOnCell) {
            var emptyRow = getEmptyCellRow(),           emptyCol = getEmptyCellColumn();
            var clickRow = getRowNumber(numberOnCell),  clickCol = getColumnNumber(numberOnCell);
            
            if(emptyRow == clickRow || emptyCol == clickCol) {
                return true;    
            } 
            
            return false;
        }        
        
        
        
        /* Initializes the board to solvable state.*/
        function initializeBoardState() {                                   
            do{
                boardState = shuffleArray(boardState);
            } while(! isSolvable(boardState));            
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
            for(var i=0; i<boardState.length; i++) {
                if(boardState[i] == numberOnCell) {
                    console.log("emptyCellNumber: " + emptyCellNumber);
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
            return Math.floor(numberOnCell / DIM);
        }
        
        function getColumnNumber(numberOnCell) {
            return (numberOnCell % DIM);
        }
        
    });

    // plugin: Just makes the visibility as hidden of an element
    // Note: Since hide() is moving the row elements, has to use this function. 
    $.fn.invisible = function() {
        return this.css('visibility', 'hidden');
    };


});