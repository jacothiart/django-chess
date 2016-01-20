var Pawn = function (id, color) {
    this.id = id;
    this.name = PAWN;
    this.color = color;
    this.occupied = false;
    this.virtualColor = null;
    this.moveCount = 0;
    this.enPassantIndex = null;
    this.priority = 1;
    
    this.img = function() {
        return this.color == WHITE ? '&#9817' : '&#9823';
    }
    
    this.inDanger = function(toIndex) {
        var danger = false;
        
        var toPiece = playArea[toIndex];
        
        if(toPiece.name != null && this.color != toPiece.color && toPiece.name == PAWN) {
            danger = true;
        }
        
        return danger;
    }
    
    this.method1 = function(toIndex, toIndex2) {
        var toPiece = playArea[toIndex];
        var toPiece2 = playArea[toIndex2];
        
        var index = getThePieceIndex(this);

        if(toPiece.name == null && toPiece2.name == null && !validate(index, toIndex)) {
            toPiece.occupied = true;
            toPiece.virtualColor = 'green';
        }
    }
    
    this.method2 = function(toIndex) {
        var toPiece = playArea[toIndex];
        var index = getThePieceIndex(this);

        if(toPiece.name == null && !validate(index, toIndex)) {
            toPiece.occupied = true;
            toPiece.virtualColor = 'green';
        }
    }

    this.method3 = function(toIndex) {
        var toPiece = playArea[toIndex];
        var index = getThePieceIndex(this);

        if(toPiece.name != null && this.color != toPiece.color) {
            if(!validate(index, toIndex)) {
                toPiece.occupied = true;
                toPiece.virtualColor = 'green';
            }
        }
    }
    
    this.enPassant = function(toIndex, possiblePiece) {
        var pass = true;
        var index = getThePieceIndex(this);
        var possiblePieceIndex = getThePieceIndex(possiblePiece);
        var toPiece = playArea[toIndex];
        
        playarea[index] = new Empty(null);
        playarea[toIndex] = this;
        playarea[possiblePieceIndex] = new Empty(null);

        if(pieceInDanger(getTheKingIndex(this.color))) {
            pass = false;
        }
        
        playarea[index] = this;
        playarea[toIndex] = new Empty(null);
        playarea[possiblePieceIndex] = possiblePiece;
        
        if(pass) {
            toPiece.occupied = true;
            toPiece.virtualColor = 'blue';
            this.enPassantIndex = possiblePieceIndex;
        }
    }
    
    this.move = function() {
        var xy = toXY(getThePieceIndex(this));
        var toIndex;
        var toPiece;
        var possiblePieceIndex;
        var possiblePiece;
        var toIndex2;
        
        if(this.color == WHITE) {
            if(xy[Y] == 6) {
                toIndex = fromXY(xy[X], xy[Y] - 2);
                toIndex2 = fromXY(xy[X], xy[Y] - 1);
                this.method1(toIndex, toIndex2);
            }

            if(xy[Y] != 0) {
                toIndex = fromXY(xy[X], xy[Y] - 1);
                this.method2(toIndex);
            }

            if(xy[X] != 0 && xy[Y] != 0) {
                toIndex = fromXY(xy[X] - 1, xy[Y] - 1);
                this.method3(toIndex);
            }

            if(xy[X] != 7 && xy[Y] != 0) {
                toIndex = fromXY(xy[X] + 1, xy[Y] - 1);
                this.method3(toIndex);
            }
            
            if(xy[X] != 0 && xy[Y] != 0) {
                toIndex = fromXY(xy[X] - 1, xy[Y] - 1);
                toPiece = playArea[toIndex];
                possiblePieceIndex = fromXY(xy[X] - 1, xy[Y]);
                possiblePiece = playArea[possiblePieceIndex];

                if(possiblePiece.name == PAWN && possiblePiece.color == BLACK && possiblePiece.moveCount == 1 && toPiece.name == null) {
                    this.enPassant(toIndex, possiblePiece);
                }
            }

            if(xy[X] != 7 && xy[Y] != 0) {
                toIndex = fromXY(xy[X] + 1, xy[Y] - 1);
                toPiece = playArea[toIndex];
                possiblePieceIndex = fromXY(xy[X] + 1, xy[Y]);
                possiblePiece = playArea[possiblePieceIndex];

                if(possiblePiece.name == PAWN && possiblePiece.color == BLACK && possiblePiece.moveCount == 1 && toPiece.name == null) {
                    this.enPassant(toIndex, possiblePiece);
                }
            }
        } else {
            if(xy[Y] == 1) {
                toIndex = fromXY(xy[X], xy[Y] + 2);
                toIndex2 = fromXY(xy[X], xy[Y] + 1);
                this.method1(toIndex, toIndex2);
            }

            if(xy[Y] != 7) {
                toIndex = fromXY(xy[X], xy[Y] + 1);
                this.method2(toIndex);
            }

            if(xy[X] != 0 && xy[Y] != 7) {
                toIndex = fromXY(xy[X] - 1, xy[Y] + 1);
                this.method3(toIndex);
            }

            if(xy[X] != 7 && xy[Y] != 7) {
                toIndex = fromXY(xy[X] + 1, xy[Y] + 1);
                this.method3(toIndex);
            }
            
            if(xy[X] != 0 && xy[Y] != 7) {
                toIndex = fromXY(xy[X] - 1, xy[Y] + 1);
                toPiece = playArea[toIndex];
                possiblePieceIndex = fromXY(xy[X] - 1, xy[Y]);
                possiblePiece = playArea[possiblePieceIndex];

                if(possiblePiece.name == PAWN && possiblePiece.color == WHITE && possiblePiece.moveCount == 1 && toPiece.name == null) {
                    this.enPassant(toIndex, possiblePiece);
                }
            }
            
            if(xy[X] != 7 && xy[Y] != 7) {
                toIndex = fromXY(xy[X] + 1, xy[Y] + 1);
                toPiece = playArea[toIndex];
                possiblePieceIndex = fromXY(xy[X] + 1, xy[Y]);
                possiblePiece = playArea[possiblePieceIndex];

                if(possiblePiece.name == PAWN && possiblePiece.color == WHITE && possiblePiece.moveCount == 1 && toPiece.name == null) {
                    this.enPassant(toIndex, possiblePiece);
                }
            }
        }
    }

    this.danger = function() {
        var index = getThePieceIndex(this);
        var xy = toXY(index);

        var toIndex;

        if(this.color == WHITE) {
            if(xy[X] != 0 && xy[Y] != 0) {
                toIndex = fromXY(xy[X] - 1, xy[Y] - 1);
                if(this.inDanger(toIndex)) {
                    return true;
                }
            }

            if(xy[X] != 7 && xy[Y] != 0) {
                toIndex = fromXY(xy[X] + 1, xy[Y] - 1);
                if(this.inDanger(toIndex)) {
                    return true;
                }
            }
        } else {
            if(xy[X] != 0 && xy[Y] != 7) {
                toIndex = fromXY(xy[X] - 1, xy[Y] + 1);
                if(this.inDanger(toIndex)) {
                    return true;
                }
            }

            if(xy[X] != 7 && xy[Y] != 7) {
                toIndex = fromXY(xy[X] + 1, xy[Y] + 1);
                if(this.inDanger(toIndex)) {
                    return true;
                }
            }
            
        }

        return false;
    }
}