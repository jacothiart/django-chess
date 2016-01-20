var playArea = new Array(64);

var currentColor = null;
var debug = false;
var gameOver = true;
var timerID = null;

var KING = 'King';
var QUEEN = 'Queen';
var ROOK = 'Rook';
var KNIGHT = 'Knight';
var BISHOP = 'Bishop';
var PAWN = 'Pawn';

var LIGHT_YELLOW = '#e8e2a4';
var BROWN = '#ac806d';

var BLACK = 1;
var WHITE = 2;
var OPEN = 2;
var X = 0;
var Y = 1;

var TIME = 20000;

var pollInvitation = null;
var invitationID = null
var dropEnabled = new Array();
var clickedItem = null;
var drag = '';

var emptyPiece = null;

function debugPlayArea() {
    var str = '';
    var index = null;
    var color = null;

    for(var y = 0; y < 8; y ++) {
        str = '';

		for(var x = 0; x < 8; x ++) {
            index = fromXY(x, y);
            color = null
            
            if(playArea[index].color == WHITE) {
                color = 'White';
            }
            if(playArea[index].color == BLACK) {
                color = 'Black';
            }

            str += color + ' ' + playArea[index].name + ' - ';
        }
        
    }
}

function isCheckMate(color) {
	var piece;
	var random = new Array();
    dropEnabled = new Array();
    
	for(var i = 0; i < playArea.length; i ++) {
		piece = playArea[i];
		
		if(piece.color == color) {
            for(var j = 0; j < playArea.length; j ++) {
                playArea[j].occupied = false;
            }
            piece.move();
			setDrop(false);
            
			if(dropEnabled.length > 0) {
				random.push(i);
			}
		}
	}
	if(random.length > 0) {
		return false;
	} else {
		return true;
	}
}

function toXY(position) {
	var i = 0;
    
	for(var y = 0; y < 8; y ++) {
		for(var x = 0; x < 8; x ++) {
			if(position == i) {
				return new Array(x, y);
			}
			i ++;
		}
	}
}
				
function fromXY(x, y) {
	var k = 0;
	for(var i = 0; i < 8; i ++) {
		for(var j = 0; j < 8; j ++) {
			if(i == y && j == x) {
				return k;
			}
			k ++;
		}
	}
	return false;
}

function validate(fromIndex, toIndex) {
	var danger = false;
    var tempFromPiece = playArea[fromIndex];
    var tempToPiece = playArea[toIndex];
    
    var kingIndex = getTheKingIndex(tempFromPiece.color);
    
    if(fromIndex == kingIndex) {
        kingIndex = toIndex;
    }
    
    playArea[fromIndex] = new Empty(null);
	playArea[toIndex] = tempFromPiece;
    
	if(pieceInDanger(kingIndex)) {
        danger = true;
	}
	
    playArea[fromIndex] = tempFromPiece;
    playArea[toIndex] = tempToPiece;
    
	return danger;
}

function pieceInDanger(index) {
    var piece = playArea[index];
    
    var pawn = new Pawn(piece.id, piece.color);
    playArea[index] = pawn;
    
    if(pawn.danger()) {
        playArea[index] = piece;
        return true;
    }
    
    var queen = new Queen(piece.id, piece.color);
    playArea[index] = queen;
    
    if(queen.danger()) {
        playArea[index] = piece;
        return true;
    }
    var knight = new Knight(piece.id, piece.color);
    playArea[index] = knight;
    
    if(knight.danger()) {
        playArea[index] = piece;
        return true;
    }
    
    var king = new King(piece.id, piece.color);
    playArea[index] = king;
    
    if(king.danger()) {
        playArea[index] = piece;
        return true;
    }
    
    playArea[index] = piece;
    
    return false;
}

function inArray(key, array) {
    for(var i = 0; i < array.length; i ++) {
        if(array[i] == key) {
            return true;
        }
    }
    return false;
}

function updateTimer() {
    $('span.time').html(parseInt($('span.time').html()) + 1);
}

function assignDrop(drop) {
    $.each($('.block'), function(k, v) {
        var index = getBlockIndexFromClass($(v));
        $(document).on('click', '.block_' + index, function() {
           if(inArray(index, dropEnabled)) {
                if(gameOver) {
                    gameOver = false;
                    timerID = setInterval('updateTimer()', 1000)
                }
                
                dropEnabled = new Array();
                setBackgrounds();
                
                var to = getBlockIndexFromClass($(v));
                var from = getBlockIndexFromClass(clickedItem);
                var temp = clickedItem.clone();
                var castled = false;
                
                if(playArea[from].name == KING && (playArea[from].isCastlingLeft || playArea[from].isCastlingRight) && playArea[to].name == ROOK) {
                    $(clickedItem).html($(v).text());
                    playArea[from].isCastlingLeft = false;
                    playArea[from].isCastlingRight = false;
                    castled = true;
                }
                
                if(playArea[from].name == PAWN && playArea[from].enPassantIndex != null && playArea[playArea[from].enPassantIndex].name == PAWN) {
                    var enPassant = $('.block_' + playArea[from].enPassantIndex);
                    enPassant.html(emptyPiece);
                    playArea[from].enPassantIndex = null;
                }

                $(v).html(temp.text());
                
                resetZIndex();
                
                move = getMove(playArea[from], from, to);
                
                temp = new Empty(null);
                
                if(castled) {
                    temp = playArea[to];
                } else {
                    $('.block_' + from).html(emptyPiece);
                }
                
                playArea[to] = playArea[from];
                playArea[from] = temp;
                
                var response;
                
                if(isCheckMate(BLACK)) {
                    clearInterval(timerID);
                    
                    $.post('/score/', {score: parseInt($('.time').html())}, function(data){
                        $('.area').html('<h1 class="win">You Win!</h1>' + data);
                    });
                }
   
                for(var i = 0; i < playArea.length; i ++) {
                    playArea[i].occupied = false;
                }
                
                var kingColor = currentColor == WHITE ? BLACK : WHITE;
                var kingIndex = getTheKingIndex(kingColor);

                if(pieceInDanger(kingIndex)) {
                    $('.block_' + kingIndex).css('background-color', 'red');
                }
                
                playArea[to].moveCount += 1;
                currentColor = BLACK;
                
                var move = artificialIntelligence();
                $('.block_' + move[1]).html($('.block_' + move[0]).text());
                $('.block_' + move[0]).html(emptyPiece);
                playArea[move[1]] = playArea[move[0]];
                playArea[move[0]] = new Empty(null);
                playArea[move[1]].moveCount ++;
                
                currentColor = WHITE;   
                if(isCheckMate(WHITE)) {
                    $('.area').html('<h1>You Loose!</h1>');
                }
                dropEnabled = new Array();
                for(var j = 0; j < playArea.length; j ++) {
                    playArea[j].occupied = false;
                }
                getActivePiecesAsString();
                assignDrag();
            }
        });
    });
}

function artificialIntelligence() {
    var priority = new Array(
		new Array(),
		new Array(),
		new Array(),
		new Array(),
		new Array(),
		new Array()
	);
	
	for(i = 0; i < playArea.length; i ++) {
		if(playArea[i].color == BLACK) {
			priority[playArea[i].priority - 1].push(i);
		}
	}
	
	var priorityList = new Array();
	
	for(i = 0; i < priority.length; i ++) {
		for(var j = 0; j < priority[i].length; j ++) {
			priorityList.push(priority[i][j]);
		}
	}
    
    priorityList = priorityList.reverse();
    
    var fromIndex = null;
	var temp = null;
	var temp2 = null;
	var futureMove = null;
	var move = null;
	var d = null;
	var dropTemp = new Array();
    
    for(var i = 0; i < priorityList.length; i ++) {
		fromIndex = priorityList[i];
        
        if(pieceInDanger(fromIndex)) {
            for(var j = 0; j < playArea.length; j ++) {
                playArea[j].occupied = false;
            }
            playArea[fromIndex].move();
            setDrop(false);
            
            if(dropEnabled.length > 0) {
                var moves = new Array();
                
                for(j = 0; j < dropEnabled.length; j ++) {
                    var movePriority = 0;
                    
                    temp = playArea[fromIndex];
                    playArea[fromIndex] = new Empty(null);
                    temp2 = playArea[dropEnabled[j]];
                    playArea[dropEnabled[j]] = temp;
                    d = dropEnabled[j];
                    
                    if(playArea[d].name != null) {
                        movePriority = playArea[d].priority;
                    }
                    
                    moves.push(new Move(d, pieceInDanger(d), movePriority));
                    
                    playArea[fromIndex] = temp;
                    playArea[dropEnabled[j]] = temp2;
                }
                
                var currentMove = moves[0];
                
                for(var j = 1; j < moves.length; j ++) {
                    if((currentMove.danger && moves[j].danger) || (!currentMove.danger && !moves[j].danger)) {
                        if(moves[j].priority >= currentMove.priority) {
                            currentMove = moves[j];
                        }
                    } else {
                        if(!currentMove.danger && moves[j].danger) {
                            currentMove = moves[j];
                        }
                    }
                }
                return new Array(fromIndex, currentMove.index);
            }
        }
    }
    
    var run = true;
    var random = new Array();
    
    for(var i = 0; i < playArea.length; i ++) {
		piece = playArea[i];
		if(piece.color == BLACK) {
            for(var j = 0; j < playArea.length; j ++) {
                playArea[j].occupied = false;
            }
			piece.move();
            setDrop(false);
			
			if(dropEnabled.length > 0) {
				random.push(i);
			}
		}
	}
    
    var index;
    
    while (run) {
		if(random.length > 0) {
			var r = Math.floor((Math.random() * random.length) + 1);
			
			fromIndex = random[r - 1];
            
            for(var j = 0; j < playArea.length; j ++) {
                playArea[j].occupied = false;
            }
            
            playArea[fromIndex].move();
			setDrop(false);
            
			if(dropEnabled.length > 0) {
				return new Array(fromIndex, dropEnabled[0]);
			} else {
				var index = 0;
				for (var m = 0; m < random.length; m ++) {
					if(random[m] == r) {
						index = m;
					}
				}
				random.remove(index);
				random.sort();
			}
		} else {
			return new Array(fromIndex, dropEnabled[0]);
		}
	}
}
 
var Move = function (index, danger, priority) {
	this.index = index;
	this.danger = danger;
	this.priority = priority;
}
           
function getMove(fromObj, from, to) {
    var color = fromObj.color == WHITE ? 'White': 'Black';
    
    return color + ' ' + fromObj.name + ' : ' + getChessMove(from, to);
}

function getChessMove(from, to) {
    var y = new Array('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h');
    var x = new Array(1, 2, 3, 4, 5, 6, 7, 8);
    
    var from = toXY(from);
    var to = toXY(to);
    
    return y[from[1]] + '' + x[from[0]] + ' - ' + y[to[1]] + '' + x[to[0]]
}

function getBlockIndexFromClass(element) {
    var array = element.attr('class').split(' ');
    
    for(var i = 0; i < array.length; i ++) {
        var parts = array[i].split('_')
        if(parts.length > 1) {
            return parseInt(parts[1])
        }
    }
}

function assignDrag() {
    $(document).on('click', '.block', function() {
        var index = getBlockIndexFromClass($(this));
        var from = clickedItem == null ? null : getBlockIndexFromClass(clickedItem);

        if(inArray(index, dragEnabled)) {
            if(from != null && (playArea[from].isCastlingLeft || playArea[from].isCastlingRight) && playArea[index].name == ROOK) {
            } else {
                setBackgrounds();
                clickedItem = $(this);
                $(this).css({'z-index': 1});

                var block = playArea[index];
                for(var i = 0; i < playArea.length; i ++) {
                    playArea[i].occupied = false;
                }
                block.move();

                var piece;
                var drop = '';
                var key;

                var drop = setDrop(true);

                if(drop != '') {
                    drop = drop.substring(0, drop.length - 2)
                    assignDrop(drop);
                    $(drag).unbind('click');
                }
            }
        }
    });
}

function setDrop(placeholders) {
    var drop = '';
    
    dropEnabled = new Array();
                
    for(var i = 0; i < playArea.length; i ++) {
        piece = playArea[i];
        
        if(piece.occupied) {
            key = '.block_' + i;
            drop += key + ', ';
            dropEnabled.push(i);
            if(placeholders) {
                $(key).css('background-color', piece.virtualColor);
            }
        }
    }    
    
    return drop;
}

function resetZIndex() {
    for(var i = 0; i < playArea.length; i ++) {
        $('.block_' + i).css('z-index', 0);
    }
}

function setBackgrounds() {
    var color;

    for(var i = 0; i < 8; i ++) {
        if(i % 2 == 0)  {
            color = LIGHT_YELLOW;
        } else {
            color = BROWN;
        }
        $('.block_' + i).css('background-color', color);
    }

    for(var i = 8; i < 16; i ++) {
        if(i % 2 == 0)  {
            color = BROWN;
        } else {
            color = LIGHT_YELLOW;
        }
        $('.block_' + i).css('background-color', color);
    }

    for(var i = 16; i < 24; i ++) {
        if(i % 2 == 0)  {
            color = LIGHT_YELLOW;
        } else {
            color = BROWN;
        }
        $('.block_' + i).css('background-color', color);
    }

    for(var i = 24; i < 32; i ++) {
        if(i % 2 == 0)  {
            color = BROWN;
        } else {
            color = LIGHT_YELLOW;
        }
        $('.block_' + i).css('background-color', color);
    }

    for(var i = 32; i < 40; i ++) {
        if(i % 2 == 0)  {
            color = LIGHT_YELLOW;
        } else {
            color = BROWN;
        }
        $('.block_' + i).css('background-color', color);
    }

    for(var i = 40; i < 48; i ++) {
        if(i % 2 == 0)  {
            color = BROWN;
        } else {
            color = LIGHT_YELLOW;
        }
        $('.block_' + i).css('background-color', color);
    }

    for(var i = 48; i < 56; i ++) {
        if(i % 2 == 0)  {
            color = LIGHT_YELLOW;
        } else {
            color = BROWN;
        }
        $('.block_' + i).css('background-color', color);
    }

    for(var i = 56; i < 64; i ++) {
        if(i % 2 == 0)  {
            color = BROWN;
        } else {
            color = LIGHT_YELLOW;
        }
        $('.block_' + i).css('background-color', color);
    }
}
    
function getActivePiecesAsString() {
    drag = '';
    dragEnabled = new Array();
    
    for(var i = 0; i < playArea.length; i ++) {
        if(playArea[i].color == currentColor) {
            drag += '.block_' + i + ', ';
            dragEnabled.push(i);
        }
    }
    
    drag = drag.substring(0, drag.length - 2);
}

function getTheKingIndex(color) {
    for(var i = 0; i < playArea.length; i ++) {
        if(playArea[i].color == color && playArea[i].name == KING) {
            return i;
        }
    }
}

function getThePieceIndex(piece) {
    for(var i = 0; i < playArea.length; i ++) {
        if(playArea[i].id == piece.id) {
            return i;
        }
    }
}

function initPlayArea() {
    playArea[0] = new Rook(0, BLACK), playArea[7] = new Rook(7, BLACK);
    playArea[1] = new Knight(1, BLACK), playArea[6] = new Knight(6, BLACK);
    playArea[2] = new Bishop(2, BLACK), playArea[5] = new Bishop(5, BLACK);
    playArea[3] = new Queen(3, BLACK);
    playArea[4] = new King(4, BLACK);
    
    for(var i = 8; i < 16; i ++) {
        playArea[i] = new Pawn(i, BLACK);
    }
    
    for(var i = 16; i < 48; i ++) {
        playArea[i] = new Empty(i);
    }
    
    playArea[56] = new Rook(56, WHITE), playArea[63] = new Rook(63, WHITE);
    playArea[57] = new Knight(57, WHITE), playArea[62] = new Knight(62, WHITE);
    playArea[58] = new Bishop(58, WHITE), playArea[61] = new Bishop(61, WHITE);
    playArea[59] = new Queen(59, WHITE);
    playArea[60] = new King(60, WHITE);
    
    for(var i = 48; i < 56; i ++) {
        playArea[i] = new Pawn(i, WHITE);
    }
}

function adaptToResponse() {
    $('.block').css({'font-size': $('.block').width() - 5 + 'px', 'line-height': $('.block').width() + 'px'});
    $('.block').height($('.block').width());
}
$(window).resize(function() {
    adaptToResponse();
});
$(document).ready(function() {
    currentColor = WHITE;
    emptyPiece = '&nbsp;';
    initPlayArea();
    adaptToResponse();

    getActivePiecesAsString();
    assignDrag();
});