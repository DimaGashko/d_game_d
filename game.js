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
         value: 'actor',
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
      if (other.size.x <= 0 || other.size.y <= 0) return false;

      return (
            isIntersectLines(this.left, this.right, other.left, other.right)
         && isIntersectLines(this.top, this.bottom, other.top, other.bottom)
      );
   }

   act() {}
   
}

class Player {

}

class Level {

}

//other function
function isIntersectLines(a1, a2, b1, b2) {
   //Точки должны идти по порядку
   if (a1 > a2) [a1, a2] = [a2, a1];
   if (b1 > b2) [b1, b2] = [b2, b1];

   return !(a2 <= b1 || b2 <= a1);
}

//initGameObjects();

const level = new Level([
   new Array(3),
   ['wall', 'wall', 'lava']
]);

//runLevel(level, DOMDisplay);