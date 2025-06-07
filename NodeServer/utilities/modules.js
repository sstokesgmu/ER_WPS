import { distance, roundDownTwo } from "./math.js";
import { KDTree } from "../kdTree.js";


//TryCatch

const mapData = {
  Limgrave: [
    [73.8, 347.3],
    [340.9, 603.8],
    [90.5, 123.2],
    [63.36, -88.02],
    [36.4, -69.14],
    [54.27, -26.14],
    [104.47, -114.78],
    [0, 44.8],
    [-8.8, -18.51],
    [98.48, 112.97],
  ],
  Calied: [
    [151.76, 30.32],
    [122.07, -82.49],
    [162.27, -23.74],
    [38.83, -82.52],
    [145.6, 117.79],
    [345.36, 14.79],
    [-4.94, -111.65],
    [91.76, 18.11],
    [33.64, -43.98],
  ],
  Liurinia: [
    [337.97, -71.04],
    [151.21, -63.07],
    [235.98, 51.3],
    [261.09, -65.16],
    [476.0, 11.35],
    [367, -62.62],
    [424, 120],
    [288.41, 82.06],
  ],
};

//Player Npcs Locations
//Roundtable Hold is not considered a map location more of a safe zone
//  const LOCATIONS = {  
//   regionURL: `https://eldenring.fanapis.com/api/locations?region:`
//  } 

//Factory (Singleton) - Create structure to parse data
export class Factory {
  #output = {};
  nativeObj = {};
  TREE;
  constructor(){ 
    console.log("Creating new Instance of Factory")
    //? Here we are losing the ability to define number of axes for out KD tree, Do we even want to? 
    this.TREE = new KDTree(2,Object.values(mapData).flat());
  }
  Build(obj) {
    console.log(obj)
    //Store a copy of  the object 
    this.nativeObj = {...obj};
    console.log(this.nativeObj.coords2D)

    //TODO: Validate what properties the object has 
    const nearest = this.TREE.NearestToTarget(this.nativeObj.coords2D);


    //! Add the result to the output
    this.#output.location=new Location(nearest);
  }
  Send() {
      console.log(this.#output)
  }

  //! We need to make sure build is called first before we start calling getters 
  GetLocation(){return this.#output.location}
}

class Location {
  #region = undefined;
  #nearestCoords = undefined;
  #distanceTo = undefined;
  constructor (point)
  {
    this.#nearestCoords=point.closestPoint.point;
    this.#distanceTo = roundDownTwo(point.minDistance);
    for (let key in mapData){
      if(mapData[key].some(el => el == point.closestPoint.point))
      {
        this.#region = key; break;
      }
    }
  }
  // Expose as plain object for debug or export
  toObject() {
    return {
      region: this.#region,
      nearestCoords: this.#nearestCoords,
      distanceTo: this.#distanceTo
    };
  }

  //Getters 
  GetRegion(){return this.#region}
}




  // //Deals with the subproperties get the possible keys from a DS: Set?
  // checkData(data) {
  //   Object.keys().forEach((key, value) => {});
  // }

  // //Builds the output
  // createOutput() {
  //   if (!this.firstPass) {
  //     let origin = this.findChunk(playerPos);
  //     output["origin"] = origin;
  //   }
  //   let player = {};
  //   player["position"] = this.handlePos(x, y);

  //   return this.output;
  // }

  // //Player
  // handlePos(x, y) {
  //   return [roundDownTwo(x), roundDownTwo(y)];
  // }

