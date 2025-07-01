import "./App.css";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, useHelper } from "@react-three/drei";
import { useControls } from "leva";

import { useRef, useEffect } from "react";

import socketService from "./scripts/socket";
("./scripts/socket");

export default function App() {
  useEffect(() => {
    socketService.connect();
    // return () => socketService.disconnect();
  }, []);

  // Send messages when needed
  const passData = () => {
    socketService.passMessage({ type: "someAction", data: "someValue" });
  };
  const BoxHelper = () => {
    const ref = useRef();
    useHelper(ref, THREE.BoxHelper, "black");
    const { position, color, opacity, transparent } = useControls({
      position: { x: 0, y: 0.5, z: 0 },
      color: "gray",
      opacity: { value: 0.4, min: 0, max: 1, step: 0.01 },
      transparent: true,
    });
    return (
      <mesh ref={ref} position={[...Object.values(position)]}>
        <boxGeometry />
        <meshBasicMaterial
          color={color}
          transparent={transparent}
          opacity={opacity}
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
      <button onClick={passData}>Pass Data</button>
    </>
    
  );
}

