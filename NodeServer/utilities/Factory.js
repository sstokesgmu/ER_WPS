import { distance, roundDownTwo } from "./math.js";
import {KDTree} from "./kdTree.js";
import boundaries from './coord.js'

//TryCatch




//Factory (Singleton) - Create structure to parse data
export class Factory {
  output = {};
  nativeObj = {};
  fullTree = null;
  //regionTrees;
  constructor(region = null){ 
    console.log("Creating new Instance of Factory")
    //? Here we are losing the ability to define number of axes for out KD tree, Do we even want to? 
    this.fullTree = new KDTree(2,Object.values(boundaries).flat());
    
    // this.regionTrees = {
    //   Limgrave: new KDTree(2,Object.values(boundaries.Limgrave)),
    //   Caelid: new KDTree(2,Object.values(boundaries.Caelid)),
    //   Liurnia: new KDTree(2,Object.values(boundaries.Liurinia))
    // }
  }

  Build(nativeObj, ...args) {
    //Right now we will have a player object contains the    
    
    /**
     * nativeObj = {
     *  player: ...
     *  location: ... 
     *  npcs: ... 
     * }
     */

      const {player, location} = nativeObj;

      console.log(player.coords2D)
      //Check to see if the location is correct
      this.DoFullSearch(player.coords2D);
      console.log(`Lua Server Location is ${location} while Node server location is ${this.output.location.region}`);

    // if (this.obj.region){
    //     const nearest = this.regionTrees[this.obj.region].NearestToTarget(this.obj.coords2D);
    //     this.output.location = new Location(nearest);
    // }
  }


  Send() {console.log(this.output)}
  //! We need to make sure build is called first before we start calling getters 
  GetLocation(){return this.output.location}
  DoFullSearch(coords2D){
    // console.log(this.fullTree); //TODO: Null check to see if the full tree is active
    const nearest = this.fullTree.NearestToTarget(coords2D);
    this.output.location = new Location(nearest);
    // this.fullTree = null; //Free up memory
  }
}

//Player Npcs Locations
//Roundtable Hold is not considered a map location more of a safe zone
//  const LOCATIONS = {  
//   regionURL: `https://eldenring.fanapis.com/api/locations?region:`
//  } 


class Location {
  region = undefined;
  nearestCoords = undefined;
  distanceTo = undefined;
  constructor (point)
  {
    this.nearestCoords=point.closestPoint.point;
    this.distanceTo = roundDownTwo(point.minDistance);
    for (let key in boundaries){
      if(boundaries[key].some(el => el == point.closestPoint.point))
      {
        this.region = key; break;
      }
    }
  }
  // Expose as plain object for debug or export
  toObject() {
    return {
      region: this.region,
      nearestCoords: this.nearestCoords,
      distanceTo: this.distanceTo
    };
  }
  //Getters 
  GetRegion(){return this.region}
}




