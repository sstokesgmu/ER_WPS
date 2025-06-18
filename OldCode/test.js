import { Origins } from "./utilities/modules.js";
import { distance, roundDownTwo } from "./utilities/math.js";

let playerPos = [300, 10];

while (playerPos[1] > -50) {
  FindChunk(playerPos);
  playerPos[1] -= 10;
  playerPos[0] -= 50;
}

function FindChunk(playerPos) {
  let minDistance = Infinity;
  let targetKey = null;
  for (let [key, value] of Origins) {
    let dist = distance(...value.getCoordinates(), ...playerPos);
    if (dist < minDistance) {
      minDistance = dist;
      targetKey = key;
    }
  }
  console.log(
    `The shortest distance is ${minDistance} from ${targetKey} at ${Origins.get(targetKey).getName()} coordinates ${Origins.get(targetKey).getCoordinates()}`,
  );
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

