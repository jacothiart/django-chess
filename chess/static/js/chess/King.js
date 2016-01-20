var King = function (id, color) {
    this.id = id;
    this.name = KING;
    this.color = color;
    this.occupied = false;
    this.virtualColor = null;
    this.moveCount = 0;
    this.isCastlingLeft = false;
    this.isCastlingRight = false;
    this.priority = 6;
    
    this.img = function() {
        return this.color == WHITE ? '&#9812' : '&#9818';
    }
    
    this.inDanger = function(toIndex) {
        var danger = false;
        
        var toPiece = playArea[toIndex];

        if(toPiece.name != null && this.color != toPiece.color && toPiece.name == KING) {
            danger = true;
        }

        return danger;
    }
    
    this.method = function(toIndex) {
        var toPiece = playArea[toIndex];
        var index = getThePieceIndex(this);

        if(toPiece.name == null || this.color != toPiece.color) {
            if(!validate(index, toIndex)) {
                toPiece.occupied = true;
                toPiece.virtualColor = 'green';
            }
        }
    }
   
    this.move = function() {
        var xy = toXY(getThePieceIndex(this));

        var toIndex;

        var x = xy[X];
        var y = xy[Y] - 1;

        if(y >= 0) {
            toIndex = fromXY(x, y);
            this.method(toIndex);
        }

        x = xy[X] - 1;
        y = xy[Y] - 1;

        if(x >= 0 && y >= 0) {
            toIndex = fromXY(x, y);
            this.method(toIndex);
        }

        x = xy[X] - 1;
        y = xy[Y];

        if(x >= 0) {
            toIndex = fromXY(x, y);
            this.method(toIndex);
        }

        x = xy[X] - 1;
        y = xy[Y] + 1;

        if(x >= 0 && y <= 7) {
            toIndex = fromXY(x, y);
            this.method(toIndex);
        }

        x = xy[X];
        y = xy[Y] + 1;

        if(y <= 7) {
            toIndex = fromXY(x, y);
            this.method(toIndex);
        }

        x = xy[X] + 1;
        y = xy[Y] + 1;

        if(x <= 7 && y <= 7) {
            toIndex = fromXY(x, y);
            this.method(toIndex);
        }

        x = xy[X] + 1;
        y = xy[Y];

        if(x <= 7) {
            toIndex = fromXY(x, y);
            this.method(toIndex);
        }

        x = xy[X] + 1;
        y = xy[Y] - 1;

        if(x <= 7 && y >= 0) {
            toIndex = fromXY(x, y);
            this.method(toIndex);
        }
        
        this.castlingLeft();
        this.castlingRight();
    }

    this.danger = function() {
        var xy = toXY(getThePieceIndex(this));

        var toIndex;

        var x = xy[X];
        var y = xy[Y] - 1;

        if(y >= 0) {
            toIndex = fromXY(x, y);
            if(this.inDanger(toIndex)) {
                return true;
            }
        }

        x = xy[X] - 1;
        y = xy[Y] - 1;

        if(x >= 0 && y >= 0) {
            toIndex = fromXY(x, y);
            if(this.inDanger(toIndex)) {
                return true;
            }
        }

        x = xy[X] - 1;
        y = xy[Y];

        if(x >= 0) {
            toIndex = fromXY(x, y);
            if(this.inDanger(toIndex)) {
                return true;
            }
        }

        x = xy[X] - 1;
        y = xy[Y] + 1;

        if(x >= 0 && y <= 7) {
            toIndex = fromXY(x, y);
            if(this.inDanger(toIndex)) {
                return true;
            }
        }

        x = xy[X];
        y = xy[Y] + 1;

        if(y <= 7) {
            toIndex = fromXY(x, y);
            if(this.inDanger(toIndex)) {
                return true;
            }
        }

        x = xy[X] + 1;
        y = xy[Y] + 1;

        if(x <= 7 && y <= 7) {
            toIndex = fromXY(x, y);
            if(this.inDanger(toIndex)) {
                return true;
            }
        }

        x = xy[X] + 1;
        y = xy[Y];

        if(x <= 7) {
            toIndex = fromXY(x, y);
            if(this.inDanger(toIndex)) {
                return true;
            }
        }

        x = xy[X] + 1;
        y = xy[Y] - 1;

        if(x <= 7 && y >= 0) {
            toIndex = fromXY(x, y);
            if(this.inDanger(toIndex)) {
                return true;
            }
        }

        return false;
    }
    
    this.castlingLeft = function() {
        var x = 4;
        var y = (this.color == BLACK) ? 0: 7;

        var index1 = fromXY(x - 1, y);
        var index2 = fromXY(x - 2, y);
        var index3 = fromXY(x - 3, y);
        var index4 = fromXY(x - 4, y);

        var square1 = playArea[index1];
        var square2 = playArea[index2];
        var square3 = playArea[index3];
        var square4 = playArea[index4];

        var pass = true;
        var toIndex;
        var toSquare;
        var index = getThePieceIndex(this);
        
        if(this.moveCount == 0 && square1.name == null && square2.name == null && square3.name == null && square4.name == ROOK && square4.color == this.color && square4.moveCount == 0) {
            for(var i = 1; i < 5; i ++) {
                toIndex = fromXY(x - i, y);
                toSquare = playArea[toIndex];
                
                playArea[index] = toSquare;
                playArea[toIndex] = this;

                if(pieceInDanger(toIndex)) {
                    pass = false;
                }
                
                playArea[index] = this;
                playArea[toIndex] = toSquare;
                
                if (!pass) {
                    break;
                }
            }

            if(pass) {
                toSquare.occupied = true;
                toSquare.virtualColor = 'blue';
                this.isCastlingLeft = true;
            }
        }
    }

    this.castlingRight = function() {
        var x = 4;
        var y = (this.color == BLACK) ? 0: 7;

        var index1 = fromXY(x + 1, y);
        var index2 = fromXY(x + 2, y);
        var index3 = fromXY(x + 3, y);

        var square1 = playArea[index1];
        var square2 = playArea[index2];
        var square3 = playArea[index3];
        
        var pass = true;
        var toIndex;
        var toSquare;
        var index = getThePieceIndex(this);

        if(this.moveCount == 0 && square1.name == null && square2.name == null && square3.name == ROOK && square3.color == this.color && square3.moveCount == 0) {
            for(var i = 1; i < 4; i ++) {
                toIndex = fromXY(x + i, y);
                toSquare = playArea[toIndex];
                
                playArea[index] = toSquare;
                playArea[toIndex] = this;

                if(pieceInDanger(toIndex)) {
                    pass = false;
                }
                
                playArea[index] = this;
                playArea[toIndex] = toSquare;
                
                if (!pass) {
                    break;
                }
            }

            if(pass) {
                toSquare.occupied = true;
                toSquare.virtualColor = 'blue';
                this.isCastlingRight = true;
            }
        }
    }
}