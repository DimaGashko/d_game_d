'use strict';

class Vector {
   constructor(x = 0, y = 0) {
      this.x = x;
      this.y = y;
   }

   plus(addVector) {
      if ( !(addVector instanceof Vector) ) {
         throw "It's not Vector";
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
      if ( !(pos instanceof Vector)) {}

      this.pos = pos;
      this.size = size;
      this.speed = speed;

      Object.defineProperty(this, 'type', {
         value: 'actor',
         writable: false,
      });
   }

   act() {

   }   
   
}

class Player {

}

class Level {

}

 

initGameObjects();

const level = new Level([
   new Array(3),
   ['wall', 'wall', 'lava']
]);

//runLevel(level, DOMDisplay);