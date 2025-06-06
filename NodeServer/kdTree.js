class Node {
  constructor(point, depth) {
    (this.point = point), this.left, this.right, (this.splittingAxis = depth);
  }
  //? When I start to assign left and right do I need to do a type check
}
class KDTree {
  constructor(k = 2, arr = null) {
    if (typeof k != "number") {
      console.warn("You sent a vlaue that is not of type nuumber for the key");
      this.k = arr[0].length;
    } else {
      if (k < 2) k = arr[0].length;
      this.k = k;
    }
    if (arr == null) throw Error("Array is null");
    console.log("Building Tree ...");
    this.root = this.BuildTree(arr, 0);
    this.treeDepth = 0;
  }
  PrintRoot() {
    return console.log(
      `This is the root: ${this.root} and this is the depth level: ${this.treeDepth}`,
    );
  }
  BuildTree(array, depth) {
    //? What is the base case of thi
    //
    if (array.length <= 0) return null;
    const splittingAxis = depth % this.k;
    //console.log(`Axis:${splittingAxis}`);
    //* Ascending Numeric Sort
    array.sort((a, b) => a[splittingAxis] - b[splittingAxis]);
    const index = Math.floor(array.length / 2);
    const medianAtAxis = array[index];
    //* On the first interation this would be the
    const node = new Node(medianAtAxis, splittingAxis);
    node.left = this.BuildTree(array.slice(0, index), depth + 1);
    node.right = this.BuildTree(array.slice(index + 1), depth + 1);
    this.treeDepth = depth; //? Do we need the tree depth;
    return node;
  }
  NearestToTarget(target, currentNode = this.root, depth = 0) {
    //Find the closest leaf node based through comparing axes
    let obj = {
      closestPoint: null,
      minDistance: Infinity,
    };
    // console.log("Finding the nearest node to target ...");
    // console.log(currentNode);
    //? How do know if the current node is the leaf : ANSWER they have no children nodes (left and right = null)

    if (currentNode.left == null && currentNode.right == null) {
      console.log("Found Leaf Node ... Begining Back Tracking ...");
      return {
        closestPoint: currentNode,
        minDistance: this.DistanceTo(target, currentNode.point),
      };
    }

    const splittingAxis = depth % this.k;
    // splittingAxis == 0 ? console.log(`Comparing based on the X Axis ${splittingAxis}`) : console.log(`Comparing based on the Y Axis ${splittingAxis}`)
    if (
      target[splittingAxis] >= currentNode.point[splittingAxis] &&
      currentNode.right != null
    ) {
      obj = this.NearestToTarget(target, currentNode.right, depth + 1);
    } else if (currentNode.left != null) {
      obj = this.NearestToTarget(target, currentNode.left, depth + 1);
    }

    //* Peek if the axis is different from splitting axis of the node

    // if(obj.closestPoint.splittingAxis != currentNode.splittingAxis){
    //   console.log("There is a possible better point on the other side of this axis: " + currentNode.point);
    //   console.log("This calls spliting axis was:  " + splittingAxis)
    //   console.log("This is the current best guess' splitting axis: " + obj.closestPoint.splittingAxis)
    // }

    //* Is the parent node actually closer than the original min distance
    if (this.DistanceTo(target, currentNode.point) < obj.minDistance) {
      obj = {
        closestPoint: currentNode,
        minDistance: this.DistanceTo(target, currentNode.point),
      };
    } else if (obj.closestPoint.splittingAxis != currentNode.splittingAxis) {
      //* Do a search on the next axis
      if (
        target[splittingAxis] >= currentNode.point[splittingAxis] &&
        currentNode.right != null
      ) {
        obj = this.NearestToTarget(target, currentNode.right, depth + 1);
      } else if (currentNode.left != null) {
        obj = this.NearestToTarget(target, currentNode.left, depth + 1);
      }
    }

    return obj;
  }
  DistanceTo(point1, point2) {
    //! Assuming this is an array
    console.log("Calculating distance between target and point...");
    const length = point1.length;
    let cumulative = 0;
    for (let i = 0; i < length; i++) {
      let value = (point2[i] - point1[i]) ** 2;
      cumulative += value;
    }
    return Math.sqrt(cumulative);
  }
}
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
const points = Object.values(mapData).flat();
const tree = new KDTree(null, points);
tree.PrintRoot();
console.log("The target point is: " + [122, -85]);
let a = tree.NearestToTarget([300, 129], tree.root);
console.log(a);

for (let key in mapData) {
  mapData[key].some((el) => {
    return el == a.closestPoint.point;
  })
    ? console.log(`Player is located in ${key}`)
    : null;
}
