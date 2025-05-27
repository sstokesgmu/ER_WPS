//For KDTree we need a couple of things
//Nodes, A recursive functions, we need a way to way to insert new nodes into

class Node {
  constructor(point) {
    this.point = point;
    this.left = null;
    this.right = null;
  }

  print() {
    print(`Value ${this.point}, left: ${this.left} and right: ${this.right}`);
  }
}

class KDTree {
  constructor(k = 2, arr = null) {
    if (typeof k != "number") {
      console.warn("You sent a value that is not of type number for the key");
      this.k = 2;
    } else this.k = k;

    if (arr == null) throw Error("Array is null");
    arr.sort((a, b) => a[0] - b[0]);

    console.log("Choosing Median value");
    this.root = this.buildTree(arr, 0);
    this.depth = 0;
  }
  printRoot() {
    return console.log(this.root);
  }
  //Recursive method to creare KDTree

  // Recursive method to create KDTree
  buildTree(arr, depth) {
    // Base case: if the array is empty, return null
    if (arr.length === 0) return null;
    // Find the axis to split on (using depth % k to alternate between axes)
    const axis = depth % this.k;
    // Sort points based on the current axis
    arr.sort((a, b) => a[axis] - b[axis]);
    console.log(arr);
    // Find the median point (this will be the root node at this level)
    const medianIndex = Math.floor(arr.length / 2);
    const medianPoint = arr[medianIndex];
    // Create a new node for the median point
    const node = new Node(medianPoint);
    // Recursively build the left and right subtrees
    // Left subtree contains all points before the median
    node.left = this.buildTree(arr.slice(0, medianIndex), depth + 1);
    // Right subtree contains all points after the median
    node.right = this.buildTree(arr.slice(medianIndex + 1), depth + 1);
    this.depth = depth;
    return node; // this node still refers to the root
  }
  //Find the nearest neighbor to points
  search(point, depth) {
    //point is null depth = 0
    //recursive case
  }
}
// const points = [
//   [3, 6],
//   [17, 15],
//   [13, 15],
//   [6, 12],
//   [9, 1],
//   [2, 7],
//   [10, 19],
// ];

let limgrave = [
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
];

let Calied = [
  [151.76, 30.32],
  [122.07, -82.49],
  [162.27, -23.74],
  [38.83, -82.52],
  [145.6, 117.79],
  [345.36, 14.79],
  [-4.94, -111.65],
  [91.76, 18.11],
  [33.64, -43.98],
];

let Liurinia = [
  [337.97, -71.04],
  [151.21, -63.07],
  [235.98, 51.3],
  [261.09, -65.16],
  [476.0, 11.35],
  [367, -62.62],
  [424, 120],
  [288.41, 82.06],
];

const points = [...Calied, ...Liurinia, ...limgrave];

const tree = new KDTree(null, points); // Create an instance of KTree
tree.printRoot();
// points.forEach((point) => tree.insert(point));
// tree.print();
