import { distance, roundDownTwo } from "./math.js";
import {KDTree} from "./kdTree.js";
import boundaries from './coord.js'

//TryCatch




//Factory (Singleton) - Create structure to parse data
export class Factory {
  output = {};
  nativeObj = {};
  TREE;
  constructor(){ 
    console.log("Creating new Instance of Factory")
    //? Here we are losing the ability to define number of axes for out KD tree, Do we even want to? 
    this.TREE = new KDTree(2,Object.values(boundaries).flat());
  }
  Build(obj) {
    console.log(obj)
    //Store a copy of  the object 
    this.nativeObj = {...obj};
    console.log(this.nativeObj.coords2D)


    //TODO: Validate what properties the object has ? What does this mean 
    const nearest = this.TREE.NearestToTarget(this.nativeObj.coords2D);
    //! Add the result to the output
    this.output.location=new Location(nearest);
  }
  Send() {console.log(this.output)}
  //! We need to make sure build is called first before we start calling getters 
  GetLocation(){return this.output.location}
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




