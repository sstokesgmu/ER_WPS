import "./App.css";

import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, useHelper } from "@react-three/drei";
import { useControls } from "leva";

import { useState, useRef, useEffect } from "react";

import socketService from "./scripts/socket"; //? is this a smart choice

export default function App() {
  //Initialize a connection
  useEffect(() => {
    socketService.connect();  
    //Create Clean up functions
  }, []);



const BoxHelper = () => {
  const ref = useRef();
  useHelper(ref, THREE.BoxHelper, "black");

  const GUI = useControls({
    position: { x: 0, y: 0, z: 0 },
    color: "gray",
    opacity: { value: 0.4, min: 0, max: 1, step: 0.01 },
    transparent: true,
  });

  const runtimePosition = useRef(new THREE.Vector3(GUI.position.x, GUI.position.y, GUI.position.z));

  useFrame((_, delta) => {
    // Process new socket data
    if (socketService?.message.length >= 1) {
      const { origin, coords2D } = socketService.message[0].data;

      console.log(`Origin: ${origin}`);
      console.log(`Coords: ${coords2D}`);

      runtimePosition.current.set(coords2D[0], 0, coords2D[1]);

      // Clean up the processed message
      socketService.message.shift();
    }

    // Animate position
    if (ref.current) {
      const blend = 1 - Math.exp(-5 * delta); // 5 = speed factor
      ref.current.position.lerp(runtimePosition.current, blend);
    }
  });

    return (
      <mesh ref={ref}>
        <boxGeometry />
        <meshBasicMaterial
          color={GUI.color}
          transparent={GUI.transparent}
          opacity={GUI.opacity}
        />
      </mesh>
    );
  };



  return (
    <>
      <Canvas camera={{ position: [2, 2, 2] }}>
      <OrbitControls />
      <axesHelper />
      <Grid
        sectionSize={1}
        sectionColor={"black"}
        sectionThickness={1}
        cellSize={1}
        cellColor={"gray"}
        cellThickness={0.5}
        infiniteGrid
        fadeDistance={50}
        fadeStrength={1}
      />
      <BoxHelper />
      </Canvas>
      {/* <button onClick={passData}>Pass Data</button> */}
    </>
    
  );
}

