var Rook = function (id, color) {
    this.id = id;
    this.name = ROOK;
    this.color = color;
    this.occupied = false;
    this.virtualColor = null;
    this.moveCount = 0;
    this.priority = 4;
    
    this.img = function() {
        return this.color == WHITE ? '&#9814' : '&#9820';
    }
    
    this.inDanger = function(toIndex) {
        var danger = false;
        
        var toPiece = playArea[toIndex];
        
        if(toPiece.name != null && this.color != toPiece.color && (toPiece.name == ROOK || toPiece.name == QUEEN)) {
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
        var toPiece;
        
        var a = (this.color == WHITE) ? WHITE : BLACK;
        var b = (this.color == WHITE) ? BLACK : WHITE;

        var x = xy[X];
        var y = xy[Y];
        
        while(x != 7) {
            toIndex = fromXY(x + 1, xy[Y]);
            toPiece = playArea[toIndex];

            if(toPiece.color == a) {
                break;
            }

            this.method(toIndex);

            if(toPiece.color == b) {
                break;
            }

            x ++;
        }

        x = xy[X];
        
        while(x != 0) {
            toIndex = fromXY(x - 1, xy[Y]);
            toPiece = playArea[toIndex];

            if(toPiece.color == a) {
                break;
            }

            this.method(toIndex);

            if(toPiece.color == b) {
                break;
            }

            x --;
        }

        while(y != 7) {
            toIndex = fromXY(xy[X], y + 1);
            toPiece = playArea[toIndex];

            if(toPiece.color == a) {
                break;
            }

            this.method(toIndex);

            if(toPiece.color == b) {
                break;
            }

            y ++;
        }

        y = xy[Y];
        
        while(y != 0) {
            toIndex = fromXY(xy[X], y - 1);
            toPiece = playArea[toIndex];

            if(toPiece.color == a) {
                break;
            }

            this.method(toIndex);
            if(toPiece.color == b) {
                break;
            }

            y --;
        }
    }

    this.danger = function() {
        var xy = toXY(getThePieceIndex(this));
        var toIndex;
        var toPiece;

        var a = (this.color == WHITE) ? WHITE : BLACK;
        var b = (this.color == WHITE) ? BLACK : WHITE;

        var x = xy[X];
        var y = xy[Y];

        while(x != 7) {
            toIndex = fromXY(x + 1, xy[Y]);
            toPiece = playArea[toIndex];

            if(toPiece.color == a) {
                break;
            }

            if(this.inDanger(toIndex)) {
                return true;
            }

            if(toPiece.color == b) {
                break;
            }

            x ++;
        }

        x = xy[X];

        while(x != 0) {
            toIndex = fromXY(x - 1, xy[Y]);
            toPiece = playArea[toIndex];

            if(toPiece.color == a) {
                break;
            }

            if(this.inDanger(toIndex)) {
                return true;
            }

            if(toPiece.color == b) {
                break;
            }

            x --;
        }
        
        while(y != 7) {
            toIndex = fromXY(xy[X], y + 1);
            toPiece = playArea[toIndex];

            if(toPiece.color == a) {
                break;
            }

            if(this.inDanger(toIndex)) {
                return true;
            }

            if(toPiece.color == b) {
                break;
            }

            y ++;
        }

        y = xy[Y];

        while(y != 0) {
            toIndex = fromXY(xy[X], y - 1);
            toPiece = playArea[toIndex];

            if(toPiece.color == a) {
                break;
            }

            if(this.inDanger(toIndex)) {
                return true;
            }

            if(toPiece.color == b) {
                break;
            }

            y --;
        }
        return false;
    }
}