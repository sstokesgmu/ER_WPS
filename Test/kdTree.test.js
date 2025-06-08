const  KDTree  = require('./kdTree'); // Ensure this matches your export
let treeInstance;

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
    Liurnia: [ // ✅ fixed spelling
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
beforeAll(() => {
  const allPoints = Object.values(mapData).flat();
  treeInstance = new KDTree(2, allPoints); // Store in outer scope
});

describe("Testing singular points, player is stationary", () => {
     const testCases = [
    { input: [235.98, 50.3], expected: [235.98, 51.3] },
    { input: [140, 120.3], expected: [145.6, 117.79] },
    { input: [400, 100.0], expected: [424, 120] },
    { input: [35.98, -50.3], expected: [33.64, -43.98] },
    { input: [-2, -100], expected: [-4.94, -111.65] },
  ];
  testCases.forEach(({input, expected}) => {
    test(`Nearest point to [${input}] should be [${expected}]`, () => {
        const result = treeInstance.NearestToTarget(input).closestPoint.point;
        expect(result).toEqual(expected)
    })
  })
});

describe("Smooth player movement along X-axis with region printout", () => {
  const y = 50;
  const steps = Array.from({ length: 28 }, (_, i) => i * 10); // X: 0 to 270

  steps.forEach((x) => {
    test(`At X=${x}, Y=${y}`, () => {
      const result = treeInstance.NearestToTarget([x, y]);
      const nearest = result.closestPoint.point;

      // Find region
      let region = "Unknown";
      for (let key in mapData) {
        if (mapData[key].some((el) => el[0] === nearest[0] && el[1] === nearest[1])) {
          region = key;
          break;
        }
      }

      console.log(`Player at [${x}, ${y}] → Nearest: [${nearest}], Region: ${region}`);
      expect(nearest).toBeDefined();
    });
  });
});
 

