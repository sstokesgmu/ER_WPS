import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const render = new THREE.WebGLRenderer();
render.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(render.domElement);

// Create a cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
cube.position.set(0,0,0)
scene.add(cube);

// Load GLTF model
const gltfLoader = new GLTFLoader();
gltfLoader.load('./assets/eldenRing map template.glb', (gltf) => {
    const map = gltf.scene;
    console.log(map);

    // Set the position of the model (if necessary)
    map.position.set(0, 0, 0); // Ensure it's within camera view

     // Calculate the bounding box of the loaded model
     const box = new THREE.Box3().setFromObject(map);
     const modelSize = new THREE.Vector3();
     box.getSize(modelSize); // This gives the dimensions of the model
 
     console.log('Model Size:', modelSize);

     // Compare cube size with model size
    const cubeSize = cube.geometry.parameters;
    console.log('Cube Size:', cubeSize);  // Outputs the dimensions of the cube (1x1x1)

 
    scene.add(map);
});

// Set camera position
camera.position.set(0, 5, 10); // Set a suitable camera position
camera.lookAt(0, 0, 0); // Look at the origin

// Add light
const light = new THREE.AmbientLight(0x404040); // Ambient light
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// Create OrbitControls (camera will orbit with mouse drag)
const controls = new OrbitControls(camera, render.domElement);

// Animation/render loop (even if no animation, it needs to update the controls)
function animate() {
    controls.update(); // Update the controls
    render.render(scene, camera);
    requestAnimationFrame(animate); // Keep calling animate recursively
}

animate(); // Start the animation loop
