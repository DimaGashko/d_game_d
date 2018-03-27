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
      
      return (
            isIntersectLines(this.left, this.right, other.left, other.right)
         && isIntersectLines(this.top, this.bottom, other.top, other.bottom)
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

class Level {
   constructor(grid, actors = []) {
      this.height = (grid) ? grid.length : 0;
      this.width = (grid && grid[0]) ? grid[0].length : 0;
      this.status = null;
      this.finishDelay = 1;
      this.actors = actors;

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
}

//other function
function isIntersectLines(a1, a2, b1, b2) {
   if (a1 === b1 && a2 == b2) return true;

   return (b1 > a1 === b1 < a2) 
      || (b2 > a1 === b2 < a2) 
      || (a1 > b1 === a1 < b2) 
      || (a2 > b1 === a2 < b2);
}