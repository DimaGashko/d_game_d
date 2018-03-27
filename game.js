'use strict';

class Vector {
   constructor(x = 0, y = 0) {
      this.x = x;
      this.y = y;
   }

   plus(addVector) {
      if ( !(addVector instanceof Vector) ) {
         throw new SyntaxError("Agruments is wrong");
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

   isIntersect(otherActor) {
      if ( !(otherActor instanceof Actor) ) {
         throw new SyntaxError("Agruments is wrong");
      }

      if (this === otherActor) return false;
      return true;
   }

   act() {

   }
   
}

class Player {

}

class Level {

}

 

//initGameObjects();

const level = new Level([
   new Array(3),
   ['wall', 'wall', 'lava']
]);

//runLevel(level, DOMDisplay);