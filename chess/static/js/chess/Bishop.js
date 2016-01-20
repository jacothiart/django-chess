var Bishop = function (id, color) {
    this.id = id;
    this.name = BISHOP;
    this.color = color;
    this.occupied = false;
    this.virtualColor = null;
    this.moveCount = 0;
    this.priority = 3;
    
    this.img = function() {
        return this.color == WHITE ? '&#9815' : '&#9821';
    }
    
    this.inDanger = function(toIndex) {
        var danger = false;
        
        var toPiece = playArea[toIndex];
        
        if(toPiece.name != null && this.color != toPiece.color && (toPiece.name == BISHOP || toPiece.name == QUEEN)) {
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
        
        while(x != 7 && y != 0) {
            toIndex = fromXY(x + 1, y - 1);
            toPiece = playArea[toIndex];

            if(toPiece.color == a) {
                break;
            }

            this.method(toIndex);

            if(toPiece.color == b) {
                break;
            }

            x ++;
            y --;
        }

        x = xy[X];
        y = xy[Y];
        
        while(x != 7 && y != 7) {
            toIndex = fromXY(x + 1, y + 1);
            toPiece = playArea[toIndex];

            if(toPiece.color == a) {
                break;
            }

            this.method(toIndex);

            if(toPiece.color == b) {
                break;
            }

            x ++;
            y ++;
        }

        x = xy[X];
        y = xy[Y];
        
        while(x != 0 && y != 7) {
            toIndex = fromXY(x - 1, y + 1);
            toPiece = playArea[toIndex];

            if(toPiece.color == a) {
                break;
            }

            this.method(toIndex);

            if(toPiece.color == b) {
                break;
            }

            x --;
            y ++;
        }

        x = xy[X];
        y = xy[Y];

        while(x != 0 && y != 0) {
            toIndex = fromXY(x - 1, y - 1);
            toPiece = playArea[toIndex];

            if(toPiece.color == a) {
                break;
            }

            this.method(toIndex);

            if(toPiece.color == b) {
                break;
            }

            x = x - 1;
            y = y - 1;
        }
    }

    this.danger = function() {
        var xy = toXY(getThePieceIndex(this));
        var toIndex;
        var toPiece;

        var toIndex;

        var a = (this.color == WHITE) ? WHITE : BLACK;
        var b = (this.color == WHITE) ? BLACK : WHITE;

        var x = xy[X];
        var y = xy[Y];

        while(x != 7 && y != 0) {
            toIndex = fromXY(x + 1, y - 1);
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
            y --;
        }

        x = xy[X];
        y = xy[Y];

        while(x != 7 && y != 7) {
            toIndex = fromXY(x + 1, y + 1);
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
            y ++;
        }

        x = xy[X];
        y = xy[Y];

        while(x != 0 && y != 7) {
            toIndex = fromXY(x - 1, y + 1);
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
            y ++;
        }

        x = xy[X];
        y = xy[Y];

        while(x != 0 && y != 0) {
            toIndex = fromXY(x - 1, y - 1);
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

            x = x - 1;
            y = y - 1;
        }

        return false;
    }
}