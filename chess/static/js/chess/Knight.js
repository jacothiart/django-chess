var Knight = function (id, color) {
    this.id = id;
    this.name = KNIGHT;
    this.color = color;
    this.occupied = false;
    this.virtualColor = null;
    this.moveCount = 0;
    this.priority = 2;
    
    this.img = function() {
        return this.color == WHITE ? '&#9816' : '&#9822';
    }
    
    this.inDanger = function(toIndex) {
        var danger = false;
        
        var toPiece = playArea[toIndex];
        
        if(toPiece.name != null && this.color != toPiece.color && toPiece.name == KNIGHT) {
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

        var x = xy[X] - 2;
        var y = xy[Y] - 1;

        if(x >= 0 && y >= 0) {
            toIndex = fromXY(x, y);
            this.method(toIndex);
        }

        x = xy[X] - 1;
        y = xy[Y] - 2;

        if(x >= 0 && y >= 0) {
            toIndex = fromXY(x, y);
            this.method(toIndex);
        }

        x = xy[X] + 1;
        y = xy[Y] - 2;

        if(x <= 7 && y >= 0) {
            toIndex = fromXY(x, y);
            this.method(toIndex);
        }

        x = xy[X] + 2;
        y = xy[Y] - 1;

        if(x <= 7 && y >= 0) {
            toIndex = fromXY(x, y);
            this.method(toIndex);
        }

        x = xy[X] + 2;
        y = xy[Y] + 1;

        if(x <= 7 && y <= 7) {
            toIndex = fromXY(x, y);
            this.method(toIndex);
        }

        x = xy[X] + 1;
        y = xy[Y] + 2;

        if(x <= 7 && y <= 7) {
            toIndex = fromXY(x, y);
            this.method(toIndex);
        }

        x = xy[X] - 1;
        y = xy[Y] + 2;

        if(x >= 0 && y <= 7) {
            toIndex = fromXY(x, y);
            this.method(toIndex);
        }

        x = xy[X] - 2;
        y = xy[Y] + 1;

        if(x >= 0 && y <= 7) {
            toIndex = fromXY(x, y);
            this.method(toIndex);
        }
    }

    this.danger = function() {
        var xy = toXY(getThePieceIndex(this));
        var toIndex;
        var toPiece;

        var x = xy[X] - 2;
        var y = xy[Y] - 1;

        if(x >= 0 && y >= 0) {
            toIndex = fromXY(x, y);
            if(this.inDanger(toIndex)) {
                return true;
            }
        }

        x = xy[X] - 1;
        y = xy[Y] - 2;

        if(x >= 0 && y >= 0) {
            toIndex = fromXY(x, y);
            if(this.inDanger(toIndex)) {
                return true;
            }
        }

        x = xy[X] + 1;
        y = xy[Y] - 2;

        if(x <= 7 && y >= 0) {
            toIndex = fromXY(x, y);
            if(this.inDanger(toIndex)) {
                return true;
            }
        }

        x = xy[X] + 2;
        y = xy[Y] - 1;

        if(x <= 7 && y >= 0) {
            toIndex = fromXY(x, y);
            if(this.inDanger(toIndex)) {
                return true;
            }
        }

        x = xy[X] + 2;
        y = xy[Y] + 1;

        if(x <= 7 && y <= 7) {
            toIndex = fromXY(x, y);
            if(this.inDanger(toIndex)) {
                return true;
            }
        }

        x = xy[X] + 1;
        y = xy[Y] + 2;

        if(x <= 7 && y <= 7) {
            toIndex = fromXY(x, y);
            if(this.inDanger(toIndex)) {
                return true;
            }
        }

        x = xy[X] - 1;
        y = xy[Y] + 2;

        if(x >= 0 && y <= 7) {
            toIndex = fromXY(x, y);
            if(this.inDanger(toIndex)) {
                return true;
            }
        }

        x = xy[X] - 2;
        y = xy[Y] + 1;

        if(x >= 0 && y <= 7) {
            toIndex = fromXY(x, y);
            if(this.inDanger(toIndex)) {
                return true;
            }
        }

        return false;
    }
}