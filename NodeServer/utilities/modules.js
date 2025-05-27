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
//Player Npcs Locations
//Roundtable Hold is not considered a map location more of a safe zone
 const LOCATIONS = {  
  regionURL: `https://eldenring.fanapis.com/api/locations?region:`
 }
 


//fetch request 

//Factory (Singleton) - Create structure to parse data
export class Factory {
  output = {};
  nativeObj = {};

  constructor(){}

  Desturct(obj)
  {
    this.nativeObj = obj 
    let {player, location, npcs} = obj
  
  
  }
  
  // -----------------------------------------------------------------------------------------------------------------------------------------------------------
  // Right now I pass a set of URLS necessary for the player and the npcs 
  // -----------------------------------------------------------------------------------------------------------------------------------------------------------
  async FetchData(url, ids)
  {


  }

  Rebuild(obj)
  {

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
