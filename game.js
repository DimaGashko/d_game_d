'use strict';

class Vector {
   constructor(x = 0, y = 0) {
      this.x = x;
      this.y = y;
   }

   plus(addVector) {
      if ( !(addVector instanceof Vector) ) {
         throw new SyntaxError('Можно прибавлять к вектору только вектор типа Vector');
      }

      return new Vector(
         this.x + addVector.x,
         this.y + addVector.y
      );
   }

   times(n) {
      return new Vector(
         this.x * n,
         this.y * n
      );
   }
}

class Actor {
   constructor(
      pos = new Vector(0, 0), 
      size = new Vector(1, 1), 
      speed = new Vector(0, 0)
   ) {
      var checkArguments = pos instanceof Vector
         && size instanceof Vector
         && speed instanceof Vector;

      if (!checkArguments) {
         throw new SyntaxError("Agruments is wrong");
      }

      this.pos = pos;
      this.size = size;
      this.speed = speed;

      Object.defineProperty(this, 'type', {
         value: this.getType(),
         writable: false,
      });
   }

   get left() {return this.pos.x;}
   get top() {return this.pos.y;}
   get right() {return this.pos.x + this.size.x;}
   get bottom() {return this.pos.y + this.size.y;}

   isIntersect(other) {
      if ( !(other instanceof Actor) ) {
         throw new SyntaxError("Agruments is wrong");
      }
      
      if (this === other) return false;

      if (this.pos.x === other.pos.x && this.pos.y === other.pos.y 
         && other.size.x < 0 && other.size.y < 0) return false;
      
      return isIntersectRect(
            this.left, this.right, this.top, this.bottom,  
            other.left, other.right, other.top, other.bottom
      );
   }

   act() {}
   getType() {return 'actor'}
   
}

class Player extends Actor {
   constructor(pos = new Vector()) {
      super(
         pos, 
         new Vector(0.8, 1.5) 
      );
      
      this.pos.y -= 0.5; 
   }

   getType() {return 'player'}

}

class Coin extends Actor {
   constructor(pos = new Vector()) {
      super(
         new Vector(pos.x + 0.2, pos.y + 0.1), 
         new Vector(0.6, 0.6)
      );

      this.spring = Math.random() * Math.PI * 2;
      this.springSpeed = 8;
      this.springDist = 0.07;

      this.startPos = new Vector(this.pos.x, this.pos.y);
   } 

   updateSpring(time = 1) {
      this.spring += this.springSpeed * time;
   }

   getSpringVector() {
      return new Vector(0, Math.sin(this.spring) * this.springDist);
   }

   getNextPosition(time = 1) {
      this.updateSpring(time);

      return new Vector(
         this.startPos.x,
         this.startPos.y + this.getSpringVector(time).y,
      );
   }

   act(time) {
      this.pos = this.getNextPosition(time);
   }

   getType() {return 'coin'}
}

class Fireball extends Actor {
   constructor(pos, speed) {
      super(pos, undefined, speed);
   }

   getNextPosition(time = 1) {
      return new Vector(
         this.pos.x + this.speed.x * time,
         this.pos.y + this.speed.y * time
      );
   }

   handleObstacle() {
      this.speed.x = -this.speed.x;
      this.speed.y = -this.speed.y;
   }

   act(time, level) {
      var nextPos = this.getNextPosition(time);

   }

   getType() {return 'fireball'}
}

class HorizontalFireball extends Fireball {
   constructor() {
      super(undefined, new Vector(2, 0));
   }
}

class VerticalFireball extends Fireball {
   constructor() {
      super(undefined, new Vector(0, 2));
   }
}

class FireRain extends Fireball {
   constructor(pos = new Vector()) {
      super(pos, new Vector(0, 3));

      this.startPos = new Vector(pos.x, pos.y);
   }

   handleObstacle() {
      this.pos.x = this.startPos.x;
      this.pos.y = this.startPos.y;
   }
}

class Level {
   constructor(grid, actors = []) {
      this.height = (grid) ? grid.length : 0;
      this.width = (grid && grid[0]) ? grid[0].length : 0;
      this.status = null;
      this.finishDelay = 1;
      this.actors = actors;

      this.grid = grid;

      this.player = null;

      for (var i = 0; i < actors.length; i++) {
         if (actors[i].type === 'player') {
            this.player = actors[i];
            break;
         }
      }

   }

   isFinished() {
      if (this.status !== null && this.finishDelay < 0) {
         return true;
      }

      return false;
   }

   actorAt(actor) {
      if ( !(actor && actor instanceof Actor) ) {
         throw new SyntaxError("Agruments is wrong");
      }

      for (var i = 0; i < this.actors.length; i++) {
         if (actor.isIntersect(this.actors[i])) {
            return this.actors[i];
         }
      }

   }

   obstacleAt(position, size, g) {
      var checkArguments = position && size
         && position instanceof Vector
         && size instanceof Vector

      if (!checkArguments) {
         throw new SyntaxError("Agruments is wrong");
      }

      var pos = new Actor(position);

      var wall = pos.left < 0 
         || pos.top < 0
         || pos.right > this.width;
      if (wall) return 'wall';

      if (pos.bottom > this.height) {
            return 'lava';
      }

      for (var y = 0; y < this.grid.length; y++) {
            for (var x = 0; x < this.grid[y].length; x++) {
                  var type = this.grid[y][x];
             
                  if (type === 'wall' || type === 'lava') {
                        var intersect = isIntersectRect(
                              pos.left, pos.right, pos.top, pos.bottom, 
                              x + 0.2, x + 1, y, y + 1
                        );                        

                        if (intersect) return type;
                  }
            }
      }
   }

   noMoreActors(type) {
      if (!type) return !this.actors.length;

      for (var i = 0; i < this.actors.length; i++) {
         if (this.actors[i].type === type) return true;
      }

      return false;
   }

   removeActor(actor) {
      for (var i = 0; i < this.actors.length; i++) {
         if (this.actors[i] === actor) {
            this.actors.splice(i, 1);
            return;
         };
      }

   }

   playerTouched(type, actor) {
      if (type === 'lava' || type === 'fireball') {
         this.status = 'lost';
         return;
      } 

      if (type === 'coin') {
         this.removeActor(actor);
      }

      var won = true;

      for (var i = 0; i < this.actors.length; i++) {
         if (this.actors[i].type === 'coin') {
            won = false;
            return;
         };
      }

      if (won) this.status = 'won';
   }
}

class LevelParser {
   constructor(actorCodes = {}) {
      this.actorCodes = actorCodes;
   }

   actorFromSymbol(symbol) {
      return this.actorCodes[symbol]; 
   }

   obstacleFromSymbol(symbol) {
      if (symbol === 'x') return 'wall';
      else if (symbol === '!') return 'lava';
   }

   createGrid(plan) {
      return plan.map((str) => {
         return str.split('').map(symbol => {
            return this.obstacleFromSymbol(symbol)
         });
      });
   }

   createActors(plan) {
      var actors = [];
      
      plan.forEach((str, y) => {
         str.split('').forEach((symbol, x) => {
            var constr = this.actorCodes[symbol];
            if ( !(typeof constr === 'function' && new constr instanceof Actor) ) return; 

            actors.push(new constr(new Vector(x, y)));
         });
      });

      return actors;
   }

   parse(plan) {
      return new Level(
         this.createGrid(plan),
         this.createActors(plan)
      );
   }
}

//other function
function isIntersectRect(ax1, ax2, ay1, ay2, bx1, bx2, by1, by2) {
      return isIntersectLines(ax1, ax2, bx1, bx2)
         && isIntersectLines(ay1, ay2, by1, by2);
}

function isIntersectLines(a1, a2, b1, b2) {
   if (a1 === b1 && a2 == b2) return true;

   return (b1 > a1 === b1 < a2) 
      || (b2 > a1 === b2 < a2) 
      || (a1 > b1 === a1 < b2) 
      || (a2 > b1 === a2 < b2);
}

    var schema = [
        "     v                                    ",
        " o                                        ",
        " x                                 xxxx   ",
        "                              o          o",
        "                           xxxxx          ",
        "  |xxx       w                            ",
        "  o                 o                o    ",
        "  x               = x              xxx    ",
        "  x          o o    x                     ",
        "  x  @    *  xxxxx  x                     ",
        "  xxxxx             x         xxx         ",
        "      x!!!!!!!!!!!!!x                     ",
        "      xxxxxxxxxxxxxxx                     ",
        "                                          "
      ];

    const actorDict = {
      '@': Player,
      'o': Coin,
    }
    const parser = new LevelParser(actorDict);
    const level = parser.parse(schema);
    runLevel(level, DOMDisplay);