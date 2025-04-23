import { distance, roundDownTwo } from "./math.js";
//TryCatch

//[0] = Ref points Dictionary Above and Below

class Zone {
  constructor(name, x, y) {
    this.name = name;
    (this.x = x), (this.y = y);
  }
  getName() {
    return this.name;
  }
  getCoordinates() {
    return [this.x, this.y];
  }
}
//Player Npcs
class Entity {
  constructor(location) {
    this.location = location;
  }
}

class Player extends Entity {
  constructor(location) {
    super();
  }
}

class NPC extends Entity {
  constructor() {}
}

export const Origins = new Map([
  ["Radagon", new Zone("Leyndell", 400, 400)],
  ["Godrick", new Zone("Limgrave", 200, 200)],
  ["StarRadan", new Zone("Caelid", 10, 10)],
]);

//Factory (Singleton) - Create structure to parse data
class Factory {
  output = {};
  constructor(firstPass, json) {
    this.firstPass = firstPass;
    this.json = json;
  }

  /*
    3 layer deep object - shit
   {
      player: {
          pos: {x,y}
          simpleStats: {hp, level, time played, mp, stamina}
          afflictions: {...}
      },
      npc :  { ...}

    }
  */

  //Deals with the subproperties get the possible keys from a DS: Set?
  checkData(data) {
    Object.keys().forEach((key, value) => {});
  }

  //Builds the output
  createOutput() {
    if (!this.firstPass) {
      let origin = this.findChunk(playerPos);
      output["origin"] = origin;
    }
    let player = {};
    player["position"] = this.handlePos(x, y);

    return this.output;
  }

  //Player
  handlePos(x, y) {
    return [roundDownTwo(x), roundDownTwo(y)];
  }

  //Origin
  findChunk(playerPos) {
    let minDistance = Infinity;
    let mapKey = null; // we don't know the key yet
    for (let [key, value] of Origins) {
      let dist = distance(...value.getCoordinates(), ...playerPos);
      if (dist < minDistance) {
        minDistance = dist;
        mapKey = key;
      }
    }
    return Origins.get(mapKey);
  }
  //NPC

  //KeyItems?
}

/*I don't know what to do with this
//  class Position {
//   constructor(x,y){ this.x = x; this.y = y;  }
 }*/
