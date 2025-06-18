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
      //console.log("Found Leaf Node ... Begining Back Tracking ...");
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
    //console.log("Calculating distance between target and point...");
    const length = point1.length;
    let cumulative = 0;
    for (let i = 0; i < length; i++) {
      let value = (point2[i] - point1[i]) ** 2;
      cumulative += value;
    }
    return Math.sqrt(cumulative);
  }
}

export default KDTree;