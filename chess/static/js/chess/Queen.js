var Queen = function (id, color) {
    this.id = id;
    this.name = QUEEN;
    this.color = color;
    this.occupied = false;
    this.virtualColor = null;
    this.moveCount = 0;
    this.priority = 5;
    
    this.img = function() {
        return this.color == WHITE ? '&#9813' : '&#9819';
    }
    
    this.move = function() {
        new Rook(this.id, this.color).move();
        new Bishop(this.id, this.color).move();
    }

    this.danger = function() {
        var danger;
        
        danger = new Rook(this.id, this.color).danger();

        if(danger) {
            return danger;
        }
        
        danger = new Bishop(this.id, this.color).danger();

        return danger;
    }
}